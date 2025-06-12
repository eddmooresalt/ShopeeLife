"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { type GameState, TabType, type LocationType, QuestType, type RandomEvent } from "@/types/game"
import { initialGameState, gameData } from "@/data/gameData"
import {
  saveGame,
  loadGame,
  calculateLunchProgress,
  generateDailyQuests,
  getGameDay,
  performSmokingAction,
  processGameTick,
  getLevelRank,
  calculatePlayerGrade,
  generateSeaTalkMessage,
} from "@/utils/gameUtils"
import { GameHeader } from "@/components/GameHeader"
import { BottomNavigation } from "@/components/BottomNavigation"
import { OfficeTab } from "@/components/tabs/OfficeTab"
import { TasksTab } from "@/components/tabs/TasksTab"
import { LunchTab } from "@/components/tabs/LunchTab"
import { ShopTab } from "@/components/tabs/ShopTab"
import { CharacterTab } from "@/components/tabs/CharacterTab"
import { SeaTalkTab } from "@/components/tabs/SeaTalkTab"
import { NavigateTab } from "@/components/tabs/NavigateTab"
import { PortalTab } from "@/components/tabs/PortalTab"
import { LunchReminderModal } from "@/components/LunchReminderModal"
import { InternalThoughtPopup } from "@/components/InternalThoughtPopup"
import { OvertimePromptModal } from "@/components/OvertimePromptModal"
import { SleepScreen } from "@/components/SleepScreen"
import { RandomEventModal } from "@/components/RandomEventModal"
import { ToiletLocation } from "@/components/locations/ToiletLocation"
import { SmokingAreaLocation } from "@/components/locations/SmokingAreaLocation"

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Office)
  const [internalThought, setInternalThought] = useState<string | null>(null)
  const [showLunchReminder, setShowLunchReminder] = useState(false)
  const [showOvertimePrompt, setShowOvertimePrompt] = useState(false)
  const [showSleepScreen, setShowSleepScreen] = useState(false)
  const [showRandomEvent, setShowRandomEvent] = useState(false)
  const [currentRandomEvent, setCurrentRandomEvent] = useState<RandomEvent | null>(null)

  // Lunch progress states
  const [isEatingLunch, setIsEatingLunch] = useState(false)
  const [lunchProgress, setLunchProgress] = useState(0)
  const [eatingLunchItemId, setEatingLunchItemId] = useState<string | null>(null)
  const [eatingLunchLocationId, setEatingLunchLocationId] = useState<string | null>(null)
  const lunchTimerRef = useRef<NodeJS.Timeout | null>(null)
  const LUNCH_DURATION_SECONDS = 5 // Duration for lunch action

  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const internalThoughtTimerRef = useRef<NodeJS.Timeout | null>(null)

  const currentDay = getGameDay(gameState.gameTime)
  const currentHour = Math.floor(gameState.gameTime / 60) % 24

  const [isWorking, setIsWorking] = useState(false)
  const [workingTaskId, setWorkingTaskId] = useState<string | null>(null)
  const [workProgress, setWorkProgress] = useState(0)
  const workTimerRef = useRef<NodeJS.Timeout | null>(null)
  const workStartTimeRef = useRef<number>(0)
  const workDurationSeconds = 10

  useEffect(() => {
    const savedState = loadGame()
    if (savedState) {
      setGameState(savedState)
    } else {
      const initialQuests = generateDailyQuests(currentDay, gameData)
      setGameState((prev) => ({ ...prev, dailyQuests: initialQuests }))
    }
  }, [])

  useEffect(() => {
    saveGame(gameState)
  }, [gameState])

  useEffect(() => {
    if (internalThought) {
      if (internalThoughtTimerRef.current) {
        clearTimeout(internalThoughtTimerRef.current)
      }
      internalThoughtTimerRef.current = setTimeout(() => {
        setInternalThought(null)
      }, 3000)
    }
    return () => {
      if (internalThoughtTimerRef.current) {
        clearTimeout(internalThoughtTimerRef.current)
      }
    }
  }, [internalThought])

  useEffect(() => {
    gameIntervalRef.current = setInterval(() => {
      setGameState((prevGameState) => {
        const newGameState = processGameTick(prevGameState, gameData)

        if (newGameState._triggerLunchReminder) {
          setShowLunchReminder(true)
          newGameState._triggerLunchReminder = false
        }
        if (newGameState._triggerOvertimePrompt) {
          setShowOvertimePrompt(true)
          newGameState._triggerOvertimePrompt = false
        }
        if (newGameState._triggerSleepScreen) {
          setShowSleepScreen(true)
          newGameState._triggerSleepScreen = false
        }
        if (newGameState._triggerRandomEvent && newGameState._currentRandomEvent) {
          setCurrentRandomEvent(newGameState._currentRandomEvent)
          setShowRandomEvent(true)
          newGameState._triggerRandomEvent = false
          newGameState._currentRandomEvent = null
        }
        if (newGameState._internalThoughtQueue && newGameState._internalThoughtQueue.length > 0) {
          setInternalThought(newGameState._internalThoughtQueue.shift() || null)
        }

        return newGameState
      })
    }, 1000)

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current)
      }
    }
  }, [currentDay])

  useEffect(() => {
    if (isWorking && workingTaskId) {
      workStartTimeRef.current = Date.now()
      workTimerRef.current = setInterval(() => {
        const elapsedTime = (Date.now() - workStartTimeRef.current) / 1000
        const progress = Math.min(100, (elapsedTime / workDurationSeconds) * 100)
        setWorkProgress(progress)

        if (progress >= 100) {
          if (workTimerRef.current) {
            clearInterval(workTimerRef.current)
          }
          setIsWorking(false)
          setWorkingTaskId(null)
          setWorkProgress(0)

          setGameState((prev) => {
            const taskIndex = prev.tasks.findIndex((t) => t.id === workingTaskId)
            if (taskIndex === -1) return prev

            const task = { ...prev.tasks[taskIndex] }
            let expGained = 0
            let shopeeCoinsGained = 0
            let burnoutEffect = 0

            if (!task.isCompleted) {
              task.isCompleted = true
              expGained = task.rewardExp
              shopeeCoinsGained = task.rewardCoins
              burnoutEffect = task.burnoutEffect || 0

              setTimeout(() => {
                let message = `Task "${task.name}" completed! You earned ${expGained} EXP and ${shopeeCoinsGained} SC.`
                if (burnoutEffect !== 0) {
                  message += ` Burnout: ${burnoutEffect > 0 ? "+" : ""}${burnoutEffect}.`
                }
                setInternalThought(message)
              }, 0)
            }

            const updatedTasks = [...prev.tasks]
            updatedTasks[taskIndex] = task

            return {
              ...prev,
              tasks: updatedTasks,
              exp: prev.exp + expGained,
              shopeeCoins: prev.shopeeCoins + shopeeCoinsGained,
              stats: {
                ...prev.stats,
                burnout: Math.max(0, Math.min(100, prev.stats.burnout + burnoutEffect)),
              },
            }
          })
        }
      }, 100)
    } else {
      if (workTimerRef.current) {
        clearInterval(workTimerRef.current)
      }
    }
    return () => {
      if (workTimerRef.current) {
        clearInterval(workTimerRef.current)
      }
    }
  }, [isWorking, workingTaskId])

  // Lunch progress effect
  useEffect(() => {
    if (isEatingLunch && eatingLunchItemId && eatingLunchLocationId) {
      const lunchStartTime = Date.now()
      lunchTimerRef.current = setInterval(() => {
        const elapsedTime = (Date.now() - lunchStartTime) / 1000
        const progress = Math.min(100, (elapsedTime / LUNCH_DURATION_SECONDS) * 100)
        setLunchProgress(progress)

        if (progress >= 100) {
          if (lunchTimerRef.current) {
            clearInterval(lunchTimerRef.current)
          }
          setIsEatingLunch(false)
          setEatingLunchItemId(null)
          setEatingLunchLocationId(null)
          setLunchProgress(0)
          // Trigger the actual lunch effect after progress bar completes
          handleLunchComplete(eatingLunchLocationId, eatingLunchItemId)
        }
      }, 100) // Update every 100ms for smooth progress
    } else {
      if (lunchTimerRef.current) {
        clearInterval(lunchTimerRef.current)
      }
    }
    return () => {
      if (lunchTimerRef.current) {
        clearInterval(lunchTimerRef.current)
      }
    }
  }, [isEatingLunch, eatingLunchItemId, eatingLunchLocationId])

  const handleWork = useCallback(
    (taskId: string) => {
      if (isWorking) {
        setInternalThought("Already working on a task!")
        return
      }
      const task = gameState.tasks.find((t) => t.id === taskId)
      if (!task || task.isCompleted || gameState.stats.energy < task.energyCost) {
        setInternalThought("Cannot start task: already completed, not enough energy, or invalid task.")
        return
      }

      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          energy: Math.max(0, prev.stats.energy - task.energyCost),
        },
      }))

      setIsWorking(true)
      setWorkingTaskId(taskId)
      setWorkProgress(0)
      setInternalThought(`Starting work on "${task.name}"...`)
    },
    [gameState, isWorking],
  )

  // New function to start the lunch progress bar
  const handleEatLunchStart = useCallback(
    (locationId: string, itemId: string) => {
      const item = gameData.lunchItems.find((i) => i.id === itemId)
      if (!item) {
        setInternalThought("Invalid lunch item selected.")
        return
      }
      if (gameState.shopeeCoins < item.price) {
        setInternalThought(`Not enough ShopeeCoins for ${item.name}. You need ${item.price} SC.`)
        return
      }
      if (gameState.hasEatenLunch) {
        setInternalThought("You've already had lunch today. No more food for you!")
        return
      }
      const currentHour = Math.floor(gameState.gameTime / 60) % 24
      const isLunchTime = currentHour >= 12 && currentHour < 14
      if (!isLunchTime) {
        setInternalThought("It's not lunch time yet! Come back between 12:00 PM - 2:00 PM.")
        return
      }

      setIsEatingLunch(true)
      setEatingLunchItemId(itemId)
      setEatingLunchLocationId(locationId)
      setLunchProgress(0)
      setInternalThought(`Preparing to enjoy ${item.name}...`)
    },
    [gameState.shopeeCoins, gameState.hasEatenLunch, gameState.gameTime],
  )

  // Renamed from handleLunch to handleLunchComplete, now called after progress bar
  const handleLunchComplete = useCallback(
    (locationId: string, itemId: string) => {
      setGameState((prev) => {
        const { updatedState, internalThought: lunchThought } = calculateLunchProgress(
          prev,
          locationId,
          itemId,
          gameData.lunchLocations,
          gameData.lunchItems,
        )
        setInternalThought(lunchThought)

        const updatedDailyQuests = updatedState.dailyQuests.map((quest) => {
          if (quest.type === QuestType.Lunch && quest.criteria?.lunchItemId === itemId && !quest.isCompleted) {
            return { ...quest, currentProgress: (quest.currentProgress || 0) + 1 }
          }
          return quest
        })

        return { ...updatedState, dailyQuests: updatedDailyQuests }
      })
      setShowLunchReminder(false)
    },
    [gameData.lunchLocations, gameData.lunchItems],
  )

  const handleBuyItem = useCallback(
    (itemId: string) => {
      setGameState((prev) => {
        const itemToBuy = gameData.shopItems.find((item) => item.id === itemId)
        if (!itemToBuy || prev.shopeeCoins < itemToBuy.price) {
          setInternalThought("Not enough ShopeeCoins to buy this item!")
          return prev
        }

        let updatedShopItems = [...prev.shopItems]
        const updatedWardrobe = [...prev.wardrobe]
        let updatedConsumablesInventory = [...prev.consumablesInventory]
        let internalThoughtMessage: string | null = null

        if (itemToBuy.type === "consumable") {
          const existingConsumable = updatedConsumablesInventory.find((c) => c.itemId === itemId)
          if (existingConsumable) {
            const quantityToAdd = itemId === "marlboro-cigarettes" ? 20 : 1
            updatedConsumablesInventory = updatedConsumablesInventory.map((c) =>
              c.itemId === itemId ? { ...c, quantity: c.quantity + quantityToAdd } : c,
            )
          } else {
            const initialQuantity = itemId === "marlboro-cigarettes" ? 20 : 1
            updatedConsumablesInventory.push({ itemId: itemId, quantity: initialQuantity })
          }
          internalThoughtMessage = `You bought ${itemToBuy.name}. It's been added to your inventory.`
        } else if (itemToBuy.type === "equipment") {
          updatedShopItems = updatedShopItems.map((item) => (item.id === itemId ? { ...item, isBought: true } : item))
          internalThoughtMessage = `You bought ${itemToBuy.name}. Its effects are now active!`
        } else if (itemToBuy.type === "wardrobe") {
          updatedShopItems = updatedShopItems.map((item) => (item.id === itemId ? { ...item, isBought: true } : item))
          updatedWardrobe.push(itemId)
          internalThoughtMessage = `You bought ${itemToBuy.name}. Check your Character tab to wear it!`
        }

        let updatedStats = { ...prev.stats }
        if (itemToBuy.type === "consumable" && itemToBuy.effect) {
          updatedStats = {
            energy: Math.min(100, Math.max(0, updatedStats.energy + (itemToBuy.effect.energy || 0))),
            productivity: Math.min(100, Math.max(0, updatedStats.productivity + (itemToBuy.effect.productivity || 0))),
            burnout: Math.min(100, Math.max(0, updatedStats.burnout + (itemToBuy.effect.burnout || 0))),
          }
          if (itemToBuy.effect.exp) prev.exp += itemToBuy.effect.exp
          if (itemToBuy.effect.shopeeCoins) prev.shopeeCoins += itemToBuy.effect.shopeeCoins
        }

        setInternalThought(internalThoughtMessage)

        const updatedDailyQuests = prev.dailyQuests.map((quest) => {
          if (quest.type === QuestType.Shop && quest.criteria?.shopItemId === itemId && !quest.isCompleted) {
            return { ...quest, currentProgress: (quest.currentProgress || 0) + 1 }
          }
          return quest
        })

        return {
          ...prev,
          shopeeCoins: prev.shopeeCoins - itemToBuy.price,
          shopItems: updatedShopItems,
          wardrobe: updatedWardrobe,
          consumablesInventory: updatedConsumablesInventory,
          stats: updatedStats,
          dailyQuests: updatedDailyQuests,
        }
      })
    },
    [gameData.shopItems],
  )

  const handleUseConsumable = useCallback(
    (itemId: string) => {
      setGameState((prev) => {
        const itemInInventoryIndex = prev.consumablesInventory.findIndex((c) => c.itemId === itemId)
        if (itemInInventoryIndex === -1 || prev.consumablesInventory[itemInInventoryIndex].quantity <= 0) {
          setInternalThought("You don't have this item or it's out of stock!")
          return prev
        }

        const itemInInventory = prev.consumablesInventory[itemInInventoryIndex]
        const shopItem = gameData.shopItems.find((s) => s.id === itemId)

        if (!shopItem || shopItem.type !== "consumable") {
          setInternalThought("This item cannot be consumed.")
          return prev
        }

        let updatedConsumablesInventory = [...prev.consumablesInventory]
        updatedConsumablesInventory[itemInInventoryIndex] = {
          ...itemInInventory,
          quantity: itemInInventory.quantity - 1,
        }

        updatedConsumablesInventory = updatedConsumablesInventory.filter((c) => c.quantity > 0)

        let updatedStats = { ...prev.stats }
        let expGained = 0
        let shopeeCoinsGained = 0

        if (shopItem.effect) {
          updatedStats = {
            energy: Math.min(100, Math.max(0, updatedStats.energy + (shopItem.effect.energy || 0))),
            productivity: Math.min(100, Math.max(0, updatedStats.productivity + (shopItem.effect.productivity || 0))),
            burnout: Math.min(100, Math.max(0, updatedStats.burnout + (shopItem.effect.burnout || 0))),
          }
          expGained = shopItem.effect.exp || 0
          shopeeCoinsGained = shopItem.effect.shopeeCoins || 0
        }

        setInternalThought(`You used ${shopItem.name}.`)

        return {
          ...prev,
          consumablesInventory: updatedConsumablesInventory,
          stats: updatedStats,
          exp: prev.exp + expGained,
          shopeeCoins: prev.shopeeCoins + shopeeCoinsGained,
        }
      })
    },
    [gameData.shopItems],
  )

  const handleNavigate = useCallback((location: LocationType) => {
    setGameState((prev) => {
      const updatedDailyQuests = prev.dailyQuests.map((quest) => {
        if (quest.type === QuestType.Navigate && quest.criteria?.locationId === location.id && !quest.isCompleted) {
          return { ...quest, currentProgress: (quest.currentProgress || 0) + 1 }
        }
        return quest
      })

      return { ...prev, currentLocation: location.id, dailyQuests: updatedDailyQuests }
    })
    setActiveTab(location.tabType)
  }, [])

  const handleNavigateToLocation = useCallback(
    (locationId: string) => {
      const location = gameData.locations.find((loc) => loc.id === locationId)
      if (location) {
        handleNavigate(location)
      } else {
        setInternalThought(`Could not find location: ${locationId}`)
      }
    },
    [handleNavigate],
  )

  const handleClaimDailyQuest = useCallback((questId: string) => {
    setGameState((prev) => {
      const questIndex = prev.dailyQuests.findIndex((q) => q.id === questId)
      if (questIndex === -1 || prev.dailyQuests[questIndex].isClaimed) return prev

      const quest = { ...prev.dailyQuests[questIndex] }
      if (!quest.isCompleted) {
        setInternalThought("This quest is not yet completed!")
        return prev
      }

      const updatedDailyQuests = [...prev.dailyQuests]
      updatedDailyQuests[questIndex] = { ...quest, isClaimed: true }

      setInternalThought(`Quest completed! You claimed ${quest.rewardExp} EXP and ${quest.rewardCoins} SC.`)

      return {
        ...prev,
        exp: prev.exp + quest.rewardExp,
        shopeeCoins: prev.shopeeCoins + quest.rewardCoins,
        dailyQuests: updatedDailyQuests,
      }
    })
  }, [])

  const handleClaimDailyBonus = useCallback(() => {
    setGameState((prev) => {
      if (prev.hasClaimedDailyBonus) {
        setInternalThought("You've already claimed your daily bonus today!")
        return prev
      }

      const bonusExp = 50 + prev.level * 5
      const bonusCoins = 20 + prev.level * 2

      setInternalThought(`Daily bonus claimed! You received ${bonusExp} EXP and ${bonusCoins} SC.`)

      return {
        ...prev,
        exp: prev.exp + bonusExp,
        shopeeCoins: prev.shopeeCoins + bonusCoins,
        hasClaimedDailyBonus: true,
      }
    })
  }, [])

  const handleSendMessage = useCallback((message: string) => {
    setGameState((prev) => {
      const newMessage = {
        id: `user-msg-${Date.now()}`,
        sender: prev.playerName,
        content: message,
        timestamp: prev.gameTime,
      }
      const updatedMessages = [...prev.seaTalkMessages, newMessage]

      const updatedDailyQuests = prev.dailyQuests.map((quest) => {
        if (quest.type === QuestType.SeaTalk && !quest.isCompleted) {
          return { ...quest, currentProgress: (quest.currentProgress || 0) + 1 }
        }
        return quest
      })

      return { ...prev, seaTalkMessages: updatedMessages, dailyQuests: updatedDailyQuests }
    })
    setInternalThought("Message sent on SeaTalk!")
  }, [])

  const handleRandomEventChoice = useCallback(
    (choiceId: string) => {
      setGameState((prev) => {
        if (!currentRandomEvent) return prev

        const chosen = currentRandomEvent.choices.find((choice) => choice.id === choiceId)
        if (!chosen) return prev

        let updatedStats = { ...prev.stats }
        let updatedExp = prev.exp
        let updatedShopeeCoins = prev.shopeeCoins

        if (chosen.effect) {
          updatedExp = prev.exp + (chosen.effect.exp || 0)
          updatedShopeeCoins = prev.shopeeCoins + (chosen.effect.shopeeCoins || 0)
          updatedStats = {
            energy: Math.min(100, Math.max(0, updatedStats.energy + (chosen.effect.energy || 0))),
            productivity: Math.min(100, Math.max(0, updatedStats.productivity + (chosen.effect.productivity || 0))),
            burnout: Math.min(100, Math.max(0, updatedStats.burnout + (chosen.effect.burnout || 0))),
          }
        }

        setInternalThought(chosen.result)
        setShowRandomEvent(false)
        setCurrentRandomEvent(null)

        return {
          ...prev,
          exp: updatedExp,
          shopeeCoins: updatedShopeeCoins,
          stats: updatedStats,
        }
      })
    },
    [currentRandomEvent],
  )

  const handleOvertimeDecision = useCallback((decision: "work" | "sleep") => {
    setShowOvertimePrompt(false)

    if (decision === "work") {
      setInternalThought("You decided to work overtime. Hope it pays off!")
      setGameState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          productivity: Math.min(100, prev.stats.productivity + 10),
          burnout: Math.min(100, prev.stats.burnout + 15),
        },
      }))
    } else {
      setInternalThought("You decided to call it a day. Rest is important!")
      setShowSleepScreen(true)
    }
  }, [])

  const handleSleep = useCallback(() => {
    setShowSleepScreen(false)
    setGameState((prev) => ({
      ...prev,
      gameTime: getGameDay(prev.gameTime) * 24 * 60 + 9 * 60,
      stats: {
        energy: Math.min(100, prev.stats.energy + 30),
        burnout: Math.max(0, prev.stats.burnout - 20),
        productivity: Math.min(100, prev.stats.productivity + 5),
      },
    }))
    setInternalThought("You had a good night's sleep. Ready for a new day!")
  }, [])

  const handlePlayerNameChange = useCallback((newName: string) => {
    setGameState((prev) => ({ ...prev, playerName: newName }))
    setInternalThought(`Your name has been changed to ${newName}!`)
  }, [])

  const handleLocationAction = useCallback(
    (actionId: string, effect?: any) => {
      setGameState((prev) => {
        let updatedState = { ...prev }
        let thought: string | null = null

        switch (actionId) {
          case "do-business":
            updatedState = {
              ...updatedState,
              stats: {
                ...updatedState.stats,
                burnout: Math.max(0, updatedState.stats.burnout - 5),
                productivity: Math.max(0, updatedState.stats.productivity - 2),
              },
            }
            thought = "You feel a little lighter and more relaxed."
            break
          case "groom":
            updatedState = {
              ...updatedState,
              stats: {
                ...updatedState.stats,
                burnout: Math.max(0, updatedState.stats.burnout - 3),
                productivity: Math.max(0, updatedState.stats.productivity - 1),
              },
            }
            thought = "Looking sharp! A quick touch-up helps."
            break
          case "brush-teeth":
            updatedState = {
              ...updatedState,
              stats: {
                ...updatedState.stats,
                burnout: Math.max(0, updatedState.stats.burnout - 2),
                productivity: Math.max(0, updatedState.stats.productivity - 1),
              },
            }
            thought = "Fresh breath, fresh mind."
            break
          case "wash-hands":
            updatedState = {
              ...updatedState,
              stats: {
                ...updatedState.stats,
                burnout: Math.max(0, updatedState.stats.burnout - 1),
              },
            }
            thought = "Clean hands, clear conscience."
            break
          case "smoke-cigarettes":
            const { updatedState: smokedState, internalThought: smokeThought } = performSmokingAction(
              prev,
              "marlboro-cigarettes",
              gameData.shopItems,
            )
            updatedState = smokedState
            thought = smokeThought
            break
          default:
            break
        }
        setInternalThought(thought)
        return updatedState
      })
    },
    [gameData.shopItems],
  )

  const handleProgressComplete = useCallback((thought: string) => {
    setInternalThought(thought)
  }, [])

  const handleActionStart = useCallback(() => {
    // This function now primarily serves as a hook for other potential side effects
    // if needed in the future, but no longer pauses the game time.
  }, [])

  const handleSmokingCompleteRedirect = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentLocation: TabType.Office,
    }))
    setActiveTab(TabType.Navigate)
    setInternalThought("You are now back in the office, ready to navigate.")
  }, [])

  // NEW: Function to handle redirection after toilet action
  const handleToiletActionCompleteRedirect = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentLocation: TabType.Office, // Assuming "office" is a default location on Floor 1
    }))
    setActiveTab(TabType.Navigate)
    setInternalThought("You are now back in the office, ready to navigate.")
  }, [])

  useEffect(() => {
    setGameState((prev) => {
      const updatedQuests = prev.dailyQuests.map((quest) => {
        if (quest.isCompleted) return quest

        let isQuestCompleted = false
        switch (quest.type) {
          case QuestType.Task:
          case QuestType.Navigate:
          case QuestType.Lunch:
          case QuestType.Shop:
          case QuestType.SeaTalk:
            isQuestCompleted = (quest.currentProgress || 0) >= (quest.targetValue || 1)
            break
          case QuestType.Stat:
            if (quest.criteria?.statName) {
              const currentStatValue = prev.stats[quest.criteria.statName]
              if (quest.criteria.statName === "burnout") {
                isQuestCompleted = currentStatValue <= (quest.targetValue || 0)
              } else {
                isQuestCompleted = currentStatValue >= (quest.targetValue || 100)
              }
            }
            break
          case QuestType.Wardrobe:
            if (quest.criteria?.wardrobeItemId) {
              isQuestCompleted = prev.wardrobe.includes(quest.criteria.wardrobeItemId)
            }
            break
          default:
            break
        }

        return { ...quest, isCompleted: isQuestCompleted }
      })
      return { ...prev, dailyQuests: updatedQuests }
    })
  }, [gameState.stats, gameState.tasks, gameState.consumablesInventory, gameState.wardrobe, gameState.seaTalkMessages])

  const renderTabContent = useCallback(() => {
    const currentLocation = gameData.locations.find((loc) => loc.id === gameState.currentLocation)

    if (currentLocation?.id === "toilet") {
      return (
        <ToiletLocation
          gameState={gameState}
          onLocationAction={handleLocationAction}
          onProgressComplete={handleProgressComplete}
          onActionStart={handleActionStart}
          onToiletActionCompleteRedirect={handleToiletActionCompleteRedirect} // Pass the new prop
        />
      )
    }

    if (currentLocation?.id === "smoking-area") {
      return (
        <SmokingAreaLocation
          gameState={gameState}
          shopItems={gameData.shopItems}
          onLocationAction={handleLocationAction}
          onProgressComplete={handleProgressComplete}
          onActionStart={handleActionStart}
          onSmokingCompleteRedirect={handleSmokingCompleteRedirect}
        />
      )
    }

    switch (activeTab) {
      case TabType.Office:
        return (
          <OfficeTab
            gameState={gameState}
            onWork={handleWork}
            onClaimQuestReward={handleClaimDailyQuest}
            dailyQuests={gameState.dailyQuests}
            currentWeather={gameState.currentWeather}
            isWorking={isWorking}
            workingTaskId={workingTaskId}
            workProgress={workProgress}
            onUseConsumable={handleUseConsumable}
            setActiveTab={setActiveTab}
            onNavigateToLocation={handleNavigateToLocation}
          />
        )
      case TabType.Tasks:
        return (
          <TasksTab
            gameState={gameState}
            onWork={handleWork}
            onClaimQuestReward={handleClaimDailyQuest}
            isWorking={isWorking} // Pass isWorking
            workingTaskId={workingTaskId} // Pass workingTaskId
            workProgress={workProgress} // Pass workProgress
          />
        )
      case TabType.Lunch:
        return (
          <LunchTab
            gameState={gameState}
            onEatLunchStart={handleEatLunchStart}
            isEatingLunch={isEatingLunch}
            lunchProgress={lunchProgress}
            eatingLunchItemId={eatingLunchItemId}
          />
        )
      case TabType.Shop:
        return <ShopTab gameState={gameState} onBuyItem={handleBuyItem} />
      case TabType.Character:
        return (
          <CharacterTab
            gameState={gameState}
            onUpdatePlayerName={handlePlayerNameChange}
            playerRank={getLevelRank(gameState.level)}
            playerGrade={calculatePlayerGrade(gameState.stats.productivity, gameState.stats.burnout)}
          />
        )
      case TabType.SeaTalk:
        return (
          <SeaTalkTab
            gameState={gameState}
            onSendMessage={handleSendMessage}
            generateSeaTalkMessage={generateSeaTalkMessage}
            playerName={gameState.playerName}
          />
        )
      case TabType.Navigate:
        return <NavigateTab onNavigate={handleNavigate} locations={gameData.locations} gameState={gameState} />
      case TabType.Portal:
        return (
          <PortalTab gameState={gameState} setGameState={setGameState} onProgressComplete={handleProgressComplete} />
        )
      default:
        return (
          <OfficeTab
            gameState={gameState}
            onWork={handleWork}
            onClaimQuestReward={handleClaimDailyQuest}
            dailyQuests={gameState.dailyQuests}
            currentWeather={gameState.currentWeather}
            isWorking={isWorking}
            workingTaskId={workingTaskId}
            workProgress={workProgress}
            onUseConsumable={handleUseConsumable}
            setActiveTab={setActiveTab}
            onNavigateToLocation={handleNavigateToLocation}
          />
        )
    }
  }, [
    activeTab,
    gameState,
    handleWork,
    handleEatLunchStart,
    handleBuyItem,
    handleNavigate,
    handleClaimDailyQuest,
    handleSendMessage,
    handleRandomEventChoice,
    handlePlayerNameChange,
    handleLocationAction,
    handleProgressComplete,
    handleActionStart,
    handleSmokingCompleteRedirect,
    handleToiletActionCompleteRedirect,
    isWorking, // Dependency for TasksTab
    workingTaskId, // Dependency for TasksTab
    workProgress, // Dependency for TasksTab
    isEatingLunch,
    lunchProgress,
    eatingLunchItemId,
    setActiveTab,
    handleUseConsumable,
    handleNavigateToLocation,
  ])

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-gray-100 dark:bg-gray-900 font-sans">
      <GameHeader gameState={gameState} currentWeather={gameState.currentWeather} />

      <main className="flex-1 overflow-auto bg-white dark:bg-gray-800 shadow-inner relative pb-24">
        {renderTabContent()}
        {internalThought && (
          <InternalThoughtPopup message={internalThought} onDismiss={() => setInternalThought(null)} />
        )}
      </main>

      <BottomNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={gameData.bottomNavigationTabs}
        gameState={gameState}
      />

      {showLunchReminder && (
        <LunchReminderModal
          onClose={() => {
            setShowLunchReminder(false)
          }}
          onNavigateToLunch={() => {
            setActiveTab(TabType.Lunch)
            setShowLunchReminder(false)
          }}
        />
      )}

      {showOvertimePrompt && <OvertimePromptModal onDecide={handleOvertimeDecision} />}

      {showSleepScreen && <SleepScreen onSleep={handleSleep} />}

      {showRandomEvent && currentRandomEvent && (
        <RandomEventModal event={currentRandomEvent} onChoice={handleRandomEventChoice} />
      )}
    </div>
  )
}
