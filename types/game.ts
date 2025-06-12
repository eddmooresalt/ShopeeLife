import type React from "react"
export enum TabType {
  Office = "office",
  Tasks = "tasks",
  Lunch = "lunch",
  Shop = "shop",
  Character = "character",
  SeaTalk = "seaTalk",
  Navigate = "navigate",
  Portal = "portal", // Added Portal tab type
}

export enum QuestType {
  Task = "task",
  Navigate = "navigate",
  Lunch = "lunch",
  Shop = "shop",
  Stat = "stat",
  SeaTalk = "seaTalk",
  Wardrobe = "wardrobe",
}

export interface Task {
  id: string
  name: string
  description: string
  emoji: string // Added emoji field
  progress: number
  targetProgress: number
  rewardExp: number
  rewardCoins: number
  energyCost: number
  isCompleted: boolean
  burnoutEffect?: number // New: Burnout effect on completion (positive values increase burnout)
}

export interface LunchLocation {
  id: string
  name: string
  emoji: string
}

export interface LunchItem {
  id: string
  name: string
  emoji: string
  price: number
  energyGain: number
}

export interface ShopItem {
  id: string
  name: string
  description: string
  emoji: string
  price: number
  type: "consumable" | "equipment" | "wardrobe"
  effect?: {
    energy?: number
    productivity?: number
    burnout?: number // Burnout effect (negative values reduce burnout)
    workEfficiency?: number // e.g., 0.1 for 10% boost
    exp?: number // Added exp effect for consumables
    shopeeCoins?: number // Added shopeeCoins effect for consumables
  }
  isBought: boolean
}

export interface ConsumableInventoryItem {
  itemId: string
  quantity: number
}

export interface BottomNavigationTab {
  id: TabType
  name: string
  icon: string
}

export interface LocationType {
  id: string
  name: string
  emoji: string
  description: string
  tabType: TabType // The tab that this location primarily represents
}

export interface RandomEventChoice {
  id: string
  text: string
  result: string
  effect?: {
    exp?: number
    shopeeCoins?: number
    energy?: number
    productivity?: number
    burnout?: number // Burnout effect (negative values reduce burnout)
  }
}

export interface RandomEvent {
  id: string
  title: string
  description: string
  emoji: string // Added emoji field for contextual display
  choices: RandomEventChoice[]
}

export interface SeaTalkMessage {
  id: string
  sender: string // "user" or NPC name
  content: string
  timestamp: number // Game time in minutes
}

export interface SeaTalkMessageTemplate {
  sender: string
  content: string
  timestampOffset: number // Offset from game start or previous message
  tone:
    | "professional"
    | "jovial"
    | "sarcastic"
    | "sad"
    | "angry"
    | "anxious"
    | "casual"
    | "flirty"
    | "happy"
    | "determined"
}

export interface DailyQuest {
  id: string
  type: QuestType
  description: string
  isCompleted: boolean
  isClaimed: boolean
  currentProgress: number
  targetValue?: number // e.g., target stat level, number of messages
  rewardExp: number
  rewardCoins: number
  criteria?: {
    taskId?: string
    locationId?: string
    lunchItemId?: string
    shopItemId?: string
    statName?: keyof GameState["stats"]
    wardrobeItemId?: string
  }
}

export interface WeatherCondition {
  type: "Sunny" | "Cloudy" | "Rainy" | "Windy" | "Thunderstorm" | "Sunrise" | "Sunset" | "Night Time"
  description: string
}

export interface GameState {
  gameTime: number // In minutes from game start (e.g., 0 = 9:00 AM)
  exp: number
  level: number
  shopeeCoins: number
  stats: {
    energy: number
    productivity: number
    burnout: number // Burnout stat (lower is better)
  }
  tasks: Task[]
  lunchLocations: LunchLocation[]
  lunchItems: LunchItem[]
  shopItems: ShopItem[]
  wardrobe: string[] // Array of item IDs in wardrobe
  consumablesInventory: ConsumableInventoryItem[] // Changed to track quantity
  hasEatenLunch: boolean
  lunchItemEatenId: string | null
  seaTalkMessages: SeaTalkMessage[]
  lastQuestResetDay: number // To track when daily quests were last reset
  dailyQuests: DailyQuest[]
  hasClaimedDailyBonus: boolean // To prevent claiming bonus multiple times per day
  hasShownLunchReminder: boolean // To prevent showing lunch reminder multiple times per day
  currentWeather: WeatherCondition
  playerName: string // New: Player's customizable name
}

export interface PortalActionEffect {
  exp?: number
  shopeeCoins?: number
  energy?: number
  productivity?: number
  burnout?: number
}

export interface PortalAction {
  id: string
  name: string
  description: string
  effect: PortalActionEffect
  cost: number
  duration: number // Duration in seconds for the progress bar
}

export interface PortalCategory {
  id: string
  name: string
  emoji: string
  icon: React.ElementType
  description: string
  cooldown: number // in game minutes
  actions: PortalAction[]
}
