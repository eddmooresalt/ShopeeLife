"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FinalLoginPage() {
  const [email, setEmail] = useState("test@game.com")
  const [password, setPassword] = useState("password123")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const router = useRouter()

  const log = (msg: string) => {
    console.log(msg)
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
  }

  const testLogin = async () => {
    setLoading(true)
    setMessage("")
    setLogs([])

    log("🔄 Starting login test...")

    try {
      // Create a fresh Supabase client
      const { createBrowserClient } = await import("@supabase/ssr")
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      log(`📧 Attempting login with: ${email}`)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        log(`❌ Login failed: ${error.message}`)
        setMessage(`Login failed: ${error.message}`)
        return
      }

      if (!data.user || !data.session) {
        log(`❌ No user or session returned`)
        setMessage("Login failed: No user or session")
        return
      }

      log(`✅ Login successful!`)
      log(`👤 User: ${data.user.email}`)
      log(`🔑 Session: ${data.session.access_token ? "Valid" : "Invalid"}`)

      // Test database access
      log("🔄 Testing database access...")
      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", data.user.id)
        .single()

      if (progressError) {
        log(`❌ Database error: ${progressError.message}`)
        setMessage("Login successful but database access failed")
        return
      }

      log(`✅ Database access successful!`)
      log(`💰 Coins: ${progressData.shopee_coins}`)
      log(`📈 Level: ${progressData.level}`)
      log(`⭐ XP: ${progressData.xp}`)

      setMessage("✅ Everything works! Redirecting to game...")

      setTimeout(() => {
        router.push("/final-game")
        router.refresh()
      }, 2000)
    } catch (err: any) {
      log(`❌ Exception: ${err.message}`)
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createCustomUser = async () => {
    if (!email || !password) {
      setMessage("Please enter email and password")
      return
    }

    setLoading(true)
    setMessage("")
    setLogs([])

    log("🔄 Creating custom user...")

    try {
      const { createBrowserClient } = await import("@supabase/ssr")
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      // Try signup
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      })

      if (signupError) {
        if (signupError.message.includes("already registered")) {
          log("User exists, trying login...")
          await testLogin()
          return
        }
        log(`❌ Signup failed: ${signupError.message}`)
        setMessage(`Signup failed: ${signupError.message}`)
        return
      }

      log(`✅ User created: ${signupData.user?.email}`)

      // Try immediate login
      log("🔄 Trying immediate login...")
      await testLogin()
    } catch (err: any) {
      log(`❌ Exception: ${err.message}`)
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🎯 Final Login Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test with pre-created user */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Step 1: Test Pre-Created User</h3>
              <p className="text-sm text-green-700 mb-3">
                First run the SQL script, then test with the pre-created user:
              </p>
              <div className="space-y-2">
                <p className="text-sm font-mono bg-white p-2 rounded">
                  Email: test@game.com
                  <br />
                  Password: password123
                </p>
                <Button onClick={testLogin} disabled={loading} className="bg-green-600 hover:bg-green-700">
                  {loading ? "Testing..." : "Test Pre-Created User"}
                </Button>
              </div>
            </div>

            {/* Create custom user */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Step 2: Create Your Own User</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Your Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (6+ characters)"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={createCustomUser}
                  disabled={loading || !email || password.length < 6}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Creating..." : "Create & Test Your User"}
                </Button>
              </div>
            </div>

            {/* Status */}
            {message && (
              <div
                className={`p-4 rounded-lg text-center ${
                  message.includes("✅") || message.includes("successful")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}

            {/* Logs */}
            <div>
              <h3 className="font-semibold mb-2">Detailed Logs:</h3>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
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
