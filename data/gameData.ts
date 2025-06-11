import type {
  Role,
  Task,
  LunchOption,
  ShopProduct,
  LunchLocation,
  OrgNode,
  RandomEvent,
  CustomizationItem,
  InternalThought,
} from "../types/game"

export const roles: Role[] = [
  { title: "Associate", experienceRequired: 0, salary: 300, description: "Entry-level position" },
  { title: "Senior Associate", experienceRequired: 100, salary: 450, description: "Experienced team member" },
  { title: "Assistant Manager", experienceRequired: 250, salary: 600, description: "Junior management role" },
  { title: "Manager", experienceRequired: 500, salary: 800, description: "Team leadership position" },
  { title: "Senior Manager", experienceRequired: 1000, salary: 1200, description: "Department oversight" },
  { title: "Director", experienceRequired: 2000, salary: 1800, description: "Strategic leadership" },
  { title: "VP", experienceRequired: 4000, salary: 2500, description: "Executive leadership" },
  { title: "C-Level", experienceRequired: 8000, salary: 4000, description: "Top executive" },
]

export const tasks: Task[] = [
  // Basic Tasks (Level 0+)
  {
    id: "email",
    name: "Check Emails",
    description: "Process daily emails and respond to urgent matters",
    energyCost: 10,
    productivityGain: 15,
    burnoutGain: 5, // Low burnout
    experienceGain: 5,
    moneyGain: 0,
    duration: 9, // Increased duration (3 * 3)
    emoji: "📧",
    available: () => true,
  },
  {
    id: "organize-desk",
    name: "Organize Desk",
    description: "Clean and organize your workspace for better efficiency",
    energyCost: 8,
    productivityGain: 12,
    burnoutGain: 3, // Very low burnout
    experienceGain: 3,
    moneyGain: 0,
    duration: 6, // Increased duration (2 * 3)
    emoji: "🧹",
    available: () => true,
  },
  {
    id: "file-documents",
    name: "File Documents",
    description: "Sort and file important company documents",
    energyCost: 12,
    productivityGain: 18,
    burnoutGain: 7, // Low burnout
    experienceGain: 6,
    moneyGain: 25,
    duration: 12, // Increased duration (4 * 3)
    emoji: "🗂️",
    available: () => true,
  },
  {
    id: "data-entry",
    name: "Data Entry",
    description: "Input customer information into the database",
    energyCost: 15,
    productivityGain: 20,
    burnoutGain: 10, // Medium burnout
    experienceGain: 8,
    moneyGain: 40,
    duration: 15, // Increased duration (5 * 3)
    emoji: "⌨️",
    available: () => true,
  },
  {
    id: "phone-calls",
    name: "Customer Calls",
    description: "Handle customer inquiries and support requests",
    energyCost: 18,
    productivityGain: 22,
    burnoutGain: 12, // Medium burnout
    experienceGain: 10,
    moneyGain: 60,
    duration: 18, // Increased duration (6 * 3)
    emoji: "📞",
    available: () => true,
  },

  // Intermediate Tasks (Level 1+)
  {
    id: "report",
    name: "Write Report",
    description: "Create detailed analysis report for management",
    energyCost: 25,
    productivityGain: 30,
    burnoutGain: 15, // Medium-high burnout
    experienceGain: 15,
    moneyGain: 100,
    duration: 24, // Increased duration (8 * 3)
    emoji: "📝",
    available: (level) => level >= 1,
  },
  {
    id: "meeting",
    name: "Team Meeting",
    description: "Collaborate with team members on projects",
    energyCost: 20,
    productivityGain: 25,
    burnoutGain: 10, // Medium burnout
    experienceGain: 12,
    moneyGain: 50,
    duration: 21, // Increased duration (7 * 3)
    emoji: "👥",
    available: (level) => level >= 1,
  },
  {
    id: "market-research",
    name: "Market Research",
    description: "Analyze market trends and competitor data",
    energyCost: 22,
    productivityGain: 28,
    burnoutGain: 13, // Medium burnout
    experienceGain: 14,
    moneyGain: 80,
    duration: 21, // Increased duration (7 * 3)
    emoji: "📈",
    available: (level) => level >= 1,
  },
  {
    id: "social-media",
    name: "Social Media Management",
    description: "Update company social media accounts",
    energyCost: 15,
    productivityGain: 20,
    burnoutGain: 9, // Low-medium burnout
    experienceGain: 10,
    moneyGain: 45,
    duration: 15, // Increased duration (5 * 3)
    emoji: "📱",
    available: (level) => level >= 1,
  },
  {
    id: "inventory-check",
    name: "Inventory Check",
    description: "Count and verify office supplies and equipment",
    energyCost: 20,
    productivityGain: 15,
    burnoutGain: 8, // Low-medium burnout
    experienceGain: 8,
    moneyGain: 35,
    duration: 18, // Increased duration (6 * 3)
    emoji: "📦",
    available: (level) => level >= 1,
  },

  // Advanced Tasks (Level 2+)
  {
    id: "presentation",
    name: "Client Presentation",
    description: "Present solutions to important clients",
    energyCost: 35,
    productivityGain: 40,
    burnoutGain: 20, // High burnout
    experienceGain: 25,
    moneyGain: 200,
    duration: 30, // Increased duration (10 * 3)
    emoji: "📊",
    available: (level) => level >= 2,
  },
  {
    id: "budget-planning",
    name: "Budget Planning",
    description: "Create quarterly budget forecasts",
    energyCost: 30,
    productivityGain: 35,
    burnoutGain: 18, // High burnout
    experienceGain: 20,
    moneyGain: 150,
    duration: 27, // Increased duration (9 * 3)
    emoji: "💰",
    available: (level) => level >= 2,
  },
  {
    id: "training-session",
    name: "Training Session",
    description: "Conduct training for new employees",
    energyCost: 28,
    productivityGain: 32,
    burnoutGain: 16, // Medium-high burnout
    experienceGain: 22,
    moneyGain: 120,
    duration: 24, // Increased duration (8 * 3)
    emoji: "🧑‍🏫",
    available: (level) => level >= 2,
  },
  {
    id: "vendor-negotiation",
    name: "Vendor Negotiation",
    description: "Negotiate contracts with suppliers",
    energyCost: 32,
    productivityGain: 38,
    burnoutGain: 22, // High burnout
    experienceGain: 24,
    moneyGain: 180,
    duration: 30, // Increased duration (10 * 3)
    emoji: "🤝",
    available: (level) => level >= 2,
  },
  {
    id: "quality-audit",
    name: "Quality Audit",
    description: "Review and audit department processes",
    energyCost: 26,
    productivityGain: 30,
    burnoutGain: 15, // Medium-high burnout
    experienceGain: 18,
    moneyGain: 110,
    duration: 27, // Increased duration (9 * 3)
    emoji: "✅",
    available: (level) => level >= 2,
  },

  // Expert Tasks (Level 3+)
  {
    id: "strategy",
    name: "Strategic Planning",
    description: "Develop long-term business strategies",
    energyCost: 40,
    productivityGain: 50,
    burnoutGain: 25, // Very high burnout
    experienceGain: 35,
    moneyGain: 300,
    duration: 36, // Increased duration (12 * 3)
    emoji: "🧠",
    available: (level) => level >= 3,
  },
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Coordinate new product launch campaign",
    energyCost: 45,
    productivityGain: 55,
    burnoutGain: 30, // Very high burnout
    experienceGain: 40,
    moneyGain: 400,
    duration: 42, // Increased duration (14 * 3)
    emoji: "🚀",
    available: (level) => level >= 3,
  },
  {
    id: "crisis-management",
    name: "Crisis Management",
    description: "Handle urgent company crisis situations",
    energyCost: 50,
    productivityGain: 60,
    burnoutGain: 35, // Extreme burnout
    experienceGain: 45,
    moneyGain: 500,
    duration: 45, // Increased duration (15 * 3)
    emoji: "🚨",
    available: (level) => level >= 3,
  },
  {
    id: "merger-analysis",
    name: "Merger Analysis",
    description: "Analyze potential company mergers",
    energyCost: 42,
    productivityGain: 52,
    burnoutGain: 28, // Very high burnout
    experienceGain: 38,
    moneyGain: 350,
    duration: 39, // Increased duration (13 * 3)
    emoji: "🤝",
    available: (level) => level >= 3,
  },
  {
    id: "board-presentation",
    name: "Board Presentation",
    description: "Present quarterly results to board members",
    energyCost: 48,
    productivityGain: 58,
    burnoutGain: 32, // Extreme burnout
    experienceGain: 42,
    moneyGain: 450,
    duration: 48, // Increased duration (16 * 3)
    emoji: "🧑‍💼",
    available: (level) => level >= 3,
  },

  // Senior Tasks (Level 4+)
  {
    id: "acquisition-deal",
    name: "Acquisition Deal",
    description: "Lead company acquisition negotiations",
    energyCost: 55,
    productivityGain: 65,
    burnoutGain: 40, // Extreme burnout
    experienceGain: 50,
    moneyGain: 600,
    duration: 54, // Increased duration (18 * 3)
    emoji: "💎",
    available: (level) => level >= 4,
  },
  {
    id: "ipo-preparation",
    name: "IPO Preparation",
    description: "Prepare company for public offering",
    energyCost: 60,
    productivityGain: 70,
    burnoutGain: 45, // Max burnout
    experienceGain: 55,
    moneyGain: 800,
    duration: 60, // Increased duration (20 * 3)
    emoji: "📈",
    available: (level) => level >= 4,
  },
  {
    id: "global-expansion",
    name: "Global Expansion",
    description: "Plan international market expansion",
    energyCost: 52,
    productivityGain: 62,
    burnoutGain: 38, // Extreme burnout
    experienceGain: 48,
    moneyGain: 550,
    duration: 51, // Increased duration (17 * 3)
    emoji: "🌍",
    available: (level) => level >= 4,
  },

  // Executive Tasks (Level 5+)
  {
    id: "ceo-meeting",
    name: "CEO Meeting",
    description: "Strategic discussion with company leadership",
    energyCost: 65,
    productivityGain: 75,
    burnoutGain: 50, // Max burnout
    experienceGain: 60,
    moneyGain: 1000,
    duration: 66, // Increased duration (22 * 3)
    emoji: "👑",
    available: (level) => level >= 5,
  },
  {
    id: "industry-conference",
    name: "Industry Conference",
    description: "Represent company at major industry event",
    energyCost: 58,
    productivityGain: 68,
    burnoutGain: 42, // Extreme burnout
    experienceGain: 52,
    moneyGain: 700,
    duration: 57, // Increased duration (19 * 3)
    emoji: "🌟",
    available: (level) => level >= 5,
  },

  // Recovery/Break Tasks
  {
    id: "coffee",
    name: "Coffee Break",
    description: "Take a refreshing break to recharge",
    energyCost: -30,
    productivityGain: 5,
    burnoutGain: -15, // Reduces burnout
    experienceGain: 0,
    moneyGain: -10,
    duration: 6, // Increased duration (2 * 3)
    emoji: "☕",
    available: () => true,
  },
  {
    id: "meditation",
    name: "Meditation Break",
    description: "Practice mindfulness to reduce stress",
    energyCost: -25,
    productivityGain: 8,
    burnoutGain: -20, // Reduces burnout significantly
    experienceGain: 2,
    moneyGain: 0,
    duration: 9, // Increased duration (3 * 3)
    emoji: "🧘",
    available: () => true,
  },
  {
    id: "walk",
    name: "Office Walk",
    description: "Take a walk around the office building",
    energyCost: -20,
    productivityGain: 10,
    burnoutGain: -12, // Reduces burnout
    experienceGain: 1,
    moneyGain: 0,
    duration: 6, // Increased duration (2 * 3)
    emoji: "🚶",
    available: () => true,
  },
  {
    id: "rest",
    name: "Go Home Early",
    description: "Leave work early to rest and recover",
    energyCost: -50,
    productivityGain: -10,
    burnoutGain: -30, // Reduces burnout a lot
    experienceGain: 0,
    moneyGain: -50,
    duration: 15, // Increased duration (5 * 3)
    emoji: "🏠",
    available: () => true,
  },
  {
    id: "game",
    name: "Office Games",
    description: "Play games with colleagues to boost morale",
    energyCost: -20,
    productivityGain: 10,
    burnoutGain: -20, // Reduces burnout
    experienceGain: 5,
    moneyGain: 0,
    duration: 12, // Increased duration (4 * 3)
    emoji: "🎮",
    available: (level) => level >= 2,
  },
  {
    id: "networking",
    name: "Office Networking",
    description: "Build relationships with colleagues",
    energyCost: -15,
    productivityGain: 15,
    burnoutGain: -10, // Reduces burnout
    experienceGain: 8,
    moneyGain: 0,
    duration: 9, // Increased duration (3 * 3)
    emoji: "🤝",
    available: (level) => level >= 1,
  },

  // Creative Tasks
  {
    id: "design-review",
    name: "Design Review",
    description: "Review and approve marketing designs",
    energyCost: 24,
    productivityGain: 28,
    burnoutGain: 12,
    experienceGain: 16,
    moneyGain: 90,
    duration: 21, // Increased duration (7 * 3)
    emoji: "🎨",
    available: (level) => level >= 2,
  },
  {
    id: "video-conference",
    name: "Video Conference",
    description: "Host important client video calls",
    energyCost: 26,
    productivityGain: 30,
    burnoutGain: 14,
    experienceGain: 18,
    moneyGain: 100,
    duration: 24, // Increased duration (8 * 3)
    emoji: "📹",
    available: (level) => level >= 1,
  },
  {
    id: "system-update",
    name: "System Update",
    description: "Update and maintain office systems",
    energyCost: 20,
    productivityGain: 25,
    burnoutGain: 10,
    experienceGain: 12,
    moneyGain: 70,
    duration: 18, // Increased duration (6 * 3)
    emoji: "⚙️",
    available: (level) => level >= 1,
  },
]

