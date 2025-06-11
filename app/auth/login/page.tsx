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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("🔐 Starting login process for:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })

      console.log("🔐 Login response:", {
        user: data.user ? `User: ${data.user.email}` : "No user",
        session: data.session ? "Session exists" : "No session",
        userConfirmed: data.user?.email_confirmed_at ? "Email confirmed" : "Email not confirmed",
        error: error?.message,
      })

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError(
            "Invalid email or password. If you just signed up, please wait a moment and try again, or check your email for confirmation.",
          )
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please check your email and click the confirmation link before logging in.")
        } else {
          setError(error.message)
        }
        return
      }

      if (data.user && data.session) {
        console.log("✅ Login successful, redirecting...")
        router.push("/")
        router.refresh()
      } else {
        setError("Login failed. Please check your credentials and try again.")
      }
    } catch (err: any) {
      console.error("❌ Login error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login to Office Simulator</CardTitle>
          <CardDescription>Enter your email and password to access your game.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>
            {error && (
              <div className="p-3 rounded-md text-sm text-center bg-red-50 text-red-700 border border-red-200">
                {error}
              </div>
            )}
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline">
              Sign up
            </Link>
          </div>
          <div className="mt-2 text-center">
            <Link href="/debug" className="text-xs text-gray-500 underline">
              Debug Connection
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
