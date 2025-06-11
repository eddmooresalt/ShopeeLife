"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function WorkingLoginPage() {
  const [email, setEmail] = useState("test-working@example.com")
  const [password, setPassword] = useState("testpass123")
  const [customEmail, setCustomEmail] = useState("")
  const [customPassword, setCustomPassword] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    console.log(`${timestamp}: ${message}`)
    setLogs((prev) => [...prev, `${timestamp}: ${message}`])
  }

  const testKnownWorkingLogin = async () => {
    setLoading(true)
    log("Testing with KNOWN WORKING credentials...")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "test-working@example.com",
        password: "testpass123",
      })

      if (error) {
        log(`❌ Known working login failed: ${error.message}`)
      } else {
        log(`✅ Known working login SUCCESS!`)
        log(`✅ User: ${data.user?.email}`)
        log(`✅ Session: ${data.session ? "EXISTS" : "MISSING"}`)

        if (data.session) {
          log("🎮 Redirecting to game...")
          setTimeout(() => {
            router.push("/")
            router.refresh()
          }, 2000)
        }
      }
    } catch (err: any) {
      log(`❌ Exception: ${err.message}`)
    }

    setLoading(false)
  }

  const createAndTestCustomUser = async () => {
    if (!customEmail || !customPassword) {
      log("❌ Please enter custom email and password")
      return
    }

    setLoading(true)
    log(`Creating custom user: ${customEmail}`)

    try {
      // First, try to create via Supabase signup
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: customEmail,
        password: customPassword,
      })

      if (signupError) {
        log(`❌ Signup error: ${signupError.message}`)

        // If user exists, try login
        if (signupError.message.includes("already registered")) {
          log("User exists, trying login...")
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: customEmail,
            password: customPassword,
          })

          if (loginError) {
            log(`❌ Login failed: ${loginError.message}`)
          } else {
            log(`✅ Login SUCCESS!`)
            log(`✅ User: ${loginData.user?.email}`)
            log(`✅ Session: ${loginData.session ? "EXISTS" : "MISSING"}`)

            if (loginData.session) {
              log("🎮 Redirecting to game...")
              setTimeout(() => {
                router.push("/")
                router.refresh()
              }, 2000)
            }
          }
        }
      } else {
        log(`✅ Signup SUCCESS!`)
        log(`✅ User created: ${signupData.user?.email}`)
        log(`✅ Session: ${signupData.session ? "EXISTS" : "MISSING"}`)

        // Try immediate login
        log("Trying immediate login...")
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: customEmail,
          password: customPassword,
        })

        if (loginError) {
          log(`❌ Immediate login failed: ${loginError.message}`)
          log("⏳ Wait 5 seconds and try the 'Test Known Working' button")
        } else {
          log(`✅ Immediate login SUCCESS!`)
          if (loginData.session) {
            log("🎮 Redirecting to game...")
            setTimeout(() => {
              router.push("/")
              router.refresh()
            }, 2000)
          }
        }
      }
    } catch (err: any) {
      log(`❌ Exception: ${err.message}`)
    }

    setLoading(false)
  }

  const clearLogs = () => setLogs([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔧 Working Login Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test with known working credentials */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Step 1: Test Known Working Account</h3>
              <p className="text-sm text-green-700 mb-3">
                First, run the SQL script to create a test user, then click this button:
              </p>
              <Button onClick={testKnownWorkingLogin} disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading ? "Testing..." : "Test Known Working Login"}
              </Button>
            </div>

            {/* Create custom user */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Step 2: Create Your Account</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Email</label>
                  <Input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Your Password</label>
                  <Input
                    type="password"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="Password (6+ characters)"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={createAndTestCustomUser}
                  disabled={loading || !customEmail || customPassword.length < 6}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Creating..." : "Create & Test Your Account"}
                </Button>
              </div>
            </div>

            {/* Logs */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Test Results:</h3>
                <Button onClick={clearLogs} variant="outline" size="sm">
                  Clear
                </Button>
              </div>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500">No tests run yet...</p>
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