export const lunchLocations: LunchLocation[] = [
  {
    id: "hawker-center",
    name: "Hawker Center",
    description: "Authentic local delights at affordable prices.",
    emoji: "🍜",
  },
  {
    id: "food-court",
    name: "Food Court",
    description: "Variety of cuisines in a casual setting.",
    emoji: "🍽️",
  },
  {
    id: "cafe",
    name: "Cozy Cafe",
    description: "Relaxed atmosphere with sandwiches and pastries.",
    emoji: "☕",
  },
  {
    id: "restaurant",
    name: "Fine Dining",
    description: "Upscale experience with gourmet meals.",
    emoji: "🍷",
  },
  {
    id: "healthy-eatery",
    name: "Healthy Bites",
    description: "Fresh salads and nutritious bowls.",
    emoji: "🥗",
  },
  {
    id: "fast-food",
    name: "Quick Bites",
    description: "Fast and convenient options for a quick meal.",
    emoji: "🍔",
  },
]

export const lunchOptions: Record<string, LunchOption[]> = {
  "hawker-center": [
    { id: 1, name: "Hainanese Chicken Rice", price: 4.5, energy: 25, emoji: "🍚" },
    { id: 2, name: "Char Kway Teow", price: 5.0, energy: 30, emoji: "🍝" },
    { id: 3, name: "Laksa", price: 4.8, energy: 28, emoji: "🌶️" },
    { id: 4, name: "Bak Chor Mee", price: 4.2, energy: 22, emoji: "🍜" },
    { id: 5, name: "Wonton Mee", price: 4.0, energy: 20, emoji: "🥟" },
    { id: 6, name: "Nasi Lemak", price: 3.5, energy: 24, emoji: "🥥" },
    { id: 7, name: "Mee Goreng", price: 4.0, energy: 26, emoji: "🌶️" },
    { id: 8, name: "Roti Prata", price: 2.5, energy: 18, emoji: "🥞" },
    { id: 9, name: "Popiah", price: 3.0, energy: 15, emoji: "🌯" },
    { id: 10, name: "Oyster Omelette", price: 6.0, energy: 35, emoji: "🍳" },
  ],
  "food-court": [
    { id: 11, name: "Korean BBQ Bowl", price: 9.0, energy: 35, emoji: "🍖" },
    { id: 12, name: "Japanese Bento Set", price: 10.5, energy: 30, emoji: "🍱" },
    { id: 13, name: "Western Grill", price: 11.0, energy: 40, emoji: "🥩" },
    { id: 14, name: "Indian Curry Rice", price: 7.5, energy: 32, emoji: "🍛" },
    { id: 15, name: "Vietnamese Pho", price: 8.0, energy: 28, emoji: "🍲" },
    { id: 16, name: "Thai Green Curry", price: 8.5, energy: 30, emoji: "🥥" },
    { id: 17, name: "Chinese Stir-fry", price: 7.0, energy: 27, emoji: "🥢" },
    { id: 18, name: "Pasta Station", price: 9.5, energy: 33, emoji: "🍝" },
    { id: 19, name: "Salad Bar", price: 6.5, energy: 20, emoji: "🥗" },
    { id: 20, name: "Soup & Bread", price: 5.5, energy: 18, emoji: "🥣" },
  ],
  cafe: [
    { id: 21, name: "Club Sandwich", price: 8.0, energy: 25, emoji: "🥪" },
    { id: 22, name: "Croissant & Coffee", price: 6.5, energy: 20, emoji: "🥐" },
    { id: 23, name: "Avocado Toast", price: 9.0, energy: 22, emoji: "🥑" },
    { id: 24, name: "Quiche Lorraine", price: 7.0, energy: 23, emoji: "🥧" },
    { id: 25, name: "Muffin & Tea", price: 5.0, energy: 18, emoji: "🧁" },
    { id: 26, name: "Smoothie Bowl", price: 10.0, energy: 28, emoji: "🍓" },
    { id: 27, name: "Bagel with Cream Cheese", price: 6.0, energy: 20, emoji: "🥯" },
    { id: 28, name: "Pancakes with Syrup", price: 9.5, energy: 30, emoji: "🥞" },
    { id: 29, name: "Espresso & Pastry", price: 7.0, energy: 22, emoji: "☕" },
    { id: 30, name: "Yogurt Parfait", price: 7.5, energy: 15, emoji: "🍦" },
  ],
  restaurant: [
    { id: 31, name: "Grilled Salmon", price: 25.0, energy: 40, emoji: "🐟" },
    { id: 32, name: "Steak Frites", price: 30.0, energy: 45, emoji: "🥩" },
    { id: 33, name: "Truffle Pasta", price: 22.0, energy: 38, emoji: "🍝" },
    { id: 34, name: "Lobster Bisque", price: 18.0, energy: 30, emoji: "🥣" },
    { id: 35, name: "Duck Confit", price: 28.0, energy: 42, emoji: "🦆" },
    { id: 36, name: "Wagyu Burger", price: 20.0, energy: 35, emoji: "🍔" },
    { id: 37, name: "Seafood Paella", price: 26.0, energy: 40, emoji: "🥘" },
    { id: 38, name: "Lamb Shank", price: 29.0, energy: 43, emoji: "🍖" },
    { id: 39, name: "Vegetable Risotto", price: 19.0, energy: 32, emoji: "🍚" },
    { id: 40, name: "Chocolate Lava Cake", price: 12.0, energy: 10, emoji: "🍫" },
  ],
  "healthy-eatery": [
    { id: 41, name: "Quinoa Salad", price: 12.0, energy: 20, emoji: "🥗" },
    { id: 42, name: "Chicken Breast & Veggies", price: 14.0, energy: 25, emoji: "🍗" },
    { id: 43, name: "Lentil Soup", price: 9.0, energy: 18, emoji: "🥣" },
    { id: 44, name: "Tofu Stir-fry", price: 11.0, energy: 22, emoji: "🥢" },
    { id: 45, name: "Acai Bowl", price: 10.0, energy: 15, emoji: "🍇" },
    { id: 46, name: "Whole Wheat Wrap", price: 8.5, energy: 18, emoji: "🌯" },
    { id: 47, name: "Green Juice", price: 7.0, energy: 10, emoji: "🥬" },
    { id: 48, name: "Vegan Burger", price: 13.0, energy: 24, emoji: "🍔" },
    { id: 49, name: "Fruit Platter", price: 7.5, energy: 12, emoji: "🍉" },
    { id: 50, name: "Oatmeal with Berries", price: 6.0, energy: 15, emoji: "🥣" },
  ],
  "fast-food": [
    { id: 51, name: "Classic Burger", price: 7.0, energy: 28, emoji: "🍔" },
    { id: 52, name: "Crispy Chicken Sandwich", price: 7.5, energy: 30, emoji: "🍗" },
    { id: 53, name: "Large Fries", price: 3.0, energy: 15, emoji: "🍟" },
    { id: 54, name: "Chicken Nuggets (6 pcs)", price: 6.0, energy: 25, emoji: "🍗" },
    { id: 55, name: "Soft Drink", price: 2.0, energy: 5, emoji: "🥤" },
    { id: 56, name: "Fish Burger", price: 6.5, energy: 26, emoji: "🍔" },
    { id: 57, name: "Onion Rings", price: 3.5, energy: 18, emoji: "🧅" },
    { id: 58, name: "Milkshake", price: 4.0, energy: 10, emoji: "🍦" },
    { id: 59, name: "Cheeseburger", price: 7.2, energy: 29, emoji: "🍔" },
    { id: 60, name: "Spicy Chicken Wrap", price: 8.0, energy: 32, emoji: "🌯" },
  ],
}

