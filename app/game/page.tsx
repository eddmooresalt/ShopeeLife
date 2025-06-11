import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, TrendingUp, Star } from "lucide-react"
import { SimpleGameActions } from "@/components/simple-game-actions"

async function getUserProgress(userId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error loading progress:", error)
    return { shopee_coins: 100, level: 1, xp: 0, game_state: {} }
  }

  return data
}

export default async function GamePage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/simple-auth")
  }

  const progress = await getUserProgress(user.id)

  const handleSignOut = async () => {
    "use server"
    const supabase = createServerSupabaseClient()
    await supabase.auth.signOut()
    redirect("/simple-auth")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">🏢 Office Simulator</CardTitle>
              <p className="text-gray-600">Welcome, {user.email?.split("@")[0]}!</p>
            </div>
            <form action={handleSignOut}>
              <Button type="submit" variant="outline">
                Sign Out
              </Button>
            </form>
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
              <SimpleGameActions />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
