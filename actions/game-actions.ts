"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { loadUserProgress, saveUserProgress } from "./game-progress"
import { checkLevelUp } from "@/lib/game/level-up-logic"
import { revalidatePath } from "next/cache"

export async function doWorkAction() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "You must be logged in to do work." }
  }

  const userProgress = await loadUserProgress()
  if (!userProgress) {
    return { success: false, message: "Could not load user progress." }
  }

  // Simulate gaining XP and ShopeeCoins
  const xpGained = 20
  const coinsGained = 5

  const updatedXp = userProgress.xp + xpGained
  const updatedCoins = userProgress.shopee_coins + coinsGained

  // Check for level up
  const { newProgress: progressAfterLevelUp, leveledUp } = checkLevelUp({
    ...userProgress,
    xp: updatedXp,
    shopee_coins: updatedCoins, // Pass updated coins to checkLevelUp for potential bonuses
  })

  const saveResult = await saveUserProgress(progressAfterLevelUp)

  if (!saveResult.success) {
    return { success: false, message: `Failed to save progress: ${saveResult.message}` }
  }

  revalidatePath("/") // Revalidate the home page to show updated progress

  let message = `You did some work! Gained ${xpGained} XP and ${coinsGained} ShopeeCoins.`
  if (leveledUp) {
    message += ` Congratulations! You leveled up to Level ${progressAfterLevelUp.level}!`
  }

  return { success: true, message }
}
