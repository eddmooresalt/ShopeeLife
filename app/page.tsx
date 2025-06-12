"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { type GameState, TabType, type LocationType, QuestType, type SeaTalkMessage } from "@/types/game"
import { initialGameState, gameData as staticGameData } from "@/data/gameData"
import {
  saveGame,
  loadGame,
  calculateLunchProgress,
  generateDailyQuests,
  getWeather,
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
import { LocationDetail } from "@/components/LocationDetail"
import { NavigationOverlay } from "@/components/NavigationOverlay"
import { RandomEventModal } from "@/components/RandomEventModal"
import { InternalThoughtPopup } from "@/components/InternalThoughtPopup"
import { LunchReminderModal } from "@/components/LunchReminderModal"
import { useToast } from "@/hooks/use-toast"
import { PortalTab } from "@/components/tabs/PortalTab"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const TabContent: Record<TabType, React.ComponentType<any>> = {
  [TabType.Office]: OfficeTab,
  [TabType.Tasks]: TasksTab,
  [TabType.Lunch]: LunchTab,
  [TabType.Shop]: ShopTab,
  [TabType.Character]: CharacterTab,
  [TabType.SeaTalk]: SeaTalkTab,
  [TabType.Navigate]: NavigateTab,
  [TabType.Portal]: PortalTab,
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Office)
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigationProgress, setNavigationProgress] = useState(0)
  const [isBlockingUI, setIsBlockingUI] = useState(false) // For modals, navigation, etc.
  const [showRandomEvent, setShowRandomEvent] = useState(false)
  const [randomEvent, setRandomEvent] = useState<any>(null) // Type this properly later
  const [internalThought, setInternalThought] = useState<string | null>(null)
  const internalThoughtTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showLunchReminder, setShowLunchReminder] = useState(false)
  const [currentWeather, setCurrentWeather] = useState(getWeather(initialGameState.gameTime))

  // New state for time-based tasks
  const [isWorking, setIsWorking] = useState(false)
  const [workingTaskId, setWorkingTaskId] = useState<string | null>(null)
  const [workProgress, setWorkProgress] = useState(0) // 0-100%
  const workTimerRef = useRef<NodeJS.Timeout | null>(null)
  const workStartTimeRef = useRef<number>(0)
  const workDurationSeconds = 10 // Target 10 seconds for task completion

  // Add these new state variables after the existing state declarations
  const [isEatingLunch, setIsEatingLunch] = useState(false)
  const [lunchProgress, setLunchProgress] = useState(0)

  const { toast } = useToast()

  // Load game on mount
  useEffect(() => {
    try {
      const savedState = loadGame()
      if (savedState) {
        setGameState(savedState)
        setCurrentWeather(getWeather(savedState.gameTime))

        // Ensure daily quests are generated if missing
        if (savedState && savedState.dailyQuests.length === 0) {
          const currentDay = Math.floor(savedState.gameTime / (60 * 24))
          savedState.dailyQuests = generateDailyQuests(currentDay, staticGameData)
          savedState.lastQuestResetDay = currentDay
          setGameState(savedState)
        }
      } else {
        // For new games, ensure quests are generated
        const newGameState = { ...initialGameState }
        const currentDay = Math.floor(newGameState.gameTime / (60 * 24))
        newGameState.dailyQuests = generateDailyQuests(currentDay, staticGameData)
        newGameState.lastQuestResetDay = currentDay
        setGameState(newGameState)
        setCurrentWeather(getWeather(newGameState.gameTime))
      }
    } catch (error) {
      console.error("Error loading game:", error)
      // Fallback to initial state if loading fails
      setGameState(initialGameState)
      setCurrentWeather(getWeather(initialGameState.gameTime))
    }
  }, [])

  // Save game whenever gameState changes
  useEffect(() => {
    try {
      saveGame(gameState)
    } catch (error) {
      console.error("Error saving game:", error)
    }
  }, [gameState])

  // Update weather when game time changes
  useEffect(() => {
    setCurrentWeather(getWeather(gameState.gameTime))
  }, [gameState.gameTime])

  // Game loop (time progression and task progression)
  useEffect(() => {
    const gameInterval = setInterval(() => {
      setGameState((prev) => {
        const newTime = prev.gameTime + 1 // Increment by 1 minute
        const newHour = Math.floor(newTime / 60) % 24
        const newDay = Math.floor(newTime / (60 * 24))

        const updatedState = { ...prev, gameTime: newTime }

        // Daily Quest Reset
        if (newDay > prev.lastQuestResetDay) {
          updatedState.dailyQuests = generateDailyQuests(newDay, staticGameData)
          updatedState.lastQuestResetDay = newDay
          updatedState.hasClaimedDailyBonus = false // Reset bonus claim
          updatedState.hasShownLunchReminder = false // Reset lunch reminder

          // Schedule toast for next tick to avoid setState during render
          setTimeout(() => {
            toast({
              title: "New Day!",
              description: "Your daily quests have refreshed. Good luck!",
            })
          }, 0)
        }

        // Ensure daily quests are always available
        if (updatedState.dailyQuests.length === 0) {
          updatedState.dailyQuests = generateDailyQuests(newDay, staticGameData)
          updatedState.lastQuestResetDay = newDay
        }

        // Daily Quest Bonus Check (6:30 PM)
        if (newHour === 18 && newTime % 60 === 30 && !prev.hasClaimedDailyBonus) {
          const allQuestsCompletedAndClaimed = updatedState.dailyQuests.every((q) => q.isCompleted && q.isClaimed)
          if (allQuestsCompletedAndClaimed) {
            const bonusExp = 50
            const bonusCoins = 100
            updatedState.exp += bonusExp
            updatedState.shopeeCoins += bonusCoins
            updatedState.hasClaimedDailyBonus = true

            // Schedule toast for next tick
            setTimeout(() => {
              toast({
                title: "Daily Quest Bonus!",
                description: `You completed all daily quests by 6:30 PM! +${bonusExp} EXP, +${bonusCoins} SC!`,
              })
            }, 0)
          }
        }

        // Auto-populate SeaTalk messages
        // Only generate if not blocking UI and not currently working on a task
        if (Math.random() < 0.1 && !isBlockingUI && !isWorking) {
          // 10% chance every minute
          const newMessage = generateSeaTalkMessage(staticGameData.seaTalkMessages)
          if (newMessage) {
            // Correct timestamp for auto-generated messages
            newMessage.timestamp = newTime
            updatedState.seaTalkMessages = [...updatedState.seaTalkMessages, newMessage]
          }
        }

        return updatedState
      })
    }, 1000) // Update every second (simulating 1 game minute)

    return () => clearInterval(gameInterval)
  }, [isBlockingUI, isWorking, toast])

  // Handle lunch reminder and random events separately
  useEffect(() => {
    const currentHour = Math.floor(gameState.gameTime / 60) % 24

    // Lunch Reminder (12:00 PM)
    if (currentHour === 12 && !gameState.hasShownLunchReminder && !isBlockingUI && !showLunchReminder) {
      setShowLunchReminder(true)
      setIsBlockingUI(true)
      setGameState((prev) => ({ ...prev, hasShownLunchReminder: true }))
    }
  }, [gameState.gameTime, gameState.hasShownLunchReminder, isBlockingUI, showLunchReminder])

  // Handle random events
  useEffect(() => {
    const currentTwoHourBlock = Math.floor(gameState.gameTime / 120) // 120 minutes = 2 hours
    const prevTwoHourBlock = Math.floor((gameState.gameTime - 1) / 120)

    if (currentTwoHourBlock > prevTwoHourBlock && !isBlockingUI && !showRandomEvent) {
      const randomEvents = staticGameData.randomEvents
      if (randomEvents.length > 0) {
        const randomIndex = Math.floor(Math.random() * randomEvents.length)
        const event = randomEvents[randomIndex]
        setRandomEvent(event)
        setShowRandomEvent(true)
        setIsBlockingUI(true)
      }
    }
  }, [gameState.gameTime, isBlockingUI, showRandomEvent])

  // Effect to manage internal thought popup visibility
  useEffect(() => {
    if (internalThought) {
      if (internalThoughtTimeoutRef.current) {
        clearTimeout(internalThoughtTimeoutRef.current)
      }
      internalThoughtTimeoutRef.current = setTimeout(() => {
        setInternalThought(null)
      }, 3000) // Disappear after 3 seconds
    }
    // Clear timeout if another blocking UI appears
    if (isBlockingUI && internalThoughtTimeoutRef.current) {
      clearTimeout(internalThoughtTimeoutRef.current)
      setInternalThought(null)
    }
    return () => {
      if (internalThoughtTimeoutRef.current) {
        clearTimeout(internalThoughtTimeoutRef.current)
      }
    }
  }, [internalThought, isBlockingUI])

  // Effect for time-based task progression
  useEffect(() => {
    if (isWorking && workingTaskId) {
      workStartTimeRef.current = Date.now()
      workTimerRef.current = setInterval(() => {
        const elapsedTime = (Date.now() - workStartTimeRef.current) / 1000 // in seconds
        const progress = Math.min(100, (elapsedTime / workDurationSeconds) * 100)
        setWorkProgress(progress)

        if (progress >= 100) {
          if (workTimerRef.current) {
            clearInterval(workTimerRef.current)
          }
          setIsWorking(false)
          setWorkingTaskId(null)
          setWorkProgress(0)

          // Apply task completion effects
          setGameState((prev) => {
            const taskIndex = prev.tasks.findIndex((t) => t.id === workingTaskId)
            if (taskIndex === -1) return prev

            const task = { ...prev.tasks[taskIndex] }
            let expGained = 0
            let shopeeCoinsGained = 0

            if (!task.isCompleted) {
              task.isCompleted = true
              expGained = task.rewardExp
              shopeeCoinsGained = task.rewardCoins

              // Schedule side effects for next tick
              setTimeout(() => {
                setInternalThought(
                  `Task "${task.name}" completed! You earned ${expGained} EXP and ${shopeeCoinsGained} SC.`,
                )
                toast({
                  title: "Task Completed!",
                  description: `You finished "${task.name}"!`,
                })
              }, 0)
            }

            const updatedTasks = [...prev.tasks]
            updatedTasks[taskIndex] = task

            return {
              ...prev,
              tasks: updatedTasks,
              exp: prev.exp + expGained,
              shopeeCoins: prev.shopeeCoins + shopeeCoinsGained,
            }
          })
        }
      }, 100) // Update work progress every 100ms
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
  }, [isWorking, workingTaskId, toast])

  const updateGame = useCallback(
    (updater: (prevState: GameState) => GameState) => {
      setGameState((prev) => {
        const newState = updater(prev)

        // Check and update daily quest progress after any state change
        newState.dailyQuests = newState.dailyQuests.map((quest) => {
          if (quest.isCompleted) return quest // Already completed

          let newProgress = quest.currentProgress
          let completed = false

          switch (quest.type) {
            case QuestType.Task:
              // Check if a task completion matches this quest
              const completedTask = prev.tasks.find(
                (t) =>
                  t.id === quest.criteria?.taskId &&
                  t.isCompleted === false &&
                  newState.tasks.find((nt) => nt.id === t.id)?.isCompleted === true,
              )
              if (completedTask) {
                newProgress = quest.targetValue // Assuming 1 task completion for now
                completed = true
              }
              break
            case QuestType.Navigate:
              // Check if current location matches quest target
              if (currentLocation?.id === quest.criteria?.locationId) {
                newProgress = quest.targetValue
                completed = true
              }
              break
            case QuestType.Lunch:
              // Check if a specific lunch item was eaten
              if (newState.hasEatenLunch && newState.lunchItemEatenId === quest.criteria?.lunchItemId) {
                newProgress = quest.targetValue
                completed = true
              }
              break
            case QuestType.Shop:
              // Check if a specific shop item was bought
              const boughtItem = prev.shopItems.find(
                (item) =>
                  item.id === quest.criteria?.shopItemId &&
                  item.isBought === false &&
                  newState.shopItems.find((ni) => ni.id === item.id)?.isBought === true,
              )
              if (boughtItem) {
                newProgress = quest.targetValue
                completed = true
              }
              break
            case QuestType.Stat:
              // Check if a stat reached a certain level
              const statName = quest.criteria?.statName as keyof GameState["stats"]
              if (statName && newState.stats[statName] >= (quest.targetValue || 0)) {
                newProgress = newState.stats[statName]
                completed = newProgress >= (quest.targetValue || 0)
              }
              break
            case QuestType.SeaTalk:
              // Check if X messages sent
              const prevUserMessages = prev.seaTalkMessages.filter((m) => m.sender === "user").length
              const newUserMessages = newState.seaTalkMessages.filter((m) => m.sender === "user").length
              if (newUserMessages > prevUserMessages) {
                newProgress = newUserMessages
                completed = newProgress >= (quest.targetValue || 0)
              }
              break
            case QuestType.Wardrobe:
              // Check if a specific wardrobe item was acquired (bought from shop)
              const acquiredWardrobeItem = prev.shopItems.find(
                (item) =>
                  item.id === quest.criteria?.wardrobeItemId &&
                  item.isBought === false &&
                  newState.shopItems.find((ni) => ni.id === item.id)?.isBought === true,
              )
              if (acquiredWardrobeItem) {
                newProgress = quest.targetValue
                completed = true
              }
              break
          }

          return {
            ...quest,
            currentProgress: newProgress,
            isCompleted: completed,
          }
        })

        return newState
      })
    },
    [currentLocation],
  ) // Depend on currentLocation to check navigate quests

  const handleWork = useCallback(
    (taskId: string) => {
      if (isBlockingUI || isWorking) return // Prevent starting work if UI is blocked or already working

      const task = gameState.tasks.find((t) => t.id === taskId)
      if (!task || task.isCompleted || gameState.stats.energy < task.energyCost) {
        setInternalThought("Cannot start task: already completed, not enough energy, or already working.")
        return
      }

      // Deduct energy immediately
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
    [gameState, isBlockingUI, isWorking],
  )

  // Update the handleLunch function to show progress
  const handleLunch = useCallback(
    (locationId: string, itemId: string) => {
      if (isBlockingUI) return
      setIsBlockingUI(true) // Block UI during lunch
      setIsEatingLunch(true)
      setLunchProgress(0)

      updateGame((prev) => {
        const { updatedState, internalThought: lunchThought } = calculateLunchProgress(
          prev,
          locationId,
          itemId,
          staticGameData.lunchLocations,
          staticGameData.lunchItems,
        )
        setInternalThought(lunchThought)
        return updatedState
      })

      // Progress animation
      const startTime = Date.now()
      const duration = 30000 // 30 seconds

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(100, (elapsed / duration) * 100)
        setLunchProgress(progress)

        if (progress >= 100) {
          clearInterval(progressInterval)
          setIsEatingLunch(false)
          setLunchProgress(0)
          setIsBlockingUI(false)
          setActiveTab(TabType.Office)
          toast({
            title: "Lunch Finished!",
            description: "You're refueled and ready to get back to work.",
          })
        }
      }, 100)
    },
    [updateGame, isBlockingUI, toast],
  )

  const handleBuyItem = useCallback(
    (itemId: string) => {
      if (isBlockingUI) return
      updateGame((prev) => {
        const item = prev.shopItems.find((i) => i.id === itemId)
        if (item && !item.isBought && prev.shopeeCoins >= item.price) {
          toast({
            title: "Purchase Successful!",
            description: `You bought ${item.name} for ${item.price} SC.`,
          })
          return {
            ...prev,
            shopeeCoins: prev.shopeeCoins - item.price,
            shopItems: prev.shopItems.map((i) => (i.id === itemId ? { ...i, isBought: true } : i)),
            wardrobe: item.type === "wardrobe" ? [...prev.wardrobe, item.id] : prev.wardrobe,
          }
        } else if (item && item.isBought) {
          toast({
            title: "Already Owned",
            description: `${item.name} is already in your inventory.`,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Not Enough ShopeeCoins",
            description: `You need ${item?.price || 0} SC to buy ${item?.name || "this item"}.`,
            variant: "destructive",
          })
        }
        return prev
      })
    },
    [updateGame, isBlockingUI, toast],
  )

  const handleSendMessage = useCallback(
    (message: string) => {
      if (isBlockingUI) return
      updateGame((prev) => {
        const newMessage: SeaTalkMessage = {
          id: `msg-${Date.now()}`,
          sender: "user",
          content: message,
          timestamp: prev.gameTime,
        }
        return {
          ...prev,
          seaTalkMessages: [...prev.seaTalkMessages, newMessage],
        }
      })
    },
    [updateGame, isBlockingUI],
  )

  const handlePortalAction = useCallback(
    (portalId: string, actionType: string) => {
      // Define portal actions and their effects
      const portalActions: Record<string, Record<string, any>> = {
        "hr-portal": {
          "submit-leave": { burnout: -10, exp: 5, message: "Leave request submitted! You feel more relaxed." },
          "check-benefits": {
            exp: 10,
            shopeeCoins: 20,
            message: "You reviewed your benefits and found some bonus coins!",
          },
          "performance-review": {
            exp: 25,
            productivity: 5,
            message: "Performance review scheduled! You feel motivated.",
          },
        },
        "it-helpdesk": {
          "software-update": {
            productivity: 15,
            exp: 10,
            message: "Software updated! Your productivity has improved.",
          },
          "hardware-repair": {
            productivity: 10,
            burnout: -5,
            message: "Hardware fixed! You can work more efficiently now.",
          },
          "security-training": {
            exp: 30,
            shopeeCoins: 25,
            message: "Security training completed! You earned a bonus.",
          },
        },
        "company-news": {
          "read-newsletter": { exp: 15, social: 5, message: "You're now up to date with company news!" },
          "quarterly-results": {
            exp: 20,
            shopeeCoins: 15,
            message: "Great quarterly results! Here's a performance bonus.",
          },
          "upcoming-events": { social: 10, exp: 10, message: "Exciting events coming up! You feel more connected." },
        },
        "learning-hub": {
          "technical-course": {
            exp: 50,
            productivity: 20,
            cost: 30,
            message: "Technical skills improved significantly!",
          },
          "leadership-workshop": {
            exp: 40,
            social: 15,
            productivity: 10,
            cost: 25,
            message: "Leadership skills enhanced!",
          },
          "certification-exam": {
            exp: 100,
            shopeeCoins: 50,
            productivity: 25,
            cost: 50,
            message: "Certification earned! Major career boost!",
          },
        },
        "feedback-form": {
          "submit-feedback": { exp: 20, social: 10, message: "Feedback submitted! Your voice matters." },
          "suggestion-box": { exp: 35, shopeeCoins: 30, social: 15, message: "Great suggestion! You earned a reward." },
          "anonymous-survey": { exp: 15, shopeeCoins: 10, message: "Survey completed! Thank you for your input." },
        },
        "wellness-corner": {
          "meditation-session": {
            burnout: -15,
            energy: 10,
            message: "Meditation complete! You feel refreshed and centered.",
          },
          "fitness-challenge": {
            energy: 20,
            burnout: -10,
            exp: 15,
            message: "Fitness challenge completed! You feel energized.",
          },
          "wellness-workshop": {
            burnout: -20,
            productivity: 10,
            exp: 25,
            cost: 15,
            message: "Wellness workshop completed! You learned valuable stress management techniques.",
          },
        },
      }

      const action = portalActions[portalId]?.[actionType]
      if (!action) return

      updateGame((prev) => {
        // Check if user has enough coins for paid actions
        if (action.cost && prev.shopeeCoins < action.cost) {
          toast({
            title: "Insufficient Funds",
            description: `You need ${action.cost} SC to use this service.`,
            variant: "destructive",
          })
          return prev
        }

        const newState = { ...prev }

        // Apply costs
        if (action.cost) {
          newState.shopeeCoins -= action.cost
        }

        // Apply effects
        if (action.exp) newState.exp += action.exp
        if (action.shopeeCoins) newState.shopeeCoins += action.shopeeCoins
        if (action.energy) newState.stats.energy = Math.max(0, Math.min(100, newState.stats.energy + action.energy))
        if (action.productivity)
          newState.stats.productivity = Math.max(0, Math.min(100, newState.stats.productivity + action.productivity))
        if (action.burnout) newState.stats.burnout = Math.max(0, Math.min(100, newState.stats.burnout + action.burnout))
        if (action.social) newState.stats.social = Math.max(0, Math.min(100, newState.stats.social + action.social))

        toast({
          title: "Portal Service Used",
          description: action.message,
        })

        setInternalThought(action.message)
        return newState
      })
    },
    [updateGame, toast],
  )

  const handleLocationAction = useCallback(
    (locationId: string, actionId: string) => {
      // Define location-specific actions and their effects
      const locationActions: Record<string, Record<string, any>> = {
        office: {
          "organize-desk": {
            productivity: 10,
            burnout: -5,
            message: "Your desk is now organized! You feel more productive.",
          },
          "review-emails": {
            productivity: 5,
            exp: 10,
            message: "Emails reviewed! You're caught up on communications.",
          },
          "coffee-break": {
            energy: 15,
            burnout: -10,
            message: "That break was refreshing! You feel recharged.",
          },
          "deep-focus": {
            productivity: 20,
            exp: 25,
            burnout: 5,
            message: "Deep focus session complete! You accomplished so much.",
          },
        },
        pantry: {
          "coffee-chat": {
            energy: 10,
            social: 15,
            exp: 5,
            message: "Great conversation! You learned some interesting office gossip.",
          },
          "microwave-mastery": {
            energy: 20,
            productivity: 5,
            social: 5,
            message: "Culinary masterpiece achieved! Your leftovers never tasted so good.",
          },
          "team-bonding": {
            social: 25,
            productivity: 10,
            exp: 15,
            message: "Amazing team discussion! You solved half the world's problems over coffee.",
          },
          "snack-hunt": {
            energy: 15,
            burnout: -8,
            message: "Snack mission successful! You found the good stuff hidden in the back.",
          },
        },
        "rooftop-garden": {
          meditation: {
            burnout: -20,
            energy: 10,
            message: "Peaceful meditation complete! Your mind feels clear and calm.",
          },
          "garden-walk": {
            energy: 15,
            burnout: -10,
            message: "A lovely stroll through the garden! Nature is so refreshing.",
          },
          "fresh-air": {
            energy: 20,
            productivity: 5,
            message: "Deep breaths of fresh air! You feel revitalized.",
          },
          "photo-session": {
            exp: 25,
            social: 10,
            message: "Beautiful photos captured! You can't wait to share them.",
          },
          sunbathe: {
            energy: 25,
            burnout: -15,
            message: "Vitamin D absorbed! You feel warm and energized.",
          },
        },
        gym: {
          "light-cardio": {
            energy: 20,
            burnout: -15,
            exp: 10,
            message: "Light cardio complete! Your blood is flowing and you feel great.",
          },
          "strength-training": {
            energy: 15,
            productivity: 20,
            burnout: -10,
            exp: 20,
            message: "Strength training done! You feel stronger both physically and mentally.",
          },
          "hiit-workout": {
            energy: 30,
            productivity: 25,
            burnout: -20,
            exp: 30,
            message: "HIIT workout crushed! You're feeling incredibly energized.",
          },
          "yoga-session": {
            energy: 25,
            burnout: -25,
            productivity: 10,
            exp: 15,
            message: "Yoga session complete! Your body and mind feel balanced.",
          },
          "quick-stretch": {
            energy: 10,
            burnout: -8,
            productivity: 5,
            message: "Quick stretch done! Your muscles feel loose and ready.",
          },
        },
      }

      const action = locationActions[locationId]?.[actionId]
      if (!action) return

      updateGame((prev) => {
        const newState = { ...prev }

        // Apply effects
        if (action.exp) newState.exp += action.exp
        if (action.shopeeCoins) newState.shopeeCoins += action.shopeeCoins
        if (action.energy) newState.stats.energy = Math.max(0, Math.min(100, newState.stats.energy + action.energy))
        if (action.productivity)
          newState.stats.productivity = Math.max(0, Math.min(100, newState.stats.productivity + action.productivity))
        if (action.burnout) newState.stats.burnout = Math.max(0, Math.min(100, newState.stats.burnout + action.burnout))
        if (action.social) newState.stats.social = Math.max(0, Math.min(100, newState.stats.social + action.social))

        toast({
          title: "Activity Complete",
          description: action.message,
        })

        setInternalThought(action.message)
        return newState
      })
    },
    [updateGame, toast],
  )

  const handleNavigate = useCallback(
    (location: LocationType) => {
      if (isBlockingUI) return
      setIsNavigating(true)
      setIsBlockingUI(true)
      setCurrentLocation(location)
      setNavigationProgress(0)

      const interval = setInterval(() => {
        setNavigationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsNavigating(false)
            setIsBlockingUI(false)
            toast({
              title: "Navigation Complete!",
              description: `You have arrived at ${location.name}.`,
            })
            return 100
          }
          return prev + 10 // Increment progress
        })
      }, 100) // Update every 100ms for 10 seconds total
    },
    [isBlockingUI, toast],
  )

  const handleBackToNavigationGrid = useCallback(() => {
    setCurrentLocation(null)
    setActiveTab(TabType.Navigate)
  }, [])

  const handleRandomEventChoice = useCallback(
    (choiceId: string) => {
      if (!randomEvent) return
      const choice = randomEvent.choices.find((c: any) => c.id === choiceId)
      if (choice) {
        updateGame((prev) => {
          const newState = { ...prev }
          if (choice.effect) {
            if (choice.effect.exp) newState.exp += choice.effect.exp
            if (choice.effect.shopeeCoins) newState.shopeeCoins += choice.effect.shopeeCoins
            if (choice.effect.energy)
              newState.stats.energy = Math.max(0, Math.min(100, newState.stats.energy + choice.effect.energy))
            if (choice.effect.productivity)
              newState.stats.productivity = Math.max(
                0,
                Math.min(100, newState.stats.productivity + choice.effect.productivity),
              )
            if (choice.effect.burnout)
              newState.stats.burnout = Math.max(0, Math.min(100, newState.stats.burnout + choice.effect.burnout))
          }
          toast({
            title: "Event Concluded",
            description: choice.result,
          })
          return newState
        })
      }
      setShowRandomEvent(false)
      setIsBlockingUI(false)
    },
    [randomEvent, updateGame, toast],
  )

  const handleGoToLunch = useCallback(() => {
    setShowLunchReminder(false)
    setIsBlockingUI(false)
    setActiveTab(TabType.Lunch)
  }, [])

  const claimQuestReward = useCallback(
    (questId: string) => {
      updateGame((prev) => {
        const questIndex = prev.dailyQuests.findIndex((q) => q.id === questId)
        if (questIndex > -1 && prev.dailyQuests[questIndex].isCompleted && !prev.dailyQuests[questIndex].isClaimed) {
          const quest = prev.dailyQuests[questIndex]
          const updatedQuests = [...prev.dailyQuests]
          updatedQuests[questIndex] = { ...quest, isClaimed: true }

          toast({
            title: "Quest Completed!",
            description: `You claimed "${quest.description}"! +${quest.rewardExp} EXP, +${quest.rewardCoins} SC!`,
          })

          return {
            ...prev,
            exp: prev.exp + quest.rewardExp,
            shopeeCoins: prev.shopeeCoins + quest.rewardCoins,
            dailyQuests: updatedQuests,
          }
        }
        return prev
      })
    },
    [updateGame, toast],
  )

  // Enhanced tab switching function that handles location navigation
  const handleSetActiveTab = useCallback(
    (tab: TabType) => {
      // If we're currently in a location, exit the location first
      if (currentLocation) {
        setCurrentLocation(null)
      }
      // Then set the active tab
      setActiveTab(tab)
    },
    [currentLocation],
  )

  const CurrentTabComponent = TabContent[activeTab]

  return (
    <div className="relative flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <GameHeader gameState={gameState} currentWeather={currentWeather} />

      <main className="flex-1 overflow-hidden p-2">
        {" "}
        {/* Added pb-16 for bottom nav */}
        {isNavigating ? (
          <NavigationOverlay progress={navigationProgress} locationName={currentLocation?.name || ""} />
        ) : currentLocation ? (
          <LocationDetail
            location={currentLocation}
            onBack={handleBackToNavigationGrid}
            gameState={gameState}
            onWork={handleWork}
            onLunch={handleLunch}
            onBuyItem={handleBuyItem}
            onSendMessage={handleSendMessage}
            onClaimQuestReward={claimQuestReward}
            onPortalAction={handlePortalAction}
            onLocationAction={handleLocationAction}
          />
        ) : (
          <CurrentTabComponent
            gameState={gameState}
            onWork={handleWork}
            onLunch={handleLunch}
            onBuyItem={handleBuyItem}
            onSendMessage={handleSendMessage}
            onNavigate={handleNavigate}
            onClaimQuestReward={claimQuestReward}
            onPortalAction={handlePortalAction}
            onLocationAction={handleLocationAction}
            dailyQuests={gameState.dailyQuests}
            currentWeather={currentWeather}
            locations={staticGameData.locations}
            isWorking={isWorking}
            workingTaskId={workingTaskId}
            workProgress={workProgress}
          />
        )}
      </main>

      <BottomNavigation
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        tabs={staticGameData.bottomNavigationTabs}
        disabled={isNavigating || isWorking || showRandomEvent || showLunchReminder}
      />

      {showRandomEvent && randomEvent && <RandomEventModal event={randomEvent} onChoice={handleRandomEventChoice} />}

      {internalThought && <InternalThoughtPopup message={internalThought} />}

      {showLunchReminder && (
        <LunchReminderModal
          onGoToLunch={handleGoToLunch}
          onClose={() => {
            setShowLunchReminder(false)
            setIsBlockingUI(false)
          }}
        />
      )}

      {isEatingLunch && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-3xl text-gray-900">Enjoying Lunch... 🍽️</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-800 text-lg">Taking a well-deserved break</p>
              <Progress value={lunchProgress} className="w-full h-4 bg-gray-600 [&>*]:bg-orange-500" />
              <p className="text-gray-700 text-sm">{Math.round(lunchProgress)}% complete</p>
              <p className="text-gray-300 text-xs">Please wait while you enjoy your meal...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
