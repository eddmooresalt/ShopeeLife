"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAuthPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("testpass123")
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const addResult = (message: string) => {
    setResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testSignup = async () => {
    setLoading(true)
    addResult("🔄 Starting signup test...")

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      addResult(`📝 Signup result: ${error ? `ERROR - ${error.message}` : "SUCCESS"}`)
      addResult(`📝 User created: ${data.user ? "YES" : "NO"}`)
      addResult(`📝 Session created: ${data.session ? "YES" : "NO"}`)

      if (data.user) {
        addResult(`📝 User ID: ${data.user.id}`)
        addResult(`📝 User email: ${data.user.email}`)
        addResult(`📝 Email confirmed: ${data.user.email_confirmed_at ? "YES" : "NO"}`)
      }
    } catch (err) {
      addResult(`❌ Signup exception: ${err}`)
    }

    setLoading(false)
  }

  const testLogin = async () => {
    setLoading(true)
    addResult("🔄 Starting login test...")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      addResult(`🔐 Login result: ${error ? `ERROR - ${error.message}` : "SUCCESS"}`)
      addResult(`🔐 User found: ${data.user ? "YES" : "NO"}`)
      addResult(`🔐 Session created: ${data.session ? "YES" : "NO"}`)

      if (data.user) {
        addResult(`🔐 User ID: ${data.user.id}`)
        addResult(`🔐 User email: ${data.user.email}`)
        addResult(`🔐 Email confirmed: ${data.user.email_confirmed_at ? "YES" : "NO"}`)
      }
    } catch (err) {
      addResult(`❌ Login exception: ${err}`)
    }

    setLoading(false)
  }

  const testConnection = async () => {
    setLoading(true)
    addResult("🔄 Testing database connection...")

    try {
      const { data, error } = await supabase.from("user_progress").select("count", { count: "exact", head: true })

      addResult(`🔗 Database connection: ${error ? `ERROR - ${error.message}` : "SUCCESS"}`)
      addResult(`🔗 Can access user_progress table: ${error ? "NO" : "YES"}`)
    } catch (err) {
      addResult(`❌ Connection exception: ${err}`)
    }

    setLoading(false)
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Authentication Test Lab</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Button onClick={testConnection} disabled={loading} variant="outline">
                Test DB
              </Button>
              <Button onClick={testSignup} disabled={loading}>
                Test Signup
              </Button>
              <Button onClick={testLogin} disabled={loading}>
                Test Login
              </Button>
              <Button onClick={clearResults} variant="outline">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📋 Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-gray-500">No tests run yet. Click a test button above.</div>
              ) : (
                results.map((result, index) => <div key={index}>{result}</div>)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">
              <p>
                <strong>Instructions:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>First run the SQL reset script</li>
                <li>Test DB connection (should show SUCCESS)</li>
                <li>Test Signup (should create user and session)</li>
                <li>Test Login (should work immediately after signup)</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
