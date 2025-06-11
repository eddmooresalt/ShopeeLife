"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log("🔐 Starting signup process for:", email)

      // Check if user already exists
      const { data: existingUser } = await supabase.from("auth.users").select("email").eq("email", email).maybeSingle()

      if (existingUser) {
        setError("An account with this email already exists. Please try logging in instead.")
        return
      }

      // Try to sign up
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation redirect
        },
      })

      console.log("📝 Signup response:", {
        user: signupData.user ? `User created: ${signupData.user.email}` : "No user",
        session: signupData.session ? "Session exists" : "No session",
        error: signupError?.message,
      })

      if (signupError) {
        throw signupError
      }

      if (!signupData.user) {
        throw new Error("Failed to create user account")
      }

      // Wait a moment for the user to be fully created
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Try to sign in immediately
      console.log("🔐 Attempting immediate login...")
      const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })

      console.log("🔐 Immediate login response:", {
        user: signinData.user ? `User: ${signinData.user.email}` : "No user",
        session: signinData.session ? "Session created" : "No session",
        error: signinError?.message,
      })

      if (signinError) {
        console.log("⚠️ Immediate login failed, but account was created")
        setSuccess(
          "Account created successfully! The system needs a moment to process. Please wait 30 seconds and try logging in.",
        )
        return
      }

      if (signinData.session) {
        console.log("✅ Signup and login successful, redirecting...")
        setSuccess("Account created and logged in successfully! Redirecting...")
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 1000)
        return
      }

      // Fallback
      setSuccess("Account created! Please try logging in now.")
    } catch (err: any) {
      console.error("❌ Signup error:", err)
      if (err.message.includes("already registered")) {
        setError("An account with this email already exists. Please try logging in instead.")
      } else {
        setError(err.message || "Failed to create account. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Enter your email and password to create your game account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password (minimum 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || password.length < 6}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
            {error && (
              <div className="p-3 rounded-md text-sm text-center bg-red-50 text-red-700 border border-red-200">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-md text-sm text-center bg-green-50 text-green-700 border border-green-200">
                {success}
              </div>
            )}
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
