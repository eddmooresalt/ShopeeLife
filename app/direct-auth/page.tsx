"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function DirectAuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Add log with timestamp
  const log = (message: string) => {
    const timestamp = new Date().toISOString()
    console.log(`${timestamp}: ${message}`)
    setLogs((prev) => [...prev, `${timestamp}: ${message}`])
  }

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      log("Checking for existing session...")
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        log(`Session check error: ${error.message}`)
        return
      }

      if (data.session) {
        log(`Already logged in as ${data.session.user.email}`)
        setSuccess(true)
      } else {
        log("No active session found")
      }
    }

    checkSession()
  }, [])

  // Direct signup function
  const handleDirectSignup = async () => {
    setLoading(true)
    log(`Starting DIRECT signup for ${email}...`)

    try {
      // 1. Try signup
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
        },
      })

      if (signupError) {
        log(`Signup error: ${signupError.message}`)

        // If user already exists, try login instead
        if (signupError.message.includes("already registered")) {
          log("User already exists, trying login instead...")
          await handleDirectLogin()
          return
        }

        setLoading(false)
        return
      }

      log(`Signup successful! User ID: ${signupData.user?.id}`)

      // 2. Immediately try login
      await handleDirectLogin()
    } catch (err: any) {
      log(`Unexpected signup error: ${err.message || err}`)
      setLoading(false)
    }
  }

  // Direct login function
  const handleDirectLogin = async () => {
    if (!loading) setLoading(true)
    log(`Starting DIRECT login for ${email}...`)

    try {
      // Try login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        log(`Login error: ${error.message}`)
        setLoading(false)
        return
      }

      log(`Login successful! User ID: ${data.user?.id}`)
      log("Session established successfully!")

      // Create user progress if needed
      try {
        log("Creating initial user progress...")
        const { error: progressError } = await supabase
          .from("user_progress")
          .insert({
            user_id: data.user.id,
            shopee_coins: 100,
            level: 1,
            xp: 0,
          })
          .select()
          .single()

        if (progressError) {
          if (progressError.message.includes("duplicate key")) {
            log("User progress already exists (this is fine)")
          } else {
            log(`Progress creation error: ${progressError.message}`)
          }
        } else {
          log("Initial user progress created successfully!")
        }
      } catch (err: any) {
        log(`Progress creation exception: ${err.message || err}`)
      }

      setSuccess(true)
      log("Authentication complete! Redirecting to game...")

      // Wait 2 seconds then redirect
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 2000)
    } catch (err: any) {
      log(`Unexpected login error: ${err.message || err}`)
      setLoading(false)
    }
  }

  // Go to game
  const goToGame = () => {
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🔐 Direct Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {success ? (
              <div className="space-y-4">
                <div className="bg-green-100 border border-green-300 rounded-md p-4 text-green-800">
                  <p className="font-bold">✅ Authentication Successful!</p>
                  <p className="text-sm mt-1">You are now logged in and ready to play.</p>
                </div>
                <Button onClick={goToGame} className="w-full">
                  Go to Game
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (6+ characters)"
                    disabled={loading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleDirectSignup}
                    disabled={loading || !email || password.length < 6}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? "Processing..." : "Sign Up"}
                  </Button>
                  <Button onClick={handleDirectLogin} disabled={loading || !email || !password}>
                    {loading ? "Processing..." : "Login"}
                  </Button>
                </div>
              </>
            )}

            {/* Logs section */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2">Authentication Logs:</h3>
              <div className="bg-black text-green-400 p-3 rounded-md text-xs font-mono h-48 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500">No logs yet...</p>
                ) : (
                  logs.map((log, i) => <div key={i}>{log}</div>)
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
