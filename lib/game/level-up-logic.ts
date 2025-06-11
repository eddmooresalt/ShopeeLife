interface UserProgress {
  shopee_coins: number
  level: number
  xp: number
  game_state: Record<string, any>
}

// Define XP required for each level
const XP_THRESHOLDS: { [key: number]: number } = {
  1: 0, // Level 1 requires 0 XP (starting)
  2: 100,
  3: 250,
  4: 450,
  5: 700,
  // ... add more levels and their XP requirements
}

export function getRequiredXpForNextLevel(currentLevel: number): number {
  return XP_THRESHOLDS[currentLevel + 1] || Number.POSITIVE_INFINITY // Return Infinity if no next level defined
}

export function checkLevelUp(progress: UserProgress): { newProgress: UserProgress; leveledUp: boolean } {
  const newProgress = { ...progress }
  let leveledUp = false

  while (newProgress.xp >= getRequiredXpForNextLevel(newProgress.level)) {
    newProgress.xp -= getRequiredXpForNextLevel(newProgress.level) // Carry over excess XP
    newProgress.level += 1
    leveledUp = true
    console.log(`Congratulations! You reached Level ${newProgress.level}!`)
    // You might add other level-up bonuses here, e.g., more ShopeeCoins
    newProgress.shopee_coins += 50 * newProgress.level // Example bonus
  }

  return { newProgress, leveledUp }
}