export const characterCustomizationOptions: Record<string, CustomizationItem[]> = {
  gender: [
    { id: "neutral", name: "Neutral", price: 0, unlocked: true, emoji: "👤" },
    { id: "male", name: "Male", price: 0, unlocked: true, emoji: "👨" },
    { id: "female", name: "Female", price: 0, unlocked: true, emoji: "👩" },
  ],
  skinColor: [
    { id: "light", name: "Light", price: 0, unlocked: true, color: "#FCE5CD", emoji: "🏻" },
    { id: "medium", name: "Medium", price: 0, unlocked: true, color: "#D2A679", emoji: "🏽" },
    { id: "dark", name: "Dark", price: 0, unlocked: true, color: "#8B572A", emoji: "🏾" },
  ],
  hairStyle: [
    { id: "short-dark", name: "Short Dark", price: 0, unlocked: true, color: "#333333", shape: "short", emoji: "💇" },
    {
      id: "long-brown",
      name: "Long Brown",
      price: 15,
      unlocked: false,
      color: "#8B4513",
      shape: "long",
      emoji: "💇‍♀️",
    },
    {
      id: "curly-blonde",
      name: "Curly Blonde",
      price: 20,
      unlocked: false,
      color: "#F5DEB3",
      shape: "curly",
      emoji: "🦱",
    },
    {
      id: "ponytail-black",
      name: "Ponytail Black",
      price: 18,
      unlocked: false,
      color: "#000000",
      shape: "ponytail",
      emoji: "👱‍♀️",
    },
  ],
  makeup: [
    { id: "none", name: "None", price: 0, unlocked: true, emoji: "✨" },
    { id: "light-blush", name: "Light Blush", price: 5, unlocked: false, emoji: "😊" },
    { id: "bold-lips", name: "Bold Lips", price: 8, unlocked: false, emoji: "💄" },
    { id: "smoky-eyes", name: "Smoky Eyes", price: 12, unlocked: false, emoji: "👁️" },
  ],
  tops: [
    { id: "business-shirt", name: "Business Shirt", price: 0, unlocked: true, color: "#ADD8E6", emoji: "👔" }, // Light Blue
    { id: "polo-shirt", name: "Polo Shirt", price: 10, unlocked: false, color: "#90EE90", emoji: "👕" }, // Light Green
    { id: "blazer", name: "Formal Blazer", price: 30, unlocked: false, color: "#4682B4", emoji: "🧥" }, // Steel Blue
    { id: "tshirt", name: "T-Shirt", price: 5, unlocked: false, color: "#F0F0F0", emoji: "👚" }, // Light Gray
    { id: "sweater", name: "Sweater", price: 15, unlocked: false, color: "#DDA0DD", emoji: "🧶" }, // Plum
  ],
  bottoms: [
    { id: "formal-pants", name: "Formal Pants", price: 0, unlocked: true, color: "#556B2F", emoji: "👖" }, // Olive Green
    { id: "jeans", name: "Smart Jeans", price: 12, unlocked: false, color: "#4682B4", emoji: "👖" }, // Steel Blue
    { id: "skirt", name: "Pencil Skirt", price: 15, unlocked: false, color: "#800000", emoji: "👗" }, // Maroon
    { id: "shorts", name: "Casual Shorts", price: 8, unlocked: false, color: "#A9A9A9", emoji: "🩳" }, // Dark Gray
  ],
  shoes: [
    { id: "dress-shoes", name: "Dress Shoes", price: 0, unlocked: true, color: "#8B4513", emoji: "👞" }, // Saddle Brown
    { id: "sneakers", name: "White Sneakers", price: 20, unlocked: false, color: "#FFFFFF", emoji: "👟" }, // White
    { id: "heels", name: "Heels", price: 18, unlocked: false, color: "#696969", emoji: "👠" }, // Dim Gray
    { id: "sandals", name: "Sandals", price: 10, unlocked: false, color: "#F4A460", emoji: "👡" }, // Sandy Brown
  ],
  accessories: [
    { id: "none", name: "None", price: 0, unlocked: true, emoji: "🚫" },
    { id: "glasses", name: "Glasses", price: 7, unlocked: false, emoji: "👓" },
    { id: "watch", name: "Watch", price: 10, unlocked: false, emoji: "⌚" },
    { id: "necklace", name: "Necklace", price: 15, unlocked: false, emoji: "💎" },
  ],
}

