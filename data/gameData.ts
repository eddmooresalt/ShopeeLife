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
      name: "Coffee",
      description: "Boosts productivity but increases burnout.",
      emoji: "☕",
      price: 30,
      type: "consumable",
      effect: { productivity: 20, burnout: 5 },
      isBought: false,
    },
    {
      id: "energy-drink",
      name: "Energy Drink",
      description: "Restores energy but increases burnout.",
      emoji: "⚡",
      price: 40,
      type: "consumable",
      effect: { energy: 30, burnout: 10 },
      isBought: false,
    },
    {
      id: "new-keyboard",
      name: "Mechanical Keyboard",
      description: "Increases work efficiency and productivity.",
      emoji: "⌨️",
      price: 150,
      type: "equipment",
      effect: { workEfficiency: 0.1, productivity: 10 },
      isBought: false,
    },
    {
      id: "shopee-hoodie",
      name: "Shopee Hoodie",
      description: "Show your Shopee spirit! Reduces burnout.",
      emoji: "🍊",
      price: 80,
      type: "wardrobe",
      effect: { burnout: -5 },
      isBought: false,
    },
    {
      id: "stress-ball",
      name: "Stress Ball",
      description: "Helps manage burnout and stress.",
      emoji: "🥎",
      price: 20,
      type: "consumable",
      effect: { burnout: -15 },
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
        "The office coffee machine has started making suspicious gurgling noises and dispensing what can only be described as 'brown liquid of questionable origin.' What's your survival strategy?",
      choices: [
        {
          id: "choice-1a",
          text: "Brave the mystery brew anyway (YOLO)",
          result:
            "You took a sip and... it's actually not bad! Your taste buds have evolved. You've gained the superpower of drinking anything caffeinated.",
          effect: { energy: 25, productivity: 10, exp: 15 },
        },
        {
          id: "choice-1b",
          text: "Start a coffee fund for a new machine",
          result:
            "You rallied the troops! Everyone chipped in and now you have a fancy new machine. You're the office hero... until someone breaks it again.",
          effect: { social: 20, exp: 20, shopeeCoins: -10 },
        },
        {
          id: "choice-1c",
          text: "Switch to tea like a civilized person",
          result:
            "You've discovered the zen of tea drinking. Your colleagues look at you with a mix of respect and confusion. Inner peace achieved.",
          effect: { burnout: -15, productivity: 5, exp: 10 },
        },
      ],
    },
    {
      id: "event-2",
      title: "The Mysterious Case of the Disappearing Lunch",
      description:
        "Your carefully labeled lunch has vanished from the office fridge. Security footage shows only a shadowy figure with suspicious sandwich-eating motives. How do you handle this culinary crime?",
      choices: [
        {
          id: "choice-2a",
          text: "Launch a full CSI investigation",
          result:
            "After interrogating half the office and analyzing crumb patterns, you discovered it was the cleaning lady's first day and she thought it was abandoned. Mystery solved!",
          effect: { exp: 25, social: 10, productivity: -5 },
        },
        {
          id: "choice-2b",
          text: "Post passive-aggressive notes everywhere",
          result:
            "Your notes have become legendary office memes. People are now afraid to even look at the fridge. Mission accomplished... sort of.",
          effect: { social: -5, burnout: 10, exp: 5 },
        },
        {
          id: "choice-2c",
          text: "Order takeout and move on with life",
          result:
            "You discovered an amazing new restaurant! Sometimes the best things come from the worst situations. Plus, you avoided office drama.",
          effect: { energy: 20, burnout: -10, shopeeCoins: -15 },
        },
      ],
    },
    {
      id: "event-3",
      title: "The Printer Uprising",
      description:
        "The office printer has achieved sentience and is now refusing to print anything except cat memes and error messages. It's holding your important documents hostage. What's your negotiation strategy?",
      choices: [
        {
          id: "choice-3a",
          text: "Offer it a sacrifice of toner cartridges",
          result:
            "The printer accepted your offering! It's now printing everything perfectly... but only cat-themed documents. Your reports now have tiny paw prints in the margins.",
          effect: { productivity: 15, exp: 20, social: 10 },
        },
        {
          id: "choice-3b",
          text: "Try turning it off and on again (classic)",
          result:
            "IT magic works! The printer is back to normal, but now it occasionally prints 'THANK YOU FOR REBOOTING ME' at the bottom of pages. At least it's polite.",
          effect: { productivity: 10, exp: 15 },
        },
        {
          id: "choice-3c",
          text: "Embrace the digital age and go paperless",
          result:
            "You've revolutionized the office workflow! Everyone's impressed by your forward-thinking approach. The printer sits in the corner, plotting its revenge.",
          effect: { productivity: 20, exp: 30, burnout: -5 },
        },
      ],
    },
    {
      id: "event-4",
      title: "The Great Air Conditioning War",
      description:
        "The office has split into two factions: Team Arctic (who want it colder) and Team Sahara (who are already wearing winter coats indoors). You hold the remote. Choose your allegiance wisely.",
      choices: [
        {
          id: "choice-4a",
          text: "Join Team Arctic - embrace the freeze",
          result:
            "You've created a winter wonderland! Productivity is up because everyone's too cold to be lazy. You're now known as the Ice Queen/King of the office.",
          effect: { productivity: 15, social: -5, burnout: -10 },
        },
        {
          id: "choice-4b",
          text: "Side with Team Sahara - bring the heat",
          result:
            "The office is now a tropical paradise! Everyone's relaxed and happy, but also slightly drowsy. You've achieved peak comfort at the cost of alertness.",
          effect: { burnout: -15, energy: -5, social: 10 },
        },
        {
          id: "choice-4c",
          text: "Propose a democratic temperature vote",
          result:
            "You've established the Office Temperature Council! Democracy prevails, though the debates are more heated than the actual temperature discussions.",
          effect: { social: 20, exp: 25, productivity: 5 },
        },
      ],
    },
    {
      id: "event-5",
      title: "The Elevator Karaoke Incident",
      description:
        "You're stuck in the elevator with your boss and the elevator music is so catchy that someone started singing along. Now everyone's looking at each other awkwardly. The tension is palpable.",
      choices: [
        {
          id: "choice-5a",
          text: "Join in and turn it into a full concert",
          result:
            "You've started the first-ever Elevator Idol competition! Your boss was so impressed by your confidence that you got a special mention in the next team meeting.",
          effect: { social: 25, exp: 20, productivity: 5 },
        },
        {
          id: "choice-5b",
          text: "Pretend to check your phone intensely",
          result:
            "You successfully avoided the awkwardness, but missed out on what became legendary office folklore. Sometimes playing it safe means missing the fun.",
          effect: { burnout: 5, social: -5 },
        },
        {
          id: "choice-5c",
          text: "Start beatboxing to provide backup",
          result:
            "Your beatboxing skills were surprisingly good! The elevator ride became an impromptu music video. You're now the office's official hype person.",
          effect: { social: 30, exp: 25, energy: 10 },
        },
      ],
    },
    {
      id: "event-6",
      title: "The Mysterious Office Plant Whisperer",
      description:
        "Someone has been leaving encouraging notes for the office plants, and they're thriving like never before. You've been elected to investigate this botanical mystery. The plants seem to be watching you...",
      choices: [
        {
          id: "choice-6a",
          text: "Set up a plant surveillance operation",
          result:
            "You caught the culprit! It was the janitor who's been talking to plants for 20 years. He's now the official Office Plant Therapist and morale has never been higher.",
          effect: { exp: 30, social: 15, burnout: -10 },
        },
        {
          id: "choice-6b",
          text: "Start leaving your own plant notes",
          result:
            "You've joined the secret plant appreciation society! The office greenery is now so lush it's like working in a jungle. Oxygen levels are through the roof!",
          effect: { energy: 20, burnout: -15, productivity: 10 },
        },
        {
          id: "choice-6c",
          text: "Interview the plants directly",
          result:
            "The plants didn't respond verbally, but you swear one of them winked at you. You've either discovered plant consciousness or need more coffee. Probably both.",
          effect: { exp: 15, energy: -5, social: 5 },
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
