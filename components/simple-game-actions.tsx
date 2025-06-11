"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase/simple-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SimpleGameActions() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()
  const supabase = getSupabase()

  const doWork = async () => {
    setLoading(true)
    setMessage("")

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not logged in")

      // Get current progress
      const { data: progress, error: fetchError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (fetchError) throw fetchError

      // Update progress
      const newXp = progress.xp + 20
      const newCoins = progress.shopee_coins + 5
      const newLevel = Math.floor(newXp / 100) + 1

      const { error: updateError } = await supabase
        .from("user_progress")
        .update({
          xp: newXp,
          shopee_coins: newCoins,
          level: newLevel,
          last_played: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (updateError) throw updateError

      setMessage(`Great work! +20 XP, +5 coins${newLevel > progress.level ? `, LEVEL UP to ${newLevel}!` : ""}`)

      // Refresh the page to show new stats
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-l from-yellow-50 to-orange-50">
      <CardHeader>
        <CardTitle>Game Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={doWork} disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600">
          {loading ? "Working..." : "Do Work (+20 XP, +5 coins)"}
        </Button>

        <Button disabled={loading} className="w-full bg-purple-500 hover:bg-purple-600">
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
  )
}