export const shopProducts: Record<string, ShopProduct[]> = {
  productivity: [
    {
      id: "premium-laptop",
      name: "Premium Laptop",
      price: 120,
      image: "laptop",
      description: "High-performance laptop for faster work completion",
      effects: { productivity: 15, experience: 0 },
      duration: "permanent",
      owned: false,
      emoji: "💻",
    },
    {
      id: "second-monitor",
      name: "Second Monitor",
      price: 35,
      image: "monitor",
      description: "Dual-screen setup for improved multitasking",
      effects: { productivity: 10, experience: 0 },
      duration: "permanent",
      owned: false,
      emoji: "🖥️",
    },
    {
      id: "productivity-app",
      name: "Productivity Suite",
      price: 12,
      image: "app",
      description: "Premium software for better task management",
      effects: { productivity: 8, experience: 0 },
      duration: "permanent",
      owned: false,
      emoji: "📊",
    },
    {
      id: "noise-cancelling",
      name: "Noise-Cancelling Headphones",
      price: 28,
      image: "headphones",
      description: "Block distractions and focus on your work",
      effects: { productivity: 12, burnout: -5 },
      duration: "permanent",
      owned: false,
      emoji: "🎧",
    },
  ],
  wellness: [
    {
      id: "ergonomic-chair",
      name: "Ergonomic Chair",
      price: 50,
      image: "chair",
      description: "Premium office chair for better posture and comfort",
      effects: { burnout: -15, energy: 5 },
      duration: "permanent",
      owned: false,
      emoji: "🪑",
    },
    {
      id: "standing-desk",
      name: "Standing Desk",
      price: 65,
      image: "desk",
      description: "Adjustable desk for sitting or standing work",
      effects: { burnout: -10, energy: 8 },
      duration: "permanent",
      owned: false,
      emoji: " desks",
    },
    {
      id: "wellness-subscription",
      name: "Wellness App Subscription",
      price: 8,
      image: "wellness",
      description: "Guided meditation and wellness exercises",
      effects: { burnout: -20, energy: 0 },
      duration: "permanent",
      owned: false,
      emoji: "🧘",
    },
    {
      id: "office-plant",
      name: "Office Plant Collection",
      price: 12,
      image: "plant",
      description: "Beautiful plants to improve your workspace",
      effects: { burnout: -8, productivity: 5 },
      duration: "permanent",
      owned: false,
      emoji: "🪴",
    },
  ],
  consumables: [
    {
      id: "premium-coffee",
      name: "Premium Coffee Subscription",
      price: 5,
      image: "coffee",
      description: "High-quality coffee delivered to the office",
      effects: { energy: 20, productivity: 5 },
      duration: "1 week",
      owned: false,
      emoji: "☕",
    },
    {
      id: "energy-drink",
      name: "Energy Drink Pack",
      price: 3,
      image: "energy",
      description: "Quick energy boost when you need it most",
      effects: { energy: 30, burnout: 10 },
      duration: "3 days",
      owned: false,
      emoji: "⚡",
    },
    {
      id: "healthy-snacks",
      name: "Healthy Snack Box",
      price: 4.5,
      image: "snacks",
      description: "Nutritious snacks to keep you going",
      effects: { energy: 15, burnout: -5 },
      duration: "1 week",
      owned: false,
      emoji: "🍎",
    },
    {
      id: "vitamin-pack",
      name: "Vitamin Supplement Pack",
      price: 3.5,
      image: "vitamins",
      description: "Daily vitamins for sustained energy",
      effects: { energy: 10, burnout: -8 },
      duration: "2 weeks",
      owned: false,
      emoji: "💊",
    },
  ],
  premium: [
    {
      id: "executive-package",
      name: "Executive Package",
      price: 200,
      image: "executive",
      description: "Complete premium office setup with all accessories",
      effects: { productivity: 25, burnout: -20, energy: 15 },
      duration: "permanent",
      owned: false,
      premium: true,
      emoji: "💼",
    },
    {
      id: "personal-assistant",
      name: "Virtual Assistant",
      price: 150,
      image: "assistant",
      description: "AI assistant to handle routine tasks",
      effects: { productivity: 30, experience: 10 },
      duration: "permanent",
      owned: false,
      premium: true,
      emoji: "🤖",
    },
    {
      id: "networking-pass",
      name: "Executive Networking Pass",
      price: 180,
      image: "networking",
      description: "Access to exclusive industry events and connections",
      effects: { experience: 50, productivity: 10 }, // Added missing effects object
      duration: "permanent",
      owned: false,
      premium: true,
      emoji: "🤝",
    },
    {
      id: "vip-status",
      name: "Shopee VIP Status",
      price: 300,
      image: "vip",
      description: "Premium company benefits and recognition",
      effects: { experience: 100, productivity: 20, burnout: -30 },
      duration: "permanent",
      owned: false,
      premium: true,
      requiresLevel: 5,
      emoji: "🌟",
    },
  ],
}

