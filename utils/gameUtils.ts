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
  type LocationType, // Added LocationType for clarity in gameData usage
  type ShopItem, // Added ShopItem for clarity in gameData usage
  type RandomEvent, // Added RandomEvent for clarity in gameData usage
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
      playerName: loadedState.playerName || initialGameState.playerName, // Initialize playerName
      // Ensure consumablesInventory is correctly initialized
      consumablesInventory: Array.isArray(loadedState.consumablesInventory)
        ? loadedState.consumablesInventory
        : initialGameState.consumablesInventory,
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

// Generate daily quests
export const generateDailyQuests = (
  day: number,
  gameData: {
    tasks: Task[]
    locations: LocationType[]
    lunchItems: LunchItem[]
    shopItems: ShopItem[]
    seaTalkMessages: SeaTalkMessageTemplate[]
    randomEvents: RandomEvent[]
  },
): DailyQuest[] => {
  const quests: DailyQuest[] = []

  // Defensive checks to ensure properties are arrays
  const tasks = Array.isArray(gameData.tasks) ? gameData.tasks : []
  const locations = Array.isArray(gameData.locations) ? gameData.locations : []
  const lunchItems = Array.isArray(gameData.lunchItems) ? gameData.lunchItems : []
  const shopItems = Array.isArray(gameData.shopItems) ? gameData.shopItems : []

  const availableTasks = tasks.filter((t: Task) => !t.isCompleted)
  const availableLocations = locations
  const availableLunchItems = lunchItems
  const availableShopItems = shopItems.filter((item: ShopItem) => !item.isBought) // Explicitly type item

  const statNames: (keyof GameState["stats"])[] = ["energy", "productivity", "burnout"]

  // Helper to pick a random item from an array
  const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

  // Quest 1: Always a Task Completion quest
  if (availableTasks.length > 0) {
    const task = getRandom(availableTasks)
    quests.push({
      id: `quest-task-${day}-1`,
      type: QuestType.Task,
      description: `Complete "${task.name}"`,
      isCompleted: false,
      isClaimed: false,
      currentProgress: 0,
      targetValue: 1,
      rewardExp: 25,
      rewardCoins: 15,
      criteria: { taskId: task.id },
    })
  } else {
    // Fallback task quest
    quests.push({
      id: `quest-task-${day}-1`,
      type: QuestType.Task,
      description: `Complete any work task`,
      isCompleted: false,
      isClaimed: false,
      currentProgress: 0,
      targetValue: 1,
      rewardExp: 20,
      rewardCoins: 10,
      criteria: {},
    })
  }

  // Quest 2: Navigation, Shop, or SeaTalk quest
  const quest2Types = [QuestType.Navigate, QuestType.Shop, QuestType.SeaTalk]
  const quest2Type = getRandom(quest2Types)

  if (quest2Type === QuestType.Navigate && availableLocations.length > 0) {
    const location = getRandom(availableLocations)
    quests.push({
      id: `quest-navigate-${day}-2`,
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
      id: `quest-shop-${day}-2`,
      type: QuestType.Shop,
      description: `Buy "${item.name}" from the shop`,
      isCompleted: false,
      isClaimed: false,
      currentProgress: 0,
      targetValue: 1,
      rewardExp: 30,
      rewardCoins: 20,
      criteria: { shopItemId: item.id },
    })
  } else {
    // SeaTalk quest as fallback
    const targetMessages = Math.floor(Math.random() * 3) + 2 // Send 2-4 messages
    quests.push({
      id: `quest-seatalk-${day}-2`,
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
  }

  // Quest 3: Lunch or Stat quest
  const quest3Types = [QuestType.Lunch, QuestType.Stat]
  const quest3Type = getRandom(quest3Types)

  if (quest3Type === QuestType.Lunch && availableLunchItems.length > 0) {
    const item = getRandom(availableLunchItems)
    quests.push({
      id: `quest-lunch-${day}-3`,
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
  } else {
    // Stat quest
    const statName = getRandom(statNames)
    const targetValue =
      statName === "burnout"
        ? Math.floor(Math.random() * 20) + 10
        : // Lower burnout target (10-30)
          Math.floor(Math.random() * 30) + 60 // Higher target for energy/productivity (60-90)

    quests.push({
      id: `quest-stat-${day}-3`,
      type: QuestType.Stat,
      description: `${statName === "burnout" ? "Reduce" : "Reach"} ${targetValue} ${statName}`,
      isCompleted: false,
      isClaimed: false,
      currentProgress: 0,
      targetValue: targetValue,
      rewardExp: 30,
      rewardCoins: 20,
      criteria: { statName: statName },
    })
  }

  return quests
}

// Get weather based on game time - more stable weather system
export const getWeather = (gameTime: number): WeatherCondition => {
  const minutesInDay = 24 * 60
  const currentDayMinutes = gameTime % minutesInDay
  const currentHour = Math.floor(currentDayMinutes / 60)
  const currentDay = Math.floor(gameTime / minutesInDay)

  // Time of day weather (always consistent)
  if (currentHour >= 5 && currentHour < 7) {
    return { type: "Sunrise", description: "Sunrise" }
  } else if (currentHour >= 18 && currentHour < 20) {
    return { type: "Sunset", description: "Sunset" }
  } else if (currentHour >= 20 || currentHour < 5) {
    return { type: "Night Time", description: "Night Time" }
  }

  // Stable weather for working hours - changes only every 4 hours
  const weatherBlock = Math.floor(currentHour / 4) // 0, 1, 2, 3, 4, 5
  const weatherSeed = currentDay * 10 + weatherBlock // Deterministic seed

  const weatherTypes: WeatherCondition["type"][] = ["Sunny", "Cloudy", "Rainy", "Windy", "Thunderstorm"]
  const weatherIndex = weatherSeed % weatherTypes.length
  const selectedWeatherType = weatherTypes[weatherIndex]

  // Weight towards more pleasant weather (70% chance of Sunny/Cloudy)
  const pleasantWeatherChance = weatherSeed % 10
  if (pleasantWeatherChance < 4) {
    return { type: "Sunny", description: "Sunny" }
  } else if (pleasantWeatherChance < 7) {
    return { type: "Cloudy", description: "Cloudy" }
  }

  switch (selectedWeatherType) {
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

/**
 * Calculate the current game day based on game time
 * @param gameTime Current game time in minutes
 * @returns The current game day (starting from day 1)
 */
export function getGameDay(gameTime: number): number {
  // Each day is 24 hours = 1440 minutes
  const dayLength = 24 * 60
  // Add 1 because days start at 1, not 0
  return Math.floor(gameTime / dayLength) + 1
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

/**
 * Calculates the player's grade based on productivity and burnout.
 * A+ (highest) to D (lowest).
 * @param productivity Player's current productivity stat (0-100)
 * @param burnout Player's current burnout stat (0-100)
 * @returns A string representing the player's grade.
 */
export function calculatePlayerGrade(productivity: number, burnout: number): string {
  // Normalize stats: higher productivity is good, lower burnout is good.
  // Invert burnout so higher value means better (100 - burnout)
  const effectiveBurnout = 100 - burnout

  // Simple weighted average or combined score
  // Productivity is generally more impactful for "work grade", but burnout is critical for sustainability.
  // Let's give productivity a slightly higher weight.
  const combinedScore = productivity * 0.6 + effectiveBurnout * 0.4

  if (combinedScore >= 95) return "A+"
  if (combinedScore >= 85) return "A"
  if (combinedScore >= 75) return "B+"
  if (combinedScore >= 65) return "B"
  if (combinedScore >= 55) return "C+"
  if (combinedScore >= 45) return "C"
  if (combinedScore >= 30) return "D+"
  return "D"
}

/**
 * Determines the player's level rank based on their current level.
 * @param level Player's current level
 * @returns A string representing the player's rank.
 */
export function getLevelRank(level: number): string {
  if (level < 5) return "Associate"
  if (level < 10) return "Junior Specialist"
  if (level < 15) return "Specialist"
  if (level < 20) return "Senior Specialist"
  if (level < 25) return "Team Lead"
  if (level < 30) return "Assistant Manager"
  if (level < 35) return "Manager"
  if (level < 40) return "Senior Manager"
  if (level < 45) return "Associate Director"
  if (level < 50) return "Director"
  if (level < 60) return "Senior Director"
  if (level < 70) return "Vice President"
  if (level < 80) return "Senior Vice President"
  if (level < 90) return "Executive Vice President"
  if (level < 100) return "Chief Officer"
  return "Legend" // For level 100 and above
}

/**
 * Performs the smoking action, reducing cigarette count and applying effects.
 * @param gameState Current game state
 * @param cigaretteItemId The ID of the cigarette item (e.g., "marlboro-cigarettes")
 * @param shopItems All available shop items to get effect details
 * @returns Updated game state and an internal thought message.
 */
export function performSmokingAction(
  gameState: GameState,
  cigaretteItemId: string,
  shopItems: ShopItem[],
): { updatedState: GameState; internalThought: string | null } {
  const cigaretteInInventory = gameState.consumablesInventory.find((item) => item.itemId === cigaretteItemId)
  const cigaretteShopItem = shopItems.find((item) => item.id === cigaretteItemId)

  if (!cigaretteInInventory || cigaretteInInventory.quantity <= 0 || !cigaretteShopItem) {
    return { updatedState: gameState, internalThought: "You don't have any cigarettes to smoke!" }
  }

  const updatedConsumablesInventory = gameState.consumablesInventory.map((item) =>
    item.itemId === cigaretteItemId ? { ...item, quantity: item.quantity - 1 } : item,
  )

  const effect = cigaretteShopItem.effect || {}
  const updatedStats = {
    energy: Math.min(100, Math.max(0, gameState.stats.energy + (effect.energy || 0))),
    productivity: Math.min(100, Math.max(0, gameState.stats.productivity + (effect.productivity || 0))),
    burnout: Math.min(100, Math.max(0, gameState.stats.burnout + (effect.burnout || 0))),
  }

  const updatedState = {
    ...gameState,
    consumablesInventory: updatedConsumablesInventory,
    stats: updatedStats,
  }

  const internalThought = `You smoked a cigarette. Burnout ${effect.burnout > 0 ? "+" : ""}${
    effect.burnout
  }, Energy ${effect.energy > 0 ? "+" : ""}${effect.energy}, Productivity ${effect.productivity > 0 ? "+" : ""}${
    effect.productivity
  }.`

  return { updatedState, internalThought }
}
