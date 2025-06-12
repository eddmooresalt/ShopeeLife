import type React from "react"

export enum TabType {
  Office = "office",
  Tasks = "tasks",
  Lunch = "lunch",
  Shop = "shop",
  Character = "character",
  SeaTalk = "seatalk",
  Navigate = "navigate",
  Portal = "portal",
}

export interface GameState {
  gameTime: number // Total minutes passed since game start
  day: number // Current game day
  shopeeCoins: number
  exp: number
  level: number
  stats: {
    energy: number // 0-100
    productivity: number // 0-100
    burnout: number // 0-100
  }
  tasks: Task[]
  dailyQuests: DailyQuest[]
  lastQuestResetDay: number // To track when quests were last reset
  hasEatenLunch: boolean
  lunchItemEatenId: string | null
  hasClaimedDailyBonus: boolean
  hasShownLunchReminder: boolean
  currentLocation: string // ID of the current location
  currentWeather: WeatherCondition
  seaTalkMessages: SeaTalkMessage[]
  playerName: string
  consumablesInventory: ConsumableInventoryItem[]
  shopItems: ShopItem[] // All shop items, including bought status
  wardrobe: string[] // Array of item IDs the player owns for wardrobe
  isSleeping: boolean // New state to indicate if player is sleeping
  overtime: {
    promptShown: boolean // Has the overtime prompt been shown today?
    inOvertime: boolean // Is the player currently working overtime?
  }
  // Temporary flags for triggering UI effects from gameUtils
  _triggerLunchReminder?: boolean
  _triggerOvertimePrompt?: boolean
  _triggerSleepScreen?: boolean
  _triggerRandomEvent?: boolean
  _currentRandomEvent?: RandomEvent | null
  _internalThoughtQueue?: string[] // Queue for multiple thoughts
}

export interface Task {
  id: string
  name: string
  description: string
  targetProgress: number
  progress: number
  isCompleted: boolean
  rewardExp: number
  rewardCoins: number
  energyCost: number
  burnoutEffect?: number // Optional: how much burnout this task causes
}

export interface LunchLocation {
  id: string
  name: string
  description: string
  image: string // Path to image
}

export interface LunchItem {
  id: string
  name: string
  price: number
  energyGain: number
  image: string // Path to image
}

export enum QuestType {
  Task = "task",
  Navigate = "navigate",
  Lunch = "lunch",
  Shop = "shop",
  SeaTalk = "seatalk",
  Stat = "stat",
  Wardrobe = "wardrobe", // New quest type for wardrobe items
}

export interface DailyQuest {
  id: string
  type: QuestType
  description: string
  isCompleted: boolean
  isClaimed: boolean
  currentProgress?: number // For quests that require multiple actions (e.g., send 3 messages)
  targetValue?: number // The target for currentProgress or stat value
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

export type WeatherConditionType =
  | "Sunny"
  | "Cloudy"
  | "Rainy"
  | "Windy"
  | "Thunderstorm"
  | "Sunrise"
  | "Sunset"
  | "Night Time"

export interface WeatherCondition {
  type: WeatherConditionType
  description: string
}

export interface SeaTalkMessageTemplate {
  id: string
  sender: string
  content: string
  // Add criteria for when this message should appear (e.g., after certain quest, time of day)
}

export interface SeaTalkMessage {
  id: string
  sender: string
  content: string
  timestamp: number // Game time in minutes when message was sent
}

export interface LocationType {
  id: string
  name: string
  description: string
  tabType: TabType // The tab associated with this location
  image?: string // Optional image for the location
  requiredItem?: {
    itemId: string // ID of the item required to enter
    message: string // Message to display if item is missing
  }
}

export type ShopItemType = "consumable" | "equipment" | "wardrobe"

export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  type: ShopItemType
  image: string // Path to image
  isBought?: boolean // Only for equipment/wardrobe that are one-time purchases
  effect?: {
    energy?: number
    productivity?: number
    burnout?: number
    workEfficiency?: number // e.g., for equipment
    exp?: number // Consumables can give instant EXP
    shopeeCoins?: number // Consumables can give instant coins
  }
}

export interface ConsumableInventoryItem {
  itemId: string // Refers to ShopItem.id
  quantity: number
}

export interface RandomEvent {
  id: string
  title: string
  description: string
  choices: {
    id: string
    text: string
    result: string // Message displayed after choice
    effect?: {
      energy?: number
      productivity?: number
      burnout?: number
      exp?: number
      shopeeCoins?: number
    }
  }[]
}

export interface BottomNavigationTab {
  id: TabType
  name: string
  icon: React.ElementType // Using React.ElementType for Lucide icons
}