export const organizationChart: OrgNode[] = [
  { id: "ceo", name: "Olivia Chen", title: "CEO", emoji: "👑" },
  { id: "cto", name: "David Lee", title: "CTO", reportsTo: "ceo", emoji: "💻" },
  { id: "cfo", name: "Sarah Lim", title: "CFO", reportsTo: "ceo", emoji: "💰" },
  { id: "hrd", name: "Emily Wong", title: "HR Director", reportsTo: "ceo", emoji: "🤝" },
  { id: "eng-lead", name: "Michael Tan", title: "Engineering Lead", reportsTo: "cto", emoji: "⚙️" },
  { id: "data-lead", name: "Jessica Goh", title: "Data Science Lead", reportsTo: "cto", emoji: "📊" },
  { id: "fin-mgr", name: "Daniel Khoo", title: "Finance Manager", reportsTo: "cfo", emoji: "📈" },
  { id: "hr-mgr", name: "Chloe Lim", title: "HR Manager", reportsTo: "hrd", emoji: "🧑‍💼" },
  { id: "you", name: "You", title: "Associate", reportsTo: "eng-lead", emoji: "👤" }, // Player's initial position
]

export const randomEvents: RandomEvent[] = [
  {
    id: "coffee-spill",
    title: "Coffee Catastrophe!",
    description: "You accidentally spilled coffee all over your keyboard. What do you do?",
    emoji: "☕",
    options: [
      {
        text: "Clean it immediately (lose time, gain productivity)",
        emoji: "🧼",
        effects: { energy: -5, productivity: 10, burnout: -2, money: -5 },
      },
      {
        text: "Call IT support (lose money, no time lost)",
        emoji: "📞",
        effects: { money: -50, burnout: 5 },
      },
    ],
  },
  {
    id: "urgent-request",
    title: "Urgent Client Request!",
    description: "A high-priority client needs a report ASAP. It's almost quitting time.",
    emoji: "🚨",
    options: [
      {
        text: "Stay late to finish (gain productivity, burnout)",
        emoji: "🌙",
        effects: { productivity: 20, burnout: 15, energy: -10, experience: 10 },
      },
      {
        text: "Delegate to a colleague (lose productivity, gain money)",
        emoji: "🤝",
        effects: { productivity: -5, money: 20, burnout: -5 },
      },
    ],
  },
  {
    id: "office-gossip",
    title: "Office Gossip!",
    description: "You overhear some juicy office gossip. Do you get involved?",
    emoji: "🤫",
    options: [
      {
        text: "Join the conversation (lose productivity, gain energy)",
        emoji: "🗣️",
        effects: { productivity: -10, energy: 10, burnout: 5 },
      },
      {
        text: "Ignore and focus on work (gain productivity, lose energy)",
        emoji: "🧘",
        effects: { productivity: 5, energy: -2, burnout: -2 },
      },
    ],
  },
  {
    id: "free-food",
    title: "Free Food Alert!",
    description: "Someone brought in free snacks/pizza for the team. Do you grab some?",
    emoji: "🍕",
    options: [
      {
        text: "Indulge (gain energy, lose money)",
        emoji: "😋",
        effects: { energy: 15, money: -5 },
      },
      {
        text: "Stick to your diet (no change)",
        emoji: "🥗",
        effects: {},
      },
    ],
  },
  {
    id: "system-crash",
    title: "System Crash!",
    description: "Your computer suddenly freezes. All unsaved work is at risk!",
    emoji: "💥",
    options: [
      {
        text: "Force restart (risk data loss, quick fix)",
        emoji: "🔄",
        effects: { productivity: -15, burnout: 10 },
      },
      {
        text: "Wait for IT (lose time, no risk)",
        emoji: "⏳",
        effects: { energy: -5, burnout: 5 },
      },
    ],
  },
  {
    id: "new-hire",
    title: "New Hire Introduction!",
    description: "A new colleague joins your team. Do you introduce yourself?",
    emoji: "👋",
    options: [
      {
        text: "Welcome them warmly (gain experience, energy)",
        emoji: "😊",
        effects: { experience: 5, energy: 5 },
      },
      {
        text: "Stay focused on your tasks (no change)",
        emoji: "🤫",
        effects: {},
      },
    ],
  },
  {
    id: "mentor-opportunity",
    title: "Mentorship Opportunity!",
    description: "A senior leader offers to mentor you. Do you accept?",
    emoji: "🌟",
    options: [
      {
        text: "Accept (gain experience, productivity)",
        emoji: "📈",
        effects: { experience: 20, productivity: 10, burnout: -5 },
      },
      {
        text: "Decline (no change)",
        emoji: "🙅",
        effects: {},
      },
    ],
  },
  {
    id: "team-lunch-invite",
    title: "Team Lunch Invitation!",
    description: "Your team is going out for lunch. Join them?",
    emoji: "🍽️",
    options: [
      {
        text: "Join the team (gain energy, lose money)",
        emoji: "🥳",
        effects: { energy: 10, money: -15 },
      },
      {
        text: "Eat at your desk (save money, no social gain)",
        emoji: "💻",
        effects: { money: 5 },
      },
    ],
  },
  {
    id: "charity-drive",
    title: "Company Charity Drive!",
    description: "The company is organizing a charity drive. Will you contribute?",
    emoji: "❤️",
    options: [
      {
        text: "Donate money (lose money, gain mood)",
        emoji: "💸",
        effects: { money: -20, burnout: -10 },
      },
      {
        text: "Volunteer time (lose energy, gain experience)",
        emoji: "🤝",
        effects: { energy: -10, experience: 10 },
      },
    ],
  },
  {
    id: "power-outage",
    title: "Sudden Power Outage!",
    description: "The office lights flicker and go out. What's your move?",
    emoji: "💡",
    options: [
      {
        text: "Wait it out patiently (lose productivity, gain burnout)",
        emoji: "😩",
        effects: { productivity: -10, burnout: 5 },
      },
      {
        text: "Go home (lose productivity, gain energy)",
        emoji: "🏠",
        effects: { productivity: -5, energy: 15, burnout: -5 },
      },
    ],
  },
]

