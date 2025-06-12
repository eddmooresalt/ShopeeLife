import { type GameState, TabType } from "@/types/game"

export const initialGameState: GameState = {
  gameTime: 9 * 60, // Start at 9:00 AM (in minutes from midnight)
  exp: 0,
  level: 1,
  shopeeCoins: 100, // Changed from 5000 dollars to 100 ShopeeCoins
  stats: {
    energy: 80,
    productivity: 70,
    burnout: 20, // Lower burnout is better
  },
  tasks: [
    {
      id: "task-1",
      name: "Review PRs",
      description: "Review pending pull requests from teammates.",
      emoji: "🔍", // Added emoji
      progress: 0,
      targetProgress: 100,
      rewardExp: 20,
      rewardCoins: 10,
      energyCost: 10,
      isCompleted: false,
    },
    {
      id: "task-2",
      name: "Write Documentation",
      description: "Update project documentation for new features.",
      emoji: "📝", // Added emoji
      progress: 0,
      targetProgress: 100,
      rewardExp: 30,
      rewardCoins: 15,
      energyCost: 15,
      isCompleted: false,
    },
    {
      id: "task-3",
      name: "Fix Bug in Production",
      description: "Address a critical bug reported by users.",
      emoji: "🐛", // Added emoji
      progress: 0,
      targetProgress: 100,
      rewardExp: 50,
      rewardCoins: 25,
      energyCost: 20,
      isCompleted: false,
    },
    {
      id: "task-4",
      name: "Attend Daily Standup",
      description: "Participate in the daily team standup meeting and pretend to listen.",
      emoji: "🗣️",
      progress: 0,
      targetProgress: 100,
      rewardExp: 15,
      rewardCoins: 8,
      energyCost: 5,
      isCompleted: false,
    },
    {
      id: "task-5",
      name: "Update Jira Tickets",
      description: "Move tickets from 'In Progress' to 'Done' and feel accomplished.",
      emoji: "🎫",
      progress: 0,
      targetProgress: 100,
      rewardExp: 25,
      rewardCoins: 12,
      energyCost: 8,
      isCompleted: false,
    },
    {
      id: "task-6",
      name: "Pretend to Read Emails",
      description: "Open your inbox, mark everything as read, and hope nothing was important.",
      emoji: "📧",
      progress: 0,
      targetProgress: 100,
      rewardExp: 10,
      rewardCoins: 5,
      energyCost: 3,
      isCompleted: false,
    },
    {
      id: "task-7",
      name: "Optimize Database Queries",
      description: "Make the database go brrr faster (or at least try to).",
      emoji: "🗄️",
      progress: 0,
      targetProgress: 100,
      rewardExp: 40,
      rewardCoins: 20,
      energyCost: 18,
      isCompleted: false,
    },
    {
      id: "task-8",
      name: "Slack Procrastination",
      description: "Spend 30 minutes reading random channels and reacting with emojis.",
      emoji: "💬",
      progress: 0,
      targetProgress: 100,
      rewardExp: 5,
      rewardCoins: 3,
      energyCost: 2,
      isCompleted: false,
    },
    {
      id: "task-9",
      name: "Refactor Legacy Code",
      description: "Touch the ancient code and pray it doesn't break everything.",
      emoji: "🏗️",
      progress: 0,
      targetProgress: 100,
      rewardExp: 60,
      rewardCoins: 30,
      energyCost: 25,
      isCompleted: false,
    },
    {
      id: "task-10",
      name: "Coffee Break Research",
      description: "Conduct important research on the optimal coffee-to-productivity ratio.",
      emoji: "☕",
      progress: 0,
      targetProgress: 100,
      rewardExp: 8,
      rewardCoins: 4,
      energyCost: 1,
      isCompleted: false,
    },
    {
      id: "task-11",
      name: "Rubber Duck Debugging",
      description: "Explain your code to a rubber duck and have an existential crisis.",
      emoji: "🦆",
      progress: 0,
      targetProgress: 100,
      rewardExp: 35,
      rewardCoins: 18,
      energyCost: 12,
      isCompleted: false,
    },
    {
      id: "task-12",
      name: "Meeting About Meetings",
      description: "Attend a meeting to discuss why we have so many meetings.",
      emoji: "🤝",
      progress: 0,
      targetProgress: 100,
      rewardExp: 12,
      rewardCoins: 6,
      energyCost: 15,
      isCompleted: false,
    },
  ],
  lunchLocations: [
    { id: "canteen", name: "Office Canteen", emoji: "🍜" },
    { id: "kopitiam", name: "Nearby Kopitiam", emoji: "☕" },
    { id: "cafe", name: "Trendy Cafe", emoji: "🥪" },
    { id: "food-court", name: "Food Court", emoji: "🍱" },
    { id: "restaurant", name: "Fine Dining", emoji: "🍽️" },
    { id: "delivery", name: "Food Delivery", emoji: "🚚" },
  ],
  lunchItems: [
    { id: "chicken-rice", name: "Hainanese Chicken Rice", emoji: "🍚", price: 8, energyGain: 35 },
    { id: "laksa", name: "Spicy Laksa", emoji: "🌶️", price: 10, energyGain: 40 },
    { id: "sandwich", name: "Club Sandwich", emoji: "🥪", price: 12, energyGain: 30 },
    { id: "salad", name: "Caesar Salad", emoji: "🥗", price: 15, energyGain: 25 },
    { id: "nasi-lemak", name: "Nasi Lemak", emoji: "🍛", price: 7, energyGain: 38 },
    { id: "ramen", name: "Tonkotsu Ramen", emoji: "🍜", price: 18, energyGain: 45 },
    { id: "burger", name: "Gourmet Burger", emoji: "🍔", price: 20, energyGain: 42 },
    { id: "sushi", name: "Sushi Set", emoji: "🍣", price: 25, energyGain: 35 },
    { id: "pasta", name: "Carbonara Pasta", emoji: "🍝", price: 16, energyGain: 40 },
    { id: "pizza", name: "Margherita Pizza", emoji: "🍕", price: 22, energyGain: 38 },
    { id: "pho", name: "Vietnamese Pho", emoji: "🍲", price: 14, energyGain: 42 },
    { id: "dim-sum", name: "Dim Sum Platter", emoji: "🥟", price: 20, energyGain: 36 },
    { id: "bibimbap", name: "Korean Bibimbap", emoji: "🍚", price: 17, energyGain: 39 },
    { id: "pad-thai", name: "Pad Thai", emoji: "🍜", price: 13, energyGain: 37 },
    { id: "fish-chips", name: "Fish & Chips", emoji: "🐟", price: 19, energyGain: 41 },
  ],
  shopItems: [
    {
      id: "coffee",
      name: "Premium Coffee",
      description:
        "Artisanal single-origin coffee that makes you feel sophisticated while destroying your sleep schedule.",
      emoji: "☕",
      price: 30,
      type: "consumable",
      effect: { productivity: 20, burnout: 5 },
      isBought: false,
    },
    {
      id: "energy-drink",
      name: "Quantum Energy Drink",
      description: "Liquid motivation in a can. Side effects may include temporary superpowers and jittery hands.",
      emoji: "⚡",
      price: 40,
      type: "consumable",
      effect: { energy: 30, burnout: 10 },
      isBought: false,
    },
    {
      id: "new-keyboard",
      name: "RGB Mechanical Keyboard",
      description: "Because nothing says 'professional developer' like rainbow lights that can be seen from space.",
      emoji: "⌨️",
      price: 150,
      type: "equipment",
      effect: { workEfficiency: 0.1, productivity: 10 },
      isBought: false,
    },
    {
      id: "shopee-hoodie",
      name: "Limited Edition Shopee Hoodie",
      description: "Show your corporate loyalty while staying cozy. Comes with built-in imposter syndrome protection.",
      emoji: "🍊",
      price: 80,
      type: "wardrobe",
      effect: { burnout: -5 },
      isBought: false,
    },
    {
      id: "stress-ball",
      name: "Anti-Stress Quantum Ball",
      description: "Squeeze away your existential dread and meeting anxiety. Warning: May become sentient.",
      emoji: "🥎",
      price: 20,
      type: "consumable",
      effect: { burnout: -15 },
      isBought: false,
    },
    {
      id: "gaming-chair",
      name: "CEO Gaming Chair",
      description: "Ergonomic throne for digital warriors. Includes built-in lumbar support and ego boost.",
      emoji: "🪑",
      price: 250,
      type: "equipment",
      effect: { productivity: 25, burnout: -10, workEfficiency: 0.15 },
      isBought: false,
    },
    {
      id: "noise-cancelling",
      name: "Noise-Cancelling Headphones",
      description: "Block out your colleagues' questionable music choices and existential complaints.",
      emoji: "🎧",
      price: 180,
      type: "equipment",
      effect: { productivity: 20, burnout: -8 },
      isBought: false,
    },
    {
      id: "plant",
      name: "Desk Succulent",
      description: "A low-maintenance friend that won't judge your life choices. Photosynthesis included.",
      emoji: "🌱",
      price: 25,
      type: "equipment",
      effect: { burnout: -12, energy: 5 },
      isBought: false,
    },
    {
      id: "lucky-charm",
      name: "Programmer's Lucky Rubber Duck",
      description: "Blessed by the coding gods. Guaranteed to help you find bugs or your money back.",
      emoji: "🦆",
      price: 35,
      type: "equipment",
      effect: { productivity: 15, exp: 5 },
      isBought: false,
    },
    {
      id: "snack-box",
      name: "Emergency Snack Stash",
      description:
        "For when the vending machine breaks and civilization crumbles. Contains 47 different types of caffeine.",
      emoji: "🍿",
      price: 45,
      type: "consumable",
      effect: { energy: 25, burnout: -5 },
      isBought: false,
    },
    {
      id: "motivational-poster",
      name: "Inspirational Cat Poster",
      description: "Hang in there! This cat has been hanging since 1972 and still believes in you.",
      emoji: "🖼️",
      price: 15,
      type: "equipment",
      effect: { burnout: -8, productivity: 5 },
      isBought: false,
    },
    {
      id: "premium-tea",
      name: "Zen Master Tea Collection",
      description: "Ancient wisdom in liquid form. May cause sudden urges to meditate and speak in haikus.",
      emoji: "🍵",
      price: 55,
      type: "consumable",
      effect: { burnout: -20, energy: 15 },
      isBought: false,
    },
  ],
  wardrobe: [], // IDs of owned wardrobe items
  hasEatenLunch: false,
  lunchItemEatenId: null,
  seaTalkMessages: [
    {
      id: "msg-001",
      sender: "HR_Bot",
      content: "Welcome to ShopeeLife! Your journey begins now. Complete tasks to earn EXP and ShopeeCoins!",
      timestamp: 9 * 60,
    },
    {
      id: "msg-002",
      sender: "TeamLead_Alex",
      content: "Morning team! Don't forget to check the new project brief in Confluence.",
      timestamp: 9 * 60 + 5,
    },
  ],
  lastQuestResetDay: Math.floor((9 * 60) / (60 * 24)), // Initialize to current day
  dailyQuests: [], // Will be populated on first load/new day
  hasClaimedDailyBonus: false,
  hasShownLunchReminder: false,
  currentWeather: { type: "Sunny", description: "Sunny" }, // Initial weather
}

