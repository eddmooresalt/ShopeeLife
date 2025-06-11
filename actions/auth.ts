"use server"

import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function signIn(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, message: "Email and password are required." }
  }

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  if (!data.session || !data.user) {
    return { success: false, message: "Login failed. Please try again." }
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function signUp(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, message: "Email and password are required." }
  }

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  if (!data.user) {
    return { success: false, message: "Failed to create account." }
  }

  // If we have a session immediately (email confirmation disabled)
  if (data.session) {
    revalidatePath("/", "layout")
    redirect("/")
  }

  // If no session, try to sign in immediately
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError || !signInData.session) {
    return {
      success: true,
      message: "Account created! Please try logging in with your credentials.",
    }
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function signOut() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/auth/login")
}
