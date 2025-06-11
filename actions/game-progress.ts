"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

interface GameProgress {
  shopee_coins: number
  level: number
  xp: number
  game_state: Record<string, any>
}

export async function loadUserProgress(): Promise<GameProgress | null> {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("No authenticated user:", userError?.message)
    return null
  }

  console.log("Loading progress for user:", user.id)

  // Try to get existing progress first
  const { data: existingProgress, error: fetchError } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!fetchError && existingProgress) {
    console.log("Found existing progress:", existingProgress)
    return existingProgress
  }

  console.log("No existing progress found, creating new progress...")

  // Create initial progress with a direct approach
  const initialProgress = {
    user_id: user.id,
    shopee_coins: 100,
    level: 1,
    xp: 0,
    game_state: {},
  }

  // Try to insert new progress
  const { data: newProgress, error: insertError } = await supabase
    .from("user_progress")
    .insert(initialProgress)
    .select()
    .single()

  if (insertError) {
    console.error("Failed to create progress:", insertError.message)
    // Return a default progress object so the game can still work
    return {
      shopee_coins: 100,
      level: 1,
      xp: 0,
      game_state: {},
    }
  }

  console.log("Successfully created new progress:", newProgress)
  return newProgress
}

export async function saveUserProgress(progress: Partial<GameProgress>) {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "No user logged in." }
  }

  // Try to update existing progress
  const { error: updateError } = await supabase.from("user_progress").update(progress).eq("user_id", user.id)

  if (updateError) {
    console.error("Error updating user progress:", updateError.message)

    // If update fails, try to insert new progress
    const { error: insertError } = await supabase.from("user_progress").insert({
      user_id: user.id,
      shopee_coins: 100,
      level: 1,
      xp: 0,
      game_state: {},
      ...progress,
    })

    if (insertError) {
      console.error("Error creating user progress:", insertError.message)
      return { success: false, message: insertError.message }
    }
  }

  return { success: true, message: "Progress saved successfully." }
}
