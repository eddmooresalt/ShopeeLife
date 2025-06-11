"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, TrendingUp, Star } from "lucide-react"

interface UserProgress {
  shopee_coins: number
  level: number
  xp: number
}

export default function FinalGamePage() {
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<UserProgress>({ shopee_coins: 100, level: 1, xp: 0 })
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { createBrowserClient } = await import("@supabase/ssr")
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push("/final-login")
        return
      }

      setUser(user)

      // Load progress
      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (!progressError && progressData) {
        setProgress(progressData)
      }
    } catch (err) {
      console.error("Auth check failed:", err)
      router.push("/final-login")
    } finally {
      setLoading(false)
    }
  }

  const doWork = async () => {
    setWorking(true)
    setMessage("")

    try {
      const { createBrowserClient } = await import("@supabase/ssr")
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const newXp = progress.xp + 20
      const newCoins = progress.shopee_coins + 5
      const newLevel = Math.floor(newXp / 100) + 1

      const { error } = await supabase
        .from("user_progress")
        .update({
          xp: newXp,
          shopee_coins: newCoins,
          level: newLevel,
          last_played: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (error) {
        setMessage(`Error: ${error.message}`)
        return
      }

      const newProgress = { shopee_coins: newCoins, level: newLevel, xp: newXp }
      setProgress(newProgress)

      setMessage(`Great work! +20 XP, +5 coins${newLevel > progress.level ? `, LEVEL UP to ${newLevel}!` : ""}`)
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setWorking(false)
    }
  }

  const signOut = async () => {
    try {
      const { createBrowserClient } = await import("@supabase/ssr")
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      await supabase.auth.signOut()
      router.push("/final-login")
    } catch (err) {
      console.error("Sign out failed:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">🏢 Office Simulator</CardTitle>
              <p className="text-gray-600">Welcome, {user?.email?.split("@")[0]}!</p>
            </div>
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stats */}
              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="text-yellow-500" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Coins className="text-green-600" size={20} />
                      <span>ShopeeCoins</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{progress.shopee_coins}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="text-blue-600" size={20} />
                      <span>Level</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{progress.level}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-600" size={20} />
                      <span>Experience</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">{progress.xp} XP</span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="bg-gradient-to-l from-yellow-50 to-orange-50">
                <CardHeader>
                  <CardTitle>Game Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={doWork} disabled={working} className="w-full bg-blue-500 hover:bg-blue-600">
                    {working ? "Working..." : "Do Work (+20 XP, +5 coins)"}
                  </Button>

                  <Button disabled className="w-full bg-purple-500 hover:bg-purple-600">
                    Attend Meeting (Coming Soon)
                  </Button>

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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
