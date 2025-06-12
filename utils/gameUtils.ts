import {
  type GameState,
  type Task,
  type LunchLocation,
  type LunchItem,
  type DailyQuest,
  QuestType,
  type WeatherCondition,
  type SeaTalkMessageTemplate,
  type SeaTalkMessage,
} from "@/types/game"
import { initialGameState } from "@/data/gameData"

// Utility to save game state to localStorage
export const saveGame = (gameState: GameState) => {
  try {
    const serializedState = JSON.stringify(gameState)
    localStorage.setItem("shopeeOfficeSimulator", serializedState)
  } catch (error) {
    console.error("Error saving game state:", error)
  }
}

// Utility to load game state from localStorage
export const loadGame = (): GameState | undefined => {
  try {
    const serializedState = localStorage.getItem("shopeeOfficeSimulator")
    if (serializedState === null) {
      return undefined // No saved state
    }

    const loadedState: GameState = JSON.parse(serializedState)

    // Validate that loadedState is a valid object
    if (!loadedState || typeof loadedState !== "object") {
      console.warn("Invalid saved state, using initial state")
      return undefined
    }

    // Ensure all new fields are initialized if loading an older save
    const mergedState: GameState = {
      ...initialGameState, // Use initial state as a base for new fields
      ...loadedState,
      stats: {
        ...initialGameState.stats,
        ...(loadedState.stats || {}),
      },
      // Ensure dailyQuests is an array, even if empty from old save
      dailyQuests: Array.isArray(loadedState.dailyQuests) ? loadedState.dailyQuests : [],
      // Ensure hasClaimedDailyBonus is initialized
      hasClaimedDailyBonus: loadedState.hasClaimedDailyBonus ?? false,
      hasShownLunchReminder: loadedState.hasShownLunchReminder ?? false,
      currentWeather: loadedState.currentWeather || getWeather(loadedState.gameTime || initialGameState.gameTime),
      seaTalkMessages: Array.isArray(loadedState.seaTalkMessages)
        ? loadedState.seaTalkMessages
        : initialGameState.seaTalkMessages,
      tasks: Array.isArray(loadedState.tasks) ? loadedState.tasks : initialGameState.tasks,
      lunchLocations: Array.isArray(loadedState.lunchLocations)
        ? loadedState.lunchLocations
        : initialGameState.lunchLocations,
      lunchItems: Array.isArray(loadedState.lunchItems) ? loadedState.lunchItems : initialGameState.lunchItems,
      shopItems: Array.isArray(loadedState.shopItems) ? loadedState.shopItems : initialGameState.shopItems,
      wardrobe: Array.isArray(loadedState.wardrobe) ? loadedState.wardrobe : [],
    }

    return mergedState
  } catch (error) {
    console.error("Error loading game state:", error)
    return undefined
  }
}

// Calculate work progress for a task
export const calculateWorkProgress = (gameState: GameState, taskId: string, allTasks: Task[]) => {
  const taskIndex = gameState.tasks.findIndex((t) => t.id === taskId)
  if (taskIndex === -1) {
    return { updatedTasks: gameState.tasks, expGained: 0, shopeeCoinsGained: 0, internalThought: null }
  }

  const task = { ...gameState.tasks[taskIndex] }
  let internalThought: string | null = null

  if (task.isCompleted) {
    internalThought = "This task is already done. Time to find new challenges!"
    return { updatedTasks: gameState.tasks, expGained: 0, shopeeCoinsGained: 0, internalThought }
  }

  const workEfficiency =
    1 + (gameState.shopItems.find((item) => item.id === "new-keyboard" && item.isBought)?.effect?.workEfficiency || 0)
  const progressIncrease = 10 * workEfficiency // Base progress increase

  task.progress = Math.min(task.targetProgress, task.progress + progressIncrease)

  let expGained = 0
  let shopeeCoinsGained = 0

  if (task.progress >= task.targetProgress) {
    task.isCompleted = true
    expGained = task.rewardExp
    shopeeCoinsGained = task.rewardCoins
    internalThought = `Task "${task.name}" completed! You earned ${expGained} EXP and ${shopeeCoinsGained} SC.`
  } else {
    internalThought = `Making progress on "${task.name}". Keep it up!`
  }

  const updatedTasks = [...gameState.tasks]
  updatedTasks[taskIndex] = task

  return { updatedTasks, expGained, shopeeCoinsGained, internalThought }
}

