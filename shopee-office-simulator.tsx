"use client"

import { useState, useEffect, lazy, Suspense, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type {
  GameState,
  ChatMessage,
  GameTime,
  SelectedCharacterParts,
  ShopProduct,
  LunchOption,
  Task,
  RandomEvent,
  InternalThought,
  SavedGameState,
} from "./types/game"
import {
  roles,
  tasks,
  shopProducts,
  characterCustomizationOptions,
  randomEvents,
  internalThoughts,
} from "./data/gameData"
import { GameHeader } from "./components/GameHeader"
import { BottomNavigation } from "./components/BottomNavigation"
import { OfficeTab } from "./components/tabs/OfficeTab"
import { ShopTab } from "./components/tabs/ShopTab"
import { NavigationOverlay } from "./components/NavigationOverlay" // Import new component

// Lazy load other tabs for better performance
const TasksTab = lazy(() => import("./components/tabs/TasksTab"))
const SeaTalkTab = lazy(() => import("./components/tabs/SeaTalkTab"))
const NavigateTab = lazy(() => import("./components/tabs/NavigateTab"))
const LunchTab = lazy(() => import("./components/tabs/LunchTab"))
const CharacterTab = lazy(() => import("./components/tabs/CharacterTab"))

// Debounce utility function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), delay)
  }
}

