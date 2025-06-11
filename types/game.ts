export interface GameState {
  energy: number
  productivity: number
  burnout: number
  experience: number
  level: number
  money: number
  day: number
  hour: number
}

export interface Role {
  title: string
  experienceRequired: number
  salary: number
  description: string
}

export interface Task {
  id: string
  name: string
  description: string
  energyCost: number
  productivityGain: number
  burnoutGain: number
  experienceGain: number
  moneyGain: number
  duration: number // in game minutes (1 game minute = 1 real second)
  icon?: any // Optional, will be replaced by emoji
  emoji: string // Added emoji property
  available: (level: number) => boolean
}

export interface LunchOption {
  id: number
  name: string
  price: number
  energy: number
  emoji: string
}

export interface LunchLocation {
  id: string
  name: string
  description: string
  emoji: string
}

export interface CustomizationItem {
  id: string
  name: string
  price: number
  unlocked: boolean
  color?: string // For skin, hair, clothes
  shape?: string // For hair styles (e.g., 'short', 'long', 'curly')
  emoji?: string // For accessories or gender
}

export interface SelectedCharacterParts {
  gender: string
  skinColor: string
  hairStyle: string
  makeup: string
  top: string
  bottom: string
  shoes: string
  accessory: string
}

export interface ShopProduct {
  id: string
  name: string
  price: number
  image: string
  description: string
  effects: {
    productivity?: number
    energy?: number
    burnout?: number
    experience?: number
  }
  duration: string
  owned: boolean
  premium?: boolean
  requiresLevel?: number
  emoji: string // Added emoji property
}

export interface ChatMessage {
  id: number
  sender: string
  message: string
  time: string
  avatar: string
  department?: string
  reactions?: string[]
}

export interface GameTime {
  hour: number
  minute: number
}

export interface OrgNode {
  id: string
  name: string
  title: string
  reportsTo?: string
  emoji: string
}

export interface RandomEventOption {
  text: string
  emoji: string
  effects: {
    energy?: number
    productivity?: number
    burnout?: number
    experience?: number
    money?: number
  }
}

export interface RandomEvent {
  id: string
  title: string
  description: string
  emoji: string
  options: [RandomEventOption, RandomEventOption]
}

export interface InternalThought {
  id: string
  text: string
  emoji: string
}

export interface SavedGameState {
  gameState: GameState
  inventory: ShopProduct[]
  selectedCharacterParts: SelectedCharacterParts
  chatMessages: ChatMessage[]
  gameTime: GameTime
  currentLocation: string
  queuedTasks: Task[]
}