export const internalThoughts: InternalThought[] = [
  { id: "thought1", text: "Another Monday, another mountain of emails. 😩", emoji: "📧" },
  { id: "thought2", text: "Did I remember to mute myself on that last call? 🤔", emoji: "🔇" },
  { id: "thought3", text: "My coffee is cold. This is fine. Everything is fine. 🔥", emoji: "☕" },
  { id: "thought4", text: "Is it Friday yet? Asking for a friend... who is me. 🗓️", emoji: "📅" },
  { id: "thought5", text: "That meeting could have been an email. 🙄", emoji: "💬" },
  { id: "thought6", text: "My brain feels like a deflated balloon. 🎈", emoji: "🧠" },
  { id: "thought7", text: "Just 5 more minutes until lunch... 🤤", emoji: "⏰" },
  { id: "thought8", text: "I need a vacation from this vacation planning. ✈️", emoji: "🏝️" },
  { id: "thought9", text: "Why is the printer always out of ink when I need it? 😤", emoji: "🖨️" },
  { id: "thought10", text: "My productivity is peaking! Or maybe it's just the sugar rush. 🚀", emoji: "📈" },
  { id: "thought11", text: "I should probably stretch. Or just sit here longer. 🧘", emoji: "🛋️" },
  { id: "thought12", text: "The office air conditioning is either arctic or tropical. No in-between. 🥶", emoji: "🌬️" },
  {
    id: "thought13",
    text: "Is it acceptable to wear pajamas to a video call if only my top half shows? 🤔",
    emoji: "👚",
  },
  { id: "thought14", text: "My spirit animal is a sloth on a coffee break. ☕🦥", emoji: "😴" },
  { id: "thought15", text: "I'm pretty sure my desk plant is judging my life choices. 🪴", emoji: "👀" },
  { id: "thought16", text: "Just survived another 'quick chat' that lasted an hour. Send help.🆘", emoji: "😵" },
  { id: "thought17", text: "My brain is buffering. Please wait... 🔄", emoji: "⏳" },
  { id: "thought18", text: "I'm not procrastinating, I'm just giving my ideas time to marinate. 💡", emoji: "💭" },
  { id: "thought19", text: "If I stare at this spreadsheet any longer, it might start staring back. 📊", emoji: "👁️" },
  { id: "thought20", text: "My work-life balance is currently 90% work, 10% wondering what 'life' is. ⚖️", emoji: "🤷" },
]