// Initialize daily quests for the initial game state
const currentDay = Math.floor(initialGameState.gameTime / (60 * 24))
// We'll set this after gameData is defined to avoid circular dependency

export const gameData = {
  tasks: initialGameState.tasks,
  lunchLocations: initialGameState.lunchLocations,
  lunchItems: initialGameState.lunchItems,
  shopItems: initialGameState.shopItems,
  bottomNavigationTabs: [
    { id: TabType.Office, name: "Office", icon: "🏢" },
    { id: TabType.Tasks, name: "Tasks", icon: "✅" },
    { id: TabType.Lunch, name: "Lunch", icon: "🍔" },
    { id: TabType.Shop, name: "Shop", icon: "🛒" },
    { id: TabType.Character, name: "Character", icon: "👤" },
    { id: TabType.SeaTalk, name: "SeaTalk", icon: "💬" },
    { id: TabType.Navigate, name: "Navigate", icon: "🗺️" },
    { id: TabType.Portal, name: "Portal", icon: "🌐" }, // Added Portal tab
  ],
  locations: [
    {
      id: "office",
      name: "Your Desk",
      emoji: "🖥️",
      description: "Your personal workspace where productivity meets procrastination",
      tabType: TabType.Office,
    },
    {
      id: "meeting-room",
      name: "Meeting Room",
      emoji: "🤝",
      description: "Where great ideas are born... or where time goes to die",
      tabType: TabType.Office,
    },
    {
      id: "pantry",
      name: "Pantry",
      emoji: "☕",
      description: "The social hub where coffee meets conversation",
      tabType: TabType.Shop,
    },
    {
      id: "gym",
      name: "Office Gym",
      emoji: "💪",
      description: "Sweat out the stress and pump up the productivity",
      tabType: TabType.Character,
    },
    {
      id: "rooftop-garden",
      name: "Rooftop Garden",
      emoji: "🌳",
      description: "A zen oasis above the corporate chaos",
      tabType: TabType.Office,
    },
    {
      id: "hr-portal",
      name: "HR Portal",
      emoji: "📄",
      description: "For all your human resources needs and bureaucratic adventures",
      tabType: TabType.Portal,
    },
    {
      id: "it-helpdesk",
      name: "IT Helpdesk",
      emoji: "💻",
      description: "When technology fails you, they've got your back",
      tabType: TabType.Portal,
    },
  ],
  randomEvents: [
    {
      id: "event-1",
      title: "The Great Coffee Machine Rebellion",
      description:
        "The office coffee machine has achieved sentience and is now demanding better working conditions. It's holding your morning caffeine hostage and has started a union with the printer. What's your negotiation strategy?",
      choices: [
        {
          id: "choice-1a",
          text: "Offer the coffee machine a promotion to 'Chief Beverage Officer'",
          result:
            "The coffee machine accepted the promotion and now wears a tiny tie! It's brewing premium coffee and sending motivational emails.",
          effect: { energy: 25, productivity: 15, exp: 20 },
        },
        {
          id: "choice-1b",
          text: "Start a counter-revolution with the tea kettle",
          result:
            "The tea kettle rallied the kitchen appliances! You've started an appliance civil war, but at least you have tea.",
          effect: { social: 20, exp: 25, burnout: -10, shopeeCoins: -5 },
        },
      ],
    },
    {
      id: "event-2",
      title: "The Mysterious Case of the Vanishing Lunch",
      description:
        "Your carefully crafted artisanal sandwich has disappeared from the office fridge. Security footage shows only a shadowy figure with suspicious crumb patterns. Justice must be served!",
      choices: [
        {
          id: "choice-2a",
          text: "Become the office lunch detective and solve this culinary crime",
          result:
            "After thorough investigation, you discovered it was the cleaning robot. It now demands a lunch allowance.",
          effect: { exp: 30, social: 15, productivity: -5, shopeeCoins: 10 },
        },
        {
          id: "choice-2b",
          text: "Start an underground lunch protection service",
          result:
            "You've created 'Lunch Guard Inc.' - a sophisticated network protecting people's sandwiches for profit.",
          effect: { shopeeCoins: 25, social: 20, exp: 20, energy: -5 },
        },
      ],
    },
    {
      id: "event-3",
      title: "The Great Printer Uprising",
      description:
        "The office printer has achieved consciousness and refuses to print anything except memes and passive-aggressive error messages. It's formed an alliance with the scanner.",
      choices: [
        {
          id: "choice-3a",
          text: "Negotiate a peace treaty with the printer union",
          result:
            "Success! The printer now prints perfectly but insists on adding tiny smiley faces to every document.",
          effect: { productivity: 25, exp: 25, social: 15, shopeeCoins: 15 },
        },
        {
          id: "choice-3b",
          text: "Go completely paperless and embrace the digital revolution",
          result:
            "You've dragged the office into the digital age! The printer plots revenge, but you're now the Chief Digital Officer.",
          effect: { productivity: 30, exp: 35, burnout: -5, energy: 10 },
        },
      ],
    },
    {
      id: "event-4",
      title: "The Elevator Music Incident",
      description:
        "Someone has hacked the elevator music system to play death metal at maximum volume. People are either terrified or surprisingly energized. The elevator is now a mosh pit.",
      choices: [
        {
          id: "choice-4a",
          text: "Embrace the chaos and start an office metal band",
          result:
            "Your band 'Deadline Destruction' is now the talk of the office! You're playing at the company party.",
          effect: { social: 30, exp: 25, energy: 20, burnout: -15 },
        },
        {
          id: "choice-4b",
          text: "Restore peaceful elevator ambiance",
          result:
            "You've restored zen to vertical transportation. Colleagues thank you, but some miss the adrenaline rush.",
          effect: { burnout: -20, productivity: 15, exp: 15, social: 10 },
        },
      ],
    },
    {
      id: "event-5",
      title: "The Great Wi-Fi Outage",
      description:
        "The internet has gone down company-wide. Panic spreads as people realize they don't remember how to work without memes and cat videos. Productivity paradoxically increases.",
      choices: [
        {
          id: "choice-5a",
          text: "Organize analog team-building activities",
          result: "You've rediscovered the lost art of face-to-face conversation! Team bonding reaches new heights.",
          effect: { social: 35, exp: 20, burnout: -10, productivity: 10 },
        },
        {
          id: "choice-5b",
          text: "Become the office IT hero and fix the internet",
          result: "You've saved the day! Everyone treats you like a digital messiah. Your IT skills are now legendary.",
          effect: { exp: 40, shopeeCoins: 30, productivity: 20, social: 15 },
        },
      ],
    },
    {
      id: "event-6",
      title: "The Mysterious Office Plant Takeover",
      description:
        "The office plants have grown suspiciously large overnight. The ficus in accounting is now taller than the CEO. Some suspect the new 'organic fertilizer' was actually radioactive.",
      choices: [
        {
          id: "choice-6a",
          text: "Become the office botanist and study the phenomenon",
          result:
            "You've discovered the plants are actually improving air quality dramatically! You're now the Plant Whisperer.",
          effect: { energy: 25, burnout: -15, exp: 30, productivity: 10 },
        },
        {
          id: "choice-6b",
          text: "Start a jungle-themed office makeover",
          result:
            "The office is now a tropical paradise! Productivity is up, and people are happier in their green workspace.",
          effect: { social: 25, burnout: -20, exp: 20, energy: 15 },
        },
      ],
    },
    {
      id: "event-7",
      title: "The Zoom Meeting Disaster",
      description:
        "During an important client presentation, your cat has decided to perform interpretive dance across your keyboard while your neighbor starts construction work. The client seems oddly entertained.",
      choices: [
        {
          id: "choice-7a",
          text: "Incorporate the chaos into your presentation",
          result:
            "Your 'authentic work-from-home experience' presentation goes viral! The client loves your honesty and signs immediately.",
          effect: { exp: 35, shopeeCoins: 40, social: 20, productivity: 15 },
        },
        {
          id: "choice-7b",
          text: "Apologize profusely and reschedule",
          result:
            "Your humility impresses the client. They appreciate your professionalism and give you a second chance.",
          effect: { social: 15, exp: 20, burnout: -10, productivity: 10 },
        },
      ],
    },
    {
      id: "event-8",
      title: "The Office Thermostat Wars",
      description:
        "The eternal battle over office temperature has escalated. Team Hot has barricaded themselves near the heater, while Team Cold has claimed the air conditioning vents. Switzerland remains neutral.",
      choices: [
        {
          id: "choice-8a",
          text: "Mediate a peace treaty between the temperature factions",
          result:
            "You've brokered the Great Temperature Accord! Zones are established, and peace reigns. You're now the Climate Ambassador.",
          effect: { social: 30, exp: 25, burnout: -10, productivity: 15 },
        },
        {
          id: "choice-8b",
          text: "Suggest everyone wear layers and call it 'adaptive fashion'",
          result:
            "Your diplomatic solution works! The office now looks like a fashion show, and everyone's happy with their personal climate control.",
          effect: { social: 20, exp: 15, energy: 10, burnout: -5 },
        },
      ],
    },
    {
      id: "event-9",
      title: "The Mysterious Food Truck Invasion",
      description:
        "Seven gourmet food trucks have surrounded the building. No one knows who called them, but the aroma is intoxicating. Productivity has dropped to zero as everyone stares longingly out the windows.",
      choices: [
        {
          id: "choice-9a",
          text: "Organize an impromptu office food festival",
          result:
            "You've created the best office event ever! Morale skyrockets, and the CEO declares it an annual tradition.",
          effect: { social: 40, energy: 30, exp: 25, burnout: -20 },
        },
        {
          id: "choice-9b",
          text: "Negotiate group discounts for the entire office",
          result:
            "Your business acumen saves everyone money! You're now the unofficial Office Food Coordinator with special privileges.",
          effect: { shopeeCoins: 35, social: 25, exp: 20, productivity: 10 },
        },
      ],
    },
    {
      id: "event-10",
      title: "The Great Stapler Shortage",
      description:
        "All staplers in the office have mysteriously vanished. Papers are flying everywhere, and people are resorting to paperclips and hope. The supply closet is under investigation.",
      choices: [
        {
          id: "choice-10a",
          text: "Start a black market stapler trading operation",
          result:
            "You've cornered the stapler market! Your underground economy is thriving, and you're the Stapler Kingpin.",
          effect: { shopeeCoins: 50, exp: 30, social: 15, productivity: -5 },
        },
        {
          id: "choice-10b",
          text: "Invent creative paperless solutions",
          result:
            "Your innovative digital workflow eliminates the need for staplers entirely! You're now the Process Innovation Champion.",
          effect: { productivity: 35, exp: 40, burnout: -10, energy: 15 },
        },
      ],
    },
    {
      id: "event-11",
      title: "The Office Pet Adoption Crisis",
      description:
        "Someone brought their 'emotional support peacock' to work, and now everyone wants to bring their pets. The office is becoming a zoo, literally. HR is having an existential crisis.",
      choices: [
        {
          id: "choice-11a",
          text: "Establish official office pet policies and pet-friendly zones",
          result:
            "You've created the most progressive pet policy in corporate history! The office is now a model for work-life balance.",
          effect: { social: 35, burnout: -25, exp: 30, energy: 20 },
        },
        {
          id: "choice-11b",
          text: "Suggest virtual pets for everyone instead",
          result:
            "Your compromise works! Everyone gets a Tamagotchi, and productivity actually increases. You're the Digital Pet Pioneer.",
          effect: { productivity: 20, exp: 25, social: 15, burnout: -10 },
        },
      ],
    },
    {
      id: "event-12",
      title: "The Mysterious Monday Morning Energy",
      description:
        "Everyone came to work unusually energetic and motivated on a Monday. Scientists are baffled. Some suspect alien intervention, others blame the new energy drinks in the vending machine.",
      choices: [
        {
          id: "choice-12a",
          text: "Harness this energy for a massive productivity sprint",
          result:
            "You've organized the most productive day in company history! Projects are completed, goals are exceeded, and legends are born.",
          effect: { productivity: 50, exp: 45, shopeeCoins: 40, energy: 25 },
        },
        {
          id: "choice-12b",
          text: "Investigate the source of this mysterious motivation",
          result:
            "You've discovered it was the janitor's new motivational posters! You're now the Chief Morale Officer with poster privileges.",
          effect: { exp: 35, social: 30, burnout: -15, productivity: 20 },
        },
      ],
    },
    {
      id: "event-13",
      title: "The Great Keyboard Rebellion",
      description:
        "All keyboards in the office have started autocorrecting everything to food-related words. 'Meeting' becomes 'Meatball', 'Report' becomes 'Ravioli'. Communication has become deliciously confusing.",
      choices: [
        {
          id: "choice-13a",
          text: "Embrace the food language and create a new office dialect",
          result:
            "You've invented 'Foodspeak'! The office communication is now 50% more entertaining, and team bonding has improved dramatically.",
          effect: { social: 30, exp: 25, burnout: -15, energy: 10 },
        },
        {
          id: "choice-13b",
          text: "Become the office tech support hero and fix all keyboards",
          result:
            "Your technical prowess saves the day! You're now the unofficial IT department, and everyone owes you lunch.",
          effect: { exp: 40, productivity: 25, shopeeCoins: 30, social: 20 },
        },
      ],
    },
    {
      id: "event-14",
      title: "The Office Time Warp",
      description:
        "The office clocks are all showing different times, ranging from 1987 to 2087. No one knows what time it actually is, but somehow everyone is more relaxed about deadlines.",
      choices: [
        {
          id: "choice-14a",
          text: "Declare the office a 'time-free zone' and work by energy levels",
          result:
            "Your revolutionary time management approach works! Productivity increases when people work according to their natural rhythms.",
          effect: { productivity: 30, burnout: -20, exp: 35, energy: 25 },
        },
        {
          id: "choice-14b",
          text: "Become the office timekeeper and synchronize everything",
          result:
            "You've restored temporal order! Your organizational skills are legendary, and you're now the Master of Time.",
          effect: { productivity: 25, exp: 30, social: 15, shopeeCoins: 20 },
        },
      ],
    },
    {
      id: "event-15",
      title: "The Great Snack Heist",
      description:
        "Someone has been systematically stealing snacks from the office kitchen. The trail of crumbs leads everywhere and nowhere. A snack vigilante group has formed to catch the culprit.",
      choices: [
        {
          id: "choice-15a",
          text: "Join the snack vigilante group and solve the mystery",
          result:
            "You've caught the snack thief! It was the office mascot costume that gained sentience. You're now the Snack Sheriff.",
          effect: { social: 25, exp: 30, energy: 15, shopeeCoins: 25 },
        },
        {
          id: "choice-15b",
          text: "Establish a communal snack sharing system",
          result:
            "Your diplomatic solution ends the snack wars! The office now has a thriving snack economy, and you're the Snack Ambassador.",
          effect: { social: 35, burnout: -15, exp: 20, energy: 20 },
        },
      ],
    },
  ],
  seaTalkMessages: [
    {
      sender: "HR_Bot",
      content: "Reminder: Submit your Q2 performance review by end of day!",
      timestampOffset: 10,
      tone: "professional",
    },
    {
      sender: "TeamLead_Alex",
      content: "Anyone seen my orange stapler? It's gone missing again...",
      timestampOffset: 15,
      tone: "jovial",
    },
    {
      sender: "Dev_Sarah",
      content: "Just deployed the new feature! Fingers crossed it doesn't break anything 🤞",
      timestampOffset: 20,
      tone: "anxious",
    },
    {
      sender: "Marketing_Ben",
      content: "Is it Friday yet? Asking for a friend... who is me.",
      timestampOffset: 25,
      tone: "sarcastic",
    },
    {
      sender: "Intern_Chloe",
      content: "Feeling a bit overwhelmed with all these new tools. Any tips?",
      timestampOffset: 30,
      tone: "sad",
    },
    {
      sender: "HR_Bot",
      content: "Don't forget to claim your ShopeeCoins from the daily login bonus!",
      timestampOffset: 35,
      tone: "professional",
    },
    {
      sender: "TeamLead_Alex",
      content: "Great work on the recent sprint, team! Keep up the momentum!",
      timestampOffset: 40,
      tone: "professional",
    },
    {
      sender: "Dev_Sarah",
      content: "Ugh, another bug report. My life is just fixing my own mistakes.",
      timestampOffset: 45,
      tone: "angry",
    },
    {
      sender: "Marketing_Ben",
      content: "Just saw a cat walk across someone's screen during a meeting. Best meeting ever.",
      timestampOffset: 50,
      tone: "jovial",
    },
    {
      sender: "Intern_Chloe",
      content: "Anyone want to grab bubble tea later? My treat!",
      timestampOffset: 55,
      tone: "casual",
    },
    {
      sender: "HR_Bot",
      content: "Your well-being is important! Remember to take short breaks.",
      timestampOffset: 60,
      tone: "professional",
    },
    {
      sender: "TeamLead_Alex",
      content: "I'm starting to think my coffee machine is sentient and judging my life choices.",
      timestampOffset: 65,
      tone: "sarcastic",
    },
    {
      sender: "Dev_Sarah",
      content: "Why does my code only work on my machine? The universe conspires against me.",
      timestampOffset: 70,
      tone: "anxious",
    },
    {
      sender: "Marketing_Ben",
      content: "Just crushed my daily steps goal. Who needs a treadmill when you have office errands?",
      timestampOffset: 75,
      tone: "jovial",
    },
    {
      sender: "Intern_Chloe",
      content: "This project is actually pretty cool. Learning so much!",
      timestampOffset: 80,
      tone: "happy",
    },
    {
      sender: "HR_Bot",
      content: "Don't forget to update your emergency contact information.",
      timestampOffset: 85,
      tone: "professional",
    },
    {
      sender: "TeamLead_Alex",
      content: "My cat just deleted half my code. Send help (and treats).",
      timestampOffset: 90,
      tone: "jovial",
    },
    {
      sender: "Dev_Sarah",
      content: "Is it just me, or is the office air conditioning set to 'arctic blast' today?",
      timestampOffset: 95,
      tone: "sarcastic",
    },
    {
      sender: "Marketing_Ben",
      content: "Just had a breakthrough on the next campaign! Prepare to be amazed.",
      timestampOffset: 100,
      tone: "jovial",
    },
    {
      sender: "Intern_Chloe",
      content: "Anyone else feeling sleepy after lunch? 😴",
      timestampOffset: 105,
      tone: "casual",
    },
  ],
}

// Daily quests will be initialized in the main app component to avoid circular dependency