// Calculate lunch progress and effects
export const calculateLunchProgress = (
  gameState: GameState,
  locationId: string,
  itemId: string,
  lunchLocations: LunchLocation[],
  lunchItems: LunchItem[],
) => {
  const location = lunchLocations.find((loc) => loc.id === locationId)
  const item = lunchItems.find((i) => i.id === itemId)

  let internalThought: string | null = null

  if (!location || !item) {
    internalThought = "Hmm, that lunch choice doesn't seem right."
    return { updatedState: gameState, internalThought }
  }

  // Check if it's lunch time (12:00 PM - 2:00 PM)
  const currentHour = Math.floor(gameState.gameTime / 60) % 24
  const isLunchTime = currentHour >= 12 && currentHour < 14

  if (!isLunchTime) {
    internalThought = "It's not lunch time yet! Come back between 12:00 PM - 2:00 PM."
    return { updatedState: gameState, internalThought }
  }

  if (gameState.hasEatenLunch) {
    internalThought = "You've already had lunch today. No more food for you!"
    return { updatedState: gameState, internalThought }
  }

  if (gameState.shopeeCoins < item.price) {
    internalThought = `Not enough ShopeeCoins for ${item.name}. You need ${item.price} SC.`
    return { updatedState: gameState, internalThought }
  }

  const updatedState = {
    ...gameState,
    shopeeCoins: gameState.shopeeCoins - item.price,
    stats: {
      ...gameState.stats,
      energy: Math.min(100, gameState.stats.energy + item.energyGain),
    },
    hasEatenLunch: true,
    lunchItemEatenId: item.id,
  }

  internalThought = `Enjoying ${item.name} at the ${location.name}. Feeling refreshed and energized!`

  return { updatedState, internalThought }
}

// Format game time (e.g., 540 minutes -> 09:00 AM)
export const formatGameTime = (totalMinutes: number, includeSeconds = false): string => {
  const minutesInDay = 24 * 60
  const currentDayMinutes = totalMinutes % minutesInDay

  const hours = Math.floor(currentDayMinutes / 60)
  const minutes = Math.floor(currentDayMinutes % 60)
  const seconds = Math.floor((totalMinutes * 1000) % 60) // Assuming 1 game minute = 1 real second

  const ampm = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 === 0 ? 12 : hours % 12
  const displayMinutes = minutes.toString().padStart(2, "0")
  const displaySeconds = seconds.toString().padStart(2, "0")

  if (includeSeconds) {
    return `${displayHours}:${displayMinutes}:${displaySeconds} ${ampm}`
  }
  return `${displayHours}:${displayMinutes} ${ampm}`
}

// Generate daily quests
export const generateDailyQuests = (day: number, gameData: any): DailyQuest[] => {
  const quests: DailyQuest[] = []
  const availableTasks = gameData.tasks.filter((t: Task) => !t.isCompleted)
  const availableLocations = gameData.locations
  const availableLunchItems = gameData.lunchItems
  const availableShopItems = gameData.shopItems.filter((item: any) => !item.isBought) // Only unbought items
  const statNames: (keyof GameState["stats"])[] = ["energy", "productivity", "burnout"]

  // Helper to pick a random item from an array
  const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

  // Quest 1: Task Completion
  if (availableTasks.length > 0) {
    const task = getRandom(availableTasks)
    quests.push({
      id: `quest-task-${day}-${quests.length}`,
      type: QuestType.Task,
      description: `Complete "${task.name}"`,
      isCompleted: false,
      isClaimed: false,
      currentProgress: 0,
      targetValue: 1, // Target 1 completion
      rewardExp: 25,
      rewardCoins: 15,
      criteria: { taskId: task.id },
    })
  }

  // Quest 2: Navigate or Shop or Stat
  const quest2Type = getRandom([
    QuestType.Navigate,
    QuestType.Shop,
    QuestType.Stat,
    QuestType.SeaTalk,
    QuestType.Wardrobe,
  ])
  if (quest2Type === QuestType.Navigate && availableLocations.length > 0) {
    const location = getRandom(availableLocations)
    quests.push({
      id: `quest-navigate-${day}-${quests.length}`,
      type: QuestType.Navigate,
      description: `Visit the ${location.name}`,
      isCompleted: false,
      isClaimed: false,
      currentProgress: 0,
      targetValue: 1,
      rewardExp: 20,
      rewardCoins: 10,
      criteria: { locationId: location.id },
    })
  } else if (quest2Type === QuestType.Shop && availableShopItems.length > 0) {
    const item = getRandom(availableShopItems)
    quests.push({
      id: `quest-shop-${day}-${quests.length}`,
      type: QuestType.Shop,
      description: `Buy a ${item.name} from the shop`,
      isCompleted: false,
      isClaimed: false,
      currentProgress: 0,
      targetValue: 1,
      rewardExp: 30,
      rewardCoins: 20,
      criteria: { shopItemId: item.id },
    })
  } else if (quest2Type === QuestType.Stat) {
    const statName = getRandom(statNames)
    const targetValue = Math.floor(Math.random() * (90 - 60 + 1)) + 60 // Target 60-90
    quests.push({
      id: `quest-stat-${day}-${quests.length}`,
      type: QuestType.Stat,
      description: `Reach ${targetValue} ${statName} stat`,
      isCompleted: false,
      isClaimed: false,
      currentProgress: 0,
      targetValue: targetValue,
      rewardExp: 35,
      rewardCoins: 25,
      criteria: { statName: statName },
    })
  } else if (quest2Type === QuestType.SeaTalk) {
    const targetMessages = Math.floor(Math.random() * (5 - 2 + 1)) + 2 // Send 2-5 messages
    quests.push({
      id: `quest-seatalk-${day}-${quests.length}`,
      type: QuestType.SeaTalk,
      description: `Send ${targetMessages} messages on SeaTalk`,
      isCompleted: false,
      isClaimed: false,
      currentProgress: 0,
      targetValue: targetMessages,
      rewardExp: 20,
      rewardCoins: 10,
      criteria: {},
    })
  } else if (
    quest2Type === QuestType.Wardrobe &&
    availableShopItems.filter((item) => item.type === "wardrobe").length > 0
  ) {
    const wardrobeItem = getRandom(availableShopItems.filter((item) => item.type === "wardrobe"))
    quests.push({
      id: `quest-wardrobe-${day}-${quests.length}`,
      type: QuestType.Wardrobe,
      description: `Acquire the "${wardrobeItem.name}"`,
      isCompleted: false,
      isClaimed: false,
      currentProgress: 0,
      targetValue: 1,
      rewardExp: 40,
      rewardCoins: 30,
      criteria: { wardrobeItemId: wardrobeItem.id },
    })
  }

  // Quest 3: Lunch or another Task
  const quest3Type = getRandom([QuestType.Lunch, QuestType.Task])
  if (quest3Type === QuestType.Lunch && availableLunchItems.length > 0) {
    const item = getRandom(availableLunchItems)
    quests.push({
      id: `quest-lunch-${day}-${quests.length}`,
      type: QuestType.Lunch,
      description: `Eat ${item.name} for lunch`,
      isCompleted: false,
      isClaimed: false,
      currentProgress: 0,
      targetValue: 1,
      rewardExp: 25,
      rewardCoins: 15,
      criteria: { lunchItemId: item.id },
    })
  } else if (quest3Type === QuestType.Task && availableTasks.length > 1) {
    // Pick a different task if possible
    const task = getRandom(availableTasks.filter((t: Task) => t.id !== quests[0]?.criteria?.taskId))
    if (task) {
      quests.push({
        id: `quest-task-${day}-${quests.length}`,
        type: QuestType.Task,
        description: `Complete "${task.name}"`,
        isCompleted: false,
        isClaimed: false,
        currentProgress: 0,
        targetValue: 1,
        rewardExp: 30,
        rewardCoins: 20,
        criteria: { taskId: task.id },
      })
    }
  }

  // Ensure we always return 3 quests, even if some types couldn't be generated
  while (quests.length < 3) {
    quests.push({
      id: `quest-filler-${day}-${quests.length}`,
      type: QuestType.Task, // Default to a simple task if others fail
      description: `Complete any task`,
      isCompleted: false,
      isClaimed: false,
      currentProgress: 0,
      targetValue: 1,
      rewardExp: 10,
      rewardCoins: 5,
      criteria: {},
    })
  }

  return quests.slice(0, 3) // Ensure exactly 3 quests
}

