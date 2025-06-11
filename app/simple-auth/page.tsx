"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase/simple-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimpleAuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()
  const supabase = getSupabase()

  const handleAuth = async (isSignup: boolean) => {
    if (!email || !password) {
      setMessage("Please enter email and password")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      let result

      if (isSignup) {
        // Sign up
        result = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password,
        })

        if (result.error) {
          if (result.error.message.includes("already registered")) {
            setMessage("Account exists! Trying to log you in...")
            // Try login instead
            result = await supabase.auth.signInWithPassword({
              email: email.trim().toLowerCase(),
              password: password,
            })
          } else {
            throw result.error
          }
        }
      } else {
        // Sign in
        result = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password,
        })
      }

      if (result.error) {
        throw result.error
      }

      if (result.data.session) {
        setMessage("Success! Redirecting to game...")
        setTimeout(() => {
          router.push("/game")
          router.refresh()
        }, 1000)
      } else {
        setMessage("Authentication successful but no session created. Please try again.")
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">🏢 Office Simulator</CardTitle>
          <p className="text-center text-gray-600">Simple Login</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (6+ characters)"
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleAuth(true)}
              disabled={loading || !email || password.length < 6}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "..." : "Sign Up"}
            </Button>

            <Button
              onClick={() => handleAuth(false)}
              disabled={loading || !email || !password}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "..." : "Login"}
            </Button>
          </div>

          {message && (
            <div
              className={`p-3 rounded text-sm text-center ${
                message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