export default function ShopeeOfficeSimulator() {
  const [gameState, setGameState] = useState<GameState>({
    energy: 100,
    productivity: 0,
    burnout: 0,
    experience: 0,
    level: 0,
    money: 100, // Start with 100 ShopeeCoins
    day: 1,
    hour: 9,
  })

  const [inventory, setInventory] = useState<ShopProduct[]>([])
  const [activeShopCategory, setActiveShopCategory] = useState("productivity")
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  const [isWorking, setIsWorking] = useState(false)
  const [currentTask, setCurrentTask] = useState<string | null>(null)
  const [taskProgress, setTaskProgress] = useState(0)
  const [queuedTasks, setQueuedTasks] = useState<Task[]>([]) // New state for queued tasks
  const taskProgressRef = useRef<HTMLDivElement>(null) // Ref for scrolling

  const [activeTab, setActiveTab] = useState("office")
  const [currentLocation, setCurrentLocation] = useState("office") // Default to "office" for navigation grid
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "HR Manager",
      message: "Welcome to Shopee! Don't forget to complete your onboarding tasks.",
      time: "2 minutes ago",
      avatar: "HR",
      department: "Human Resources",
      reactions: ["👍", "🎉"],
    },
    {
      id: 2,
      sender: "Team Lead",
      message: "Great work on the presentation! Keep it up!",
      time: "5 minutes ago",
      avatar: "TL",
      department: "Engineering",
      reactions: ["👏", "🔥"],
    },
    {
      id: 3,
      sender: "IT Support",
      message: "System maintenance scheduled for tonight. Please save your work!",
      time: "1 hour ago",
      avatar: "IT",
      department: "Information Technology",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [gameTime, setGameTime] = useState<GameTime>({ hour: 9, minute: 30 })
  const [isWorkingHours, setIsWorkingHours] = useState(true)
  const [dayTransition, setDayTransition] = useState(false)
  const [selectedCharacterParts, setSelectedCharacterParts] = useState<SelectedCharacterParts>({
    gender: "neutral",
    skinColor: "light",
    hairStyle: "short-dark",
    makeup: "none",
    top: "business-shirt",
    bottom: "formal-pants",
    shoes: "dress-shoes",
    accessory: "none",
  })
  const [lastAutoMessageTime, setLastAutoMessageTime] = useState(0)

  const [isLunchInProgress, setIsLunchInProgress] = useState(false) // New state for lunch progress
  const [lunchProgress, setLunchProgress] = useState(0) // New state for lunch progress
  const [selectedLunchEmoji, setSelectedLunchEmoji] = useState<string | null>(null) // New state for lunch emoji

  const [currentRandomEvent, setCurrentRandomEvent] = useState<RandomEvent | null>(null)
  const [showRandomEventModal, setShowRandomEventModal] = useState(false)
  const [lastRandomEventHour, setLastRandomEventHour] = useState(9) // Track last hour an event was triggered

  const [currentThought, setCurrentThought] = useState<InternalThought | null>(null)
  const [showThoughtPopup, setShowThoughtPopup] = useState(false)
  const thoughtTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [isNavigatingLocation, setIsNavigatingLocation] = useState(false) // New state for navigation
  const [navigationProgress, setNavigationProgress] = useState(0) // New state for navigation progress
  const [targetLocationName, setTargetLocationName] = useState("") // New state for navigation overlay

  const [showLunchReminderModal, setShowLunchReminderModal] = useState(false) // New state for lunch reminder
  const [hasShownLunchReminderToday, setHasShownLunchReminderToday] = useState(false) // Track if reminder shown

  const [dailyWeather, setDailyWeather] = useState<{ emoji: string; description: string } | null>(null) // New state for daily weather

  const currentRole = roles[Math.min(gameState.level, roles.length - 1)]
  const nextRole = roles[Math.min(gameState.level + 1, roles.length - 1)]
  const canLevelUp = gameState.experience >= nextRole.experienceRequired && gameState.level < roles.length - 1

  // --- Auto-Save / Load Game Progress ---
  const saveGame = useCallback(
    debounce(() => {
      const savedData: SavedGameState = {
        gameState,
        inventory,
        selectedCharacterParts,
        chatMessages,
        gameTime,
        currentLocation,
        queuedTasks,
      }
      localStorage.setItem("shopeeOfficeSimulatorSave", JSON.stringify(savedData))
      console.log("Game saved!")
    }, 2000), // Save every 2 seconds after state changes
    [gameState, inventory, selectedCharacterParts, chatMessages, gameTime, currentLocation, queuedTasks],
  )

  useEffect(() => {
    // Load game on initial mount
    const savedData = localStorage.getItem("shopeeOfficeSimulatorSave")
    if (savedData) {
      try {
        const parsedData: SavedGameState = JSON.parse(savedData)
        setGameState(parsedData.gameState)
        setInventory(parsedData.inventory)
        setSelectedCharacterParts(parsedData.selectedCharacterParts)
        setChatMessages(parsedData.chatMessages)
        setGameTime(parsedData.gameTime)
        setCurrentLocation(parsedData.currentLocation)
        setQueuedTasks(parsedData.queuedTasks || []) // Ensure queuedTasks is initialized
        console.log("Game loaded!")
      } catch (error) {
        console.error("Failed to parse saved game data:", error)
        // Fallback to initial state if parsing fails
      }
    }

    // Set initial daily weather
    const weatherOptions = [
      { emoji: "☀️", description: "Sunny" },
      { emoji: "☁️", description: "Cloudy" },
      { emoji: "🌧️", description: "Rainy" },
      { emoji: "🌬️", description: "Windy" },
      { emoji: "⛈️", description: "Thunderstorm" },
    ]
    setDailyWeather(weatherOptions[Math.floor(Math.random() * weatherOptions.length)])
  }, [])

  // Effect to trigger save whenever relevant state changes
  useEffect(() => {
    saveGame()
  }, [saveGame])

  // --- Game Logic (existing) ---

  // Auto-generate chat messages
  const generateAutoMessage = () => {
    if (!isWorkingHours || dayTransition) return

    const currentTime = Date.now()
    const timeSinceLastMessage = currentTime - lastAutoMessageTime

    // Send auto message every 2-4 minutes (120-240 seconds)
    const minInterval = 120000 // 2 minutes
    const maxInterval = 240000 // 4 minutes
    const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval

    if (timeSinceLastMessage >= randomInterval) {
      const autoMessages = [
        // Time-based messages
        ...(gameTime.hour === 9
          ? [
              {
                sender: "Manager",
                message: "Good morning team! Let's make today productive!",
                avatar: "MG",
                department: "Management",
              },
              {
                sender: "Colleague",
                message: "Morning everyone! Ready for another great day!",
                avatar: "CL",
                department: "Sales",
              },
            ]
          : []),

        ...(gameTime.hour === 12
          ? [
              {
                sender: "HR Manager",
                message: "Lunch time! Don't forget to take a proper break",
                avatar: "HR",
                department: "Human Resources",
              },
              {
                sender: "Colleague",
                message: "Anyone wants to grab lunch together?",
                avatar: "CL",
                department: "Marketing",
              },
            ]
          : []),

        ...(gameTime.hour === 17
          ? [
              {
                sender: "Team Lead",
                message: "Great work today everyone! Time to wrap up",
                avatar: "TL",
                department: "Engineering",
              },
              {
                sender: "Manager",
                message: "Don't forget to update your daily reports before leaving!",
                avatar: "MG",
                department: "Management",
              },
            ]
          : []),

        // Productivity-based messages
        ...(gameState.productivity > 70
          ? [
              {
                sender: "Team Lead",
                message: "Wow, productivity is through the roof today!",
                avatar: "TL",
                department: "Engineering",
              },
              {
                sender: "Manager",
                message: "Excellent work everyone! Keep this momentum going!",
                avatar: "MG",
                department: "Management",
              },
            ]
          : []),

        // Burnout-based messages
        ...(gameState.burnout > 60
          ? [
              {
                sender: "HR Manager",
                message: "Remember to take breaks when needed. Your wellbeing matters!",
                avatar: "HR",
                department: "Human Resources",
              },
              {
                sender: "Wellness Coach",
                message: "High stress levels detected. Consider some meditation?",
                avatar: "WC",
                department: "Wellness",
              },
            ]
          : []),

        // Level-based messages
        ...(gameState.level >= 3
          ? [
              {
                sender: "CEO",
                message: "Impressive progress! Leadership material right here",
                avatar: "CEO",
                department: "Executive",
              },
              {
                sender: "Director",
                message: "Your strategic thinking is really showing!",
                avatar: "DR",
                department: "Strategy",
              },
            ]
          : []),

        // General office chatter - more diverse tones
        {
          sender: "IT Support",
          message: "New software update rolling out this afternoon. Don't blame me if your PC turns into a toaster.",
          avatar: "IT",
          department: "Information Technology",
        },
        {
          sender: "Finance",
          message: "Q3 budget reports are due next week! Please don't make me chase you.",
          avatar: "FN",
          department: "Finance",
        },
        {
          sender: "Marketing",
          message: "New campaign launch is going great! My cat could do better, but still great!",
          avatar: "MK",
          department: "Marketing",
        },
        {
          sender: "Project Manager",
          message: "Sprint planning meeting at 3 PM today. Bring snacks, I'm starving.",
          avatar: "PM",
          department: "Project Management",
        },
        {
          sender: "Colleague",
          message: "Coffee machine is fixed! Praise the caffeine gods!",
          avatar: "CL",
          department: "General",
        },
        {
          sender: "Security",
          message: "Please remember to badge out when leaving. Or don't, I'm not your mom.",
          avatar: "SC",
          department: "Security",
        },
        {
          sender: "Facilities",
          message: "Office plants looking great today! Unlike my will to live.",
          avatar: "FC",
          department: "Facilities",
        },
        {
          sender: "Intern",
          message: "Learning so much here! Thanks for all the help. I'm still confused though.",
          avatar: "IN",
          department: "Internship",
        },
        {
          sender: "Sales",
          message: "Just closed a big deal! Team celebration later? My treat, if I don't get audited.",
          avatar: "SL",
          department: "Sales",
        },
        {
          sender: "Customer Support",
          message: "Customer satisfaction scores are up this month! I'm so tired.",
          avatar: "CS",
          department: "Customer Support",
        },
        {
          sender: "Colleague",
          message: "Is it just me, or is the office perpetually 5 degrees too cold?",
          avatar: "CL",
          department: "General",
        },
        {
          sender: "Colleague",
          message: "My cat walked across my keyboard during a video call. Mortifying.",
          avatar: "CL",
          department: "General",
        },
        {
          sender: "Colleague",
          message: "Just saw someone eating cereal with a fork. My day is complete.",
          avatar: "CL",
          department: "General",
        },
        {
          sender: "Colleague",
          message: "I think I'm allergic to Mondays. Send help and chocolate.",
          avatar: "CL",
          department: "General",
        },
        {
          sender: "Colleague",
          message: "Anyone else feel like they're living in a simulation?",
          avatar: "CL",
          department: "General",
        },
        {
          sender: "Colleague",
          message: "My brain cells are currently on strike. Negotiations are ongoing.",
          avatar: "CL",
          department: "General",
        },
        {
          sender: "Colleague",
          message: "Just got a new plant for my desk. I hope I don't kill this one too.",
          avatar: "CL",
          department: "General",
        },
        {
          sender: "Colleague",
          message: "I'm 99% sure my keyboard is judging my typing speed.",
          avatar: "CL",
          department: "General",
        },
        {
          sender: "Colleague",
          message: "If you need me, I'll be in the pantry, emotionally eating biscuits.",
          avatar: "CL",
          department: "General",
        },
        {
          sender: "Colleague",
          message: "My therapist told me to embrace my flaws. So I'm embracing this messy desk.",
          avatar: "CL",
          department: "General",
        },
      ]

      // Filter messages based on current context
      const contextualMessages = autoMessages.filter((msg) => {
        // Don't repeat recent messages
        const recentMessages = chatMessages.slice(-5)
        return !recentMessages.some((recent) => recent.message === msg.message)
      })

      if (contextualMessages.length > 0) {
        const randomMessage = contextualMessages[Math.floor(Math.random() * contextualMessages.length)]
        const newAutoMessage: ChatMessage = {
          id: Date.now(),
          sender: randomMessage.sender,
          message: randomMessage.message,
          time: "now",
          avatar: randomMessage.avatar,
          department: randomMessage.department,
        }

        setChatMessages((prev) => [...prev, newAutoMessage])
        setLastAutoMessageTime(currentTime)
      }
    }
  }

  // Auto-message effect
  useEffect(() => {
    const autoMessageInterval = setInterval(generateAutoMessage, 30000) // Check every 30 seconds
    return () => clearInterval(autoMessageInterval)
  }, [gameTime, gameState, isWorkingHours, dayTransition, isWorking, currentTask, chatMessages, lastAutoMessageTime])

  const startTask = useCallback(
    (task: Task) => {
      setIsWorking(true)
      setCurrentTask(task.id)
      setTaskProgress(0)

      // Scroll to the task progress bar
      if (taskProgressRef.current) {
        taskProgressRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }

      const totalTime = task.duration * 1000 // 1 game minute = 1 real second
      const updateInterval = 200 // Update every 200ms for smooth progress

      const interval = setInterval(() => {
        setTaskProgress((prev) => {
          const increment = (updateInterval / totalTime) * 100
          const newProgress = prev + increment

          if (newProgress >= 100) {
            clearInterval(interval)

            setGameState((prev) => {
              const newEnergy = Math.max(0, Math.min(100, prev.energy - task.energyCost))
              const newProductivity = Math.max(0, Math.min(100, prev.productivity + task.productivityGain))
              const newBurnout = Math.max(0, Math.min(100, prev.burnout + task.burnoutGain))
              const newExperience = prev.experience + task.experienceGain
              const newMoney = Math.max(0, prev.money + task.moneyGain)
              const newHour = prev.hour + task.duration

              return {
                ...prev,
                energy: newEnergy,
                productivity: newProductivity,
                burnout: newBurnout,
                experience: newExperience,
                money: newMoney,
                hour: newHour > 18 ? 9 : newHour,
                day: newHour > 18 ? prev.day + 1 : prev.day,
              }
            })

            setIsWorking(false)
            setCurrentTask(null)
            setTaskProgress(0) // Reset progress for next task
            return 0
          }
          return newProgress
        })
      }, updateInterval)
    },
    [taskProgressRef],
  )

  const executeTask = useCallback(
    (task: Task) => {
      if (isWorking) {
        setQueuedTasks((prev) => [...prev, task])
      } else {
        startTask(task)
      }
    },
    [isWorking, startTask],
  )

  // Effect to process queued tasks
  useEffect(() => {
    if (!isWorking && queuedTasks.length > 0) {
      const nextTask = queuedTasks[0]
      setQueuedTasks((prev) => prev.slice(1)) // Remove from queue
      startTask(nextTask) // Start the next task
    }
  }, [isWorking, queuedTasks, startTask])

  const levelUp = () => {
    if (canLevelUp) {
      setGameState((prev) => ({
        ...prev,
        level: prev.level + 1,
        money: prev.money + nextRole.salary,
      }))

      // Add congratulatory message
      const congratsMessage: ChatMessage = {
        id: Date.now(),
        sender: "HR Manager",
        message: `Congratulations on your promotion to ${nextRole.title}! Well deserved!`,
        time: "now",
        avatar: "HR",
        department: "Human Resources",
        reactions: ["🎉", "👏", "🎊"],
      }
      setChatMessages((prev) => [...prev, congratsMessage])
    }
  }

  const purchaseProduct = (product: ShopProduct) => {
    if (gameState.money >= product.price) {
      setGameState((prev) => ({
        ...prev,
        money: prev.money - product.price,
        productivity: Math.min(100, prev.productivity + (product.effects.productivity || 0)),
        energy: Math.min(100, prev.energy + (product.effects.energy || 0)),
        burnout: Math.max(
          0,
          prev.burnout -
            (product.effects.burnout && product.effects.burnout < 0 ? Math.abs(product.effects.burnout) : 0),
        ),
        experience: prev.experience + (product.effects.experience || 0),
      }))

      setInventory((prev) => [...prev, { ...product, purchaseDate: gameTime }])

      const category = Object.keys(shopProducts).find((cat) => shopProducts[cat].some((p) => p.id === product.id))

      if (category) {
        shopProducts[category] = shopProducts[category].map((p) => (p.id === product.id ? { ...p, owned: true } : p))
      }

      setPurchaseSuccess(true)
      setTimeout(() => setPurchaseSuccess(false), 3000)
    }
  }

  const selectProduct = (product: ShopProduct) => {
    setSelectedProduct(product)
    setShowPurchaseModal(true)
  }

  const getEnergyColor = (energy: number) => {
    if (energy > 60) return "bg-green-500"
    if (energy > 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getProductivityColor = (productivity: number) => {
    if (productivity > 70) return "bg-blue-500"
    if (productivity > 40) return "bg-cyan-500"
    return "bg-gray-500"
  }

  const getBurnoutColor = (burnout: number) => {
    if (burnout > 70) return "bg-red-500"
    if (burnout > 40) return "bg-orange-500"
    return "bg-green-500"
  }

  // Auto-recovery during rest
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isWorking && gameState.hour >= 18) {
        setGameState((prev) => ({
          ...prev,
          energy: Math.min(100, prev.energy + 2),
          burnout: Math.max(0, prev.burnout - 1),
        }))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isWorking, gameState.hour])

  // Game Clock - 60x faster than real time
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setGameTime((prev) => {
        let newHour = prev.hour
        let newMinute = prev.minute + 1

        if (newMinute >= 60) {
          newMinute = 0
          newHour += 1
        }

        if (newHour >= 24) {
          newHour = 0
          setGameState((prevState) => ({ ...prevState, day: prevState.day + 1 }))
          setHasShownLunchReminderToday(false) // Reset lunch reminder for new day
          // Generate new daily weather
          const weatherOptions = [
            { emoji: "☀️", description: "Sunny" },
            { emoji: "☁️", description: "Cloudy" },
            { emoji: "🌧️", description: "Rainy" },
            { emoji: "🌬️", description: "Windy" },
            { emoji: "⛈️", description: "Thunderstorm" },
          ]
          setDailyWeather(weatherOptions[Math.floor(Math.random() * weatherOptions.length)])
        }

        // Check for day end at 6:30 PM
        if (newHour === 18 && newMinute === 30 && !dayTransition) {
          setDayTransition(true)
          setIsWorkingHours(false)

          // 15 second pause
          setTimeout(() => {
            setDayTransition(false)
          }, 15000)
        }

        // Check for day start at 9:30 AM
        if (newHour === 9 && newMinute === 30) {
          setIsWorkingHours(true)
        }

        // Lunch reminder at 12:00 PM
        if (newHour === 12 && newMinute === 0 && !hasShownLunchReminderToday && isWorkingHours && !dayTransition) {
          setShowLunchReminderModal(true)
          setHasShownLunchReminderToday(true)
        }

        return { hour: newHour, minute: newMinute }
      })
    }, 1000) // 1 second = 1 minute in game

    return () => clearInterval(clockInterval)
  }, [dayTransition, hasShownLunchReminderToday])

  const sendMessage = () => {
    if (newMessage.trim() && isWorkingHours && !dayTransition) {
      const userMessage = {
        id: Date.now(),
        sender: "You",
        message: newMessage,
        time: "now",
        avatar: "👤", // User's avatar
      }

      setChatMessages((prev) => [...prev, userMessage])
      setNewMessage("")

      // NPC Response after delay
      setTimeout(
        () => {
          const responses = [
            { sender: "Team Lead", message: "Thanks for the update! 👍", avatar: "TL", department: "Engineering" },
            {
              sender: "HR Manager",
              message: "Noted! Let me know if you need anything.",
              avatar: "HR",
              department: "Human Resources",
            },
            { sender: "Colleague", message: "Sounds good! See you later.", avatar: "CL", department: "General" },
            { sender: "Manager", message: "Great work! Keep it up.", avatar: "MG", department: "Management" },
            {
              sender: "Project Manager",
              message: "Perfect timing! Thanks for letting us know.",
              avatar: "PM",
              department: "Project Management",
            },
          ]

          const randomResponse = responses[Math.floor(Math.random() * responses.length)]
          const npcMessage = {
            id: Date.now() + 1,
            sender: randomResponse.sender,
            message: randomResponse.message,
            time: "now",
            avatar: randomResponse.avatar,
            department: randomResponse.department,
          }

          setChatMessages((prev) => [...prev, npcMessage])
        },
        2000 + Math.random() * 3000,
      ) // 2-5 second delay
    }
  }

  // --- New Navigation Logic ---
  const visitLocation = useCallback(
    (locationId: string) => {
      if (isWorkingHours && !dayTransition && !isNavigatingLocation) {
        setIsNavigatingLocation(true)
        setNavigationProgress(0)

        const locationNames = {
          desk: "My Desk",
          meeting: "Meeting Room",
          pantry: "Pantry",
          gameroom: "Game Room",
          phonebooth: "Phone Booth",
          itroom: "IT Room",
          office: "Office", // Add office to location names
        }
        setTargetLocationName(locationNames[locationId] || locationId)

        const navigationDuration = 10 * 1000 // 10 seconds forced navigation
        const updateInterval = 100 // Update every 100ms for smooth progress

        const interval = setInterval(() => {
          setNavigationProgress((prev) => {
            const increment = (updateInterval / navigationDuration) * 100
            const newProgress = prev + increment

            if (newProgress >= 100) {
              clearInterval(interval)
              setCurrentLocation(locationId) // Finally update location
              setIsNavigatingLocation(false)
              setNavigationProgress(0)

              // Apply location-specific effects after arrival
              const locationEffects = {
                pantry: { energy: 10, burnout: -5 },
                gameroom: { energy: 15, burnout: -10, productivity: -5 },
                phonebooth: { productivity: 5 },
                meeting: { productivity: 10, burnout: 5 },
                itroom: { productivity: 8 },
              }

              if (locationEffects[locationId]) {
                setGameState((prev) => ({
                  ...prev,
                  energy: Math.min(100, Math.max(0, prev.energy + (locationEffects[locationId].energy || 0))),
                  burnout: Math.min(100, Math.max(0, prev.burnout + (locationEffects[locationId].burnout || 0))),
                  productivity: Math.min(
                    100,
                    Math.max(0, prev.productivity + (locationEffects[locationId].productivity || 0)),
                  ),
                }))
              }
              return 100 // Ensure it reaches 100%
            }
            return newProgress
          })
        }, updateInterval)
      }
    },
    [isWorkingHours, dayTransition, isNavigatingLocation],
  )

  const handleBackToNavigationGrid = useCallback(() => {
    setCurrentLocation("office") // Set current location back to the default grid state
  }, [])

  const orderLunch = useCallback(
    (lunch: LunchOption) => {
      if (gameTime.hour >= 12 && gameTime.hour <= 14 && gameState.money >= lunch.price && !isLunchInProgress) {
        setIsLunchInProgress(true)
        setLunchProgress(0)
        setSelectedLunchEmoji(lunch.emoji) // Set the emoji for display

        const lunchDuration = 10 * 1000 // 10 seconds for lunch
        const updateInterval = 200

        const interval = setInterval(() => {
          setLunchProgress((prev) => {
            const increment = (updateInterval / lunchDuration) * 100
            const newProgress = prev + increment

            if (newProgress >= 100) {
              clearInterval(interval)
              setGameState((prev) => ({
                ...prev,
                money: prev.money - lunch.price,
                energy: Math.min(100, prev.energy + lunch.energy),
                productivity: Math.min(100, prev.productivity + lunch.energy / 2), // Productivity gain from energy
              }))
              setIsLunchInProgress(false)
              setLunchProgress(0)
              setSelectedLunchEmoji(null) // Clear emoji after lunch
              return 0
            }
            return newProgress
          })
        }, updateInterval)
      }
    },
    [gameTime, gameState.money, isLunchInProgress],
  )

  const formatGameTime = (time) => {
    const hour12 = time.hour === 0 ? 12 : time.hour > 12 ? time.hour - 12 : time.hour
    const ampm = time.hour >= 12 ? "PM" : "AM"
    return `${hour12}:${time.minute.toString().padStart(2, "0")} ${ampm}`
  }

  // Add this new function to handle stat updates
  const updateGameStats = useCallback((stats: Partial<GameState>) => {
    setGameState((prev) => ({
      ...prev,
      ...stats,
    }))
  }, [])

  const handleCharacterPartChange = useCallback((category: keyof SelectedCharacterParts, itemId: string) => {
    const item = characterCustomizationOptions[category].find((i) => i.id === itemId)
    if (item && item.unlocked) {
      setSelectedCharacterParts((prev) => ({
        ...prev,
        [category]: itemId,
      }))
    }
  }, [])

  // Random Event Logic
  useEffect(() => {
    const eventCheckInterval = setInterval(() => {
      // Check if a new game hour has started and an event hasn't been triggered for this hour
      if (gameTime.hour !== lastRandomEventHour && gameTime.minute === 0) {
        // Only trigger if no other blocking UI is active
        if (
          isWorkingHours &&
          !dayTransition &&
          !showRandomEventModal &&
          !isWorking &&
          !isLunchInProgress &&
          !isNavigatingLocation &&
          !showLunchReminderModal // Also block if lunch reminder is active
        ) {
          const availableEvents = randomEvents.filter((event) => true) // Add any conditions for events here

          if (availableEvents.length > 0) {
            const event = availableEvents[Math.floor(Math.random() * availableEvents.length)]
            setCurrentRandomEvent(event)
            setShowRandomEventModal(true)
          }
        }
        setLastRandomEventHour(gameTime.hour) // Always update last event hour to prevent re-triggering for this hour
      }
    }, 1000) // Check every real second (every game minute)

    return () => clearInterval(eventCheckInterval)
  }, [
    gameTime.hour,
    gameTime.minute,
    lastRandomEventHour,
    isWorkingHours,
    dayTransition,
    showRandomEventModal,
    isWorking,
    isLunchInProgress,
    isNavigatingLocation,
    showLunchReminderModal,
  ])

  const handleRandomEventChoice = useCallback(
    (optionIndex: 0 | 1) => {
      if (!currentRandomEvent) return

      const chosenOption = currentRandomEvent.options[optionIndex]
      setGameState((prev) => ({
        ...prev,
        energy: Math.max(0, Math.min(100, prev.energy + (chosenOption.effects.energy || 0))),
        productivity: Math.max(0, Math.min(100, prev.productivity + (chosenOption.effects.productivity || 0))),
        burnout: Math.max(0, Math.min(100, prev.burnout + (chosenOption.effects.burnout || 0))),
        experience: prev.experience + (chosenOption.effects.experience || 0),
        money: Math.max(0, prev.money + (chosenOption.effects.money || 0)),
      }))

      // Add a chat message about the event outcome
      const outcomeMessage: ChatMessage = {
        id: Date.now(),
        sender: "Game Event",
        message: `You chose: "${chosenOption.text}". Your stats were affected!`,
        time: "now",
        avatar: "GM", // Game Master
        department: "System",
      }
      setChatMessages((prev) => [...prev, outcomeMessage])

      setShowRandomEventModal(false)
      setCurrentRandomEvent(null)
    },
    [currentRandomEvent],
  )

  // Internal Thoughts Logic
  useEffect(() => {
    const thoughtCheckInterval = setInterval(() => {
      // Only trigger a new thought if no other blocking UI is active
      if (
        isWorkingHours &&
        !dayTransition &&
        !showRandomEventModal &&
        !isNavigatingLocation &&
        !isWorking &&
        !isLunchInProgress &&
        !showLunchReminderModal // Also block if lunch reminder is active
      ) {
        const randomChance = Math.random()
        const triggerProbability = 0.2 // 20% chance every check

        if (randomChance < triggerProbability) {
          const thought = internalThoughts[Math.floor(Math.random() * internalThoughts.length)]
          setCurrentThought(thought)
          setShowThoughtPopup(true)

          // Clear any existing timeout for a thought before setting a new one
          if (thoughtTimeoutRef.current) {
            clearTimeout(thoughtTimeoutRef.current)
          }
          thoughtTimeoutRef.current = setTimeout(() => {
            setShowThoughtPopup(false)
            setCurrentThought(null)
          }, 3000) // Thought disappears after 3 seconds
        }
      } else {
        // If a blocking UI is active, ensure the thought popup is hidden
        if (showThoughtPopup) {
          setShowThoughtPopup(false)
          setCurrentThought(null)
          if (thoughtTimeoutRef.current) {
            clearTimeout(thoughtTimeoutRef.current)
          }
        }
      }
    }, 5 * 1000) // Check every 5 real seconds (5 game minutes)

    return () => {
      clearInterval(thoughtCheckInterval)
      if (thoughtTimeoutRef.current) {
        clearTimeout(thoughtTimeoutRef.current)
      }
    }
  }, [
    isWorkingHours,
    dayTransition,
    showRandomEventModal,
    isNavigatingLocation,
    isWorking,
    isLunchInProgress,
    showThoughtPopup,
    showLunchReminderModal,
  ])

  const renderTabContent = () => {
    switch (activeTab) {
      case "office":
        return (
          <OfficeTab
            gameState={gameState}
            currentRole={currentRole}
            nextRole={nextRole}
            canLevelUp={canLevelUp}
            isWorking={isWorking}
            currentTask={currentTask}
            taskProgress={taskProgress}
            tasks={tasks}
            queuedTasks={queuedTasks}
            onLevelUp={levelUp}
            onExecuteTask={executeTask}
            taskProgressRef={taskProgressRef}
            gameTime={gameTime} // Pass gameTime for weather
            dailyWeather={dailyWeather} // Pass daily weather
          />
        )
      case "tasks":
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
            <TasksTab
              gameState={gameState}
              isWorking={isWorking}
              currentTask={currentTask}
              taskProgress={taskProgress}
              tasks={tasks}
              queuedTasks={queuedTasks}
              onExecuteTask={executeTask}
              taskProgressRef={taskProgressRef}
            />
          </Suspense>
        )
      case "seatalk":
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
            <SeaTalkTab
              chatMessages={chatMessages}
              newMessage={newMessage}
              isWorkingHours={isWorkingHours}
              dayTransition={dayTransition}
              onMessageChange={setNewMessage}
              onSendMessage={sendMessage}
            />
          </Suspense>
        )
      case "navigate":
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
            <NavigateTab
              gameState={gameState}
              currentLocation={currentLocation}
              isWorkingHours={isWorkingHours}
              dayTransition={dayTransition}
              isNavigatingLocation={isNavigatingLocation} // Pass new prop
              onVisitLocation={visitLocation}
              onUpdateStats={updateGameStats}
              onBackToNavigationGrid={handleBackToNavigationGrid} // Pass new prop
            />
          </Suspense>
        )
      case "lunch":
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
            <LunchTab
              gameState={gameState}
              gameTime={gameTime}
              onOrderLunch={orderLunch}
              isLunchInProgress={isLunchInProgress}
              lunchProgress={lunchProgress}
              selectedLunchEmoji={selectedLunchEmoji} // Pass selected emoji
            />
          </Suspense>
        )
      case "character":
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
            <CharacterTab
              gameState={gameState}
              currentRole={currentRole}
              selectedCharacterParts={selectedCharacterParts}
              onCharacterPartChange={handleCharacterPartChange}
            />
          </Suspense>
        )
      case "shop":
        return (
          <ShopTab
            gameState={gameState}
            activeShopCategory={activeShopCategory}
            inventory={inventory}
            shopProducts={shopProducts}
            onCategoryChange={setActiveShopCategory}
            onSelectProduct={selectProduct}
          />
        )
      default:
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
            <div className="max-w-4xl mx-auto p-4">
              <Card>
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
                  <p className="text-gray-600">⚙️ This feature is under development.</p>
                </CardContent>
              </Card>
            </div>
          </Suspense>
        )
    }
  }

  // Determine if any blocking modal/action is active
  const isBlockingAction =
    showRandomEventModal ||
    isNavigatingLocation ||
    isWorking ||
    isLunchInProgress ||
    dayTransition ||
    showLunchReminderModal

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex flex-col">
      <GameHeader
        gameState={gameState}
        currentRole={currentRole}
        nextRole={nextRole}
        canLevelUp={canLevelUp}
        gameTime={gameTime}
        isWorkingHours={isWorkingHours}
        dayTransition={dayTransition}
        onLevelUp={levelUp}
      />

      <div className="flex-1 overflow-auto pb-20">{renderTabContent()}</div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} disabled={isBlockingAction} />

      {/* Purchase Success Message */}
      {purchaseSuccess && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
            Purchase successful! Item added to your inventory.
          </div>
        </div>
      )}

      {/* Purchase Confirmation Modal */}
      {showPurchaseModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">🛒 Confirm Purchase</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">{selectedProduct.name}</span>
                  <Badge variant="outline">{selectedProduct.price} SC</Badge>
                </div>
                <p className="text-sm">{selectedProduct.description}</p>
                <div className="flex justify-between items-center">
                  <span>Your balance:</span>
                  <span className="font-medium">{gameState.money.toLocaleString()} SC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>After purchase:</span>
                  <span className="font-medium">{(gameState.money - selectedProduct.price).toLocaleString()} SC</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowPurchaseModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    purchaseProduct(selectedProduct)
                    setShowPurchaseModal(false)
                  }}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Confirm Purchase
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Random Event Modal */}
      {showRandomEventModal && currentRandomEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-4">{currentRandomEvent.emoji}</div>
              <h3 className="text-xl font-bold mb-3">{currentRandomEvent.title}</h3>
              <p className="text-gray-700 mb-6">{currentRandomEvent.description}</p>
              <div className="flex flex-col gap-3">
                {currentRandomEvent.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleRandomEventChoice(index as 0 | 1)}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    {option.emoji} {option.text}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Internal Thought Pop-up */}
      {showThoughtPopup && currentThought && (
        <div className="fixed bottom-20 right-4 z-40 animate-fade-in-up">
          <Card className="w-64 p-3 shadow-lg border border-gray-200 bg-white">
            <CardContent className="p-0 flex items-center gap-2">
              <span className="text-xl">{currentThought.emoji}</span>
              <p className="text-sm text-gray-700">{currentThought.text}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lunch Reminder Modal */}
      {showLunchReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold mb-3">It's Lunch Time!</h3>
              <p className="text-gray-700 mb-6">Time to grab a bite and recharge your energy.</p>
              <Button
                onClick={() => {
                  setActiveTab("lunch")
                  setShowLunchReminderModal(false)
                }}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Go to Lunch!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Overlay */}
      {isNavigatingLocation && (
        <NavigationOverlay targetLocationName={targetLocationName} progress={navigationProgress} />
      )}

      {/* Day Transition Overlay */}
      {dayTransition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 text-center">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">Day {gameState.day} Complete!</h2>
              <p className="text-gray-600 mb-4">Time to rest and recharge for tomorrow</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">New day starting soon...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