// Get weather based on game time
export const getWeather = (gameTime: number): WeatherCondition => {
  const minutesInDay = 24 * 60
  const currentDayMinutes = gameTime % minutesInDay
  const currentHour = Math.floor(currentDayMinutes / 60)

  // Time of day
  if (currentHour >= 5 && currentHour < 7) {
    return { type: "Sunrise", description: "Sunrise" }
  } else if (currentHour >= 18 && currentHour < 20) {
    return { type: "Sunset", description: "Sunset" }
  } else if (currentHour >= 20 || currentHour < 5) {
    return { type: "Night Time", description: "Night Time" }
  }

  // Random weather for working hours (7 AM to 6 PM)
  const weatherTypes: WeatherCondition["type"][] = ["Sunny", "Cloudy", "Rainy", "Windy", "Thunderstorm"]
  const randomWeatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)]

  switch (randomWeatherType) {
    case "Sunny":
      return { type: "Sunny", description: "Sunny" }
    case "Cloudy":
      return { type: "Cloudy", description: "Cloudy" }
    case "Rainy":
      return { type: "Rainy", description: "Rainy" }
    case "Windy":
      return { type: "Windy", description: "Windy" }
    case "Thunderstorm":
      return { type: "Thunderstorm", description: "Thunderstorm" }
    default:
      return { type: "Sunny", description: "Sunny" }
  }
}

// Generate a random SeaTalk message from templates
export const generateSeaTalkMessage = (templates: SeaTalkMessageTemplate[]): SeaTalkMessage | null => {
  if (templates.length === 0) return null

  const availableTemplates = templates.filter((template) => template.sender !== "user") // Only NPC messages
  if (availableTemplates.length === 0) return null

  const randomIndex = Math.floor(Math.random() * availableTemplates.length)
  const template = availableTemplates[randomIndex]

  // In a real game, you might want to track which messages have been sent
  // to avoid immediate repetition or to follow a narrative.
  // For now, it's just a random pick.

  return {
    id: `npc-msg-${Date.now()}-${Math.random()}`, // Unique ID
    sender: template.sender,
    content: template.content,
    timestamp: Date.now(), // Use real timestamp for auto-scroll
  }
}
