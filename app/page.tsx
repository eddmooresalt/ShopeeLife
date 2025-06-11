import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { loadUserProgress } from "@/actions/game-progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LunchPage } from "@/components/lunch-page"
import { GameActions } from "@/components/game-actions"
import { Coins, TrendingUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function HomePage() {
  const supabase = createServerSupabaseClient()

  // Get user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login")
  }

  // Try to load user progress
  let userProgress = null
  try {
    userProgress = await loadUserProgress()
  } catch (error) {
    console.error("Error loading user progress:", error)
  }

  // If no progress, show a message to run the SQL script
  if (!userProgress) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">Database Setup Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <p>
                <strong>User ID:</strong> {user.id}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Issue:</strong> Could not create or load game progress
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
              <p>
                <strong>Required Action:</strong>
              </p>
              <p className="mt-2">
                You need to run the database setup script to fix the permissions. Please run the{" "}
                <code className="bg-gray-100 px-1 rounded">008-fix-user-progress-table.sql</code> script.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/">
                <Button className="w-full">Try Again</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show game dashboard
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">🏢 Office Simulator</CardTitle>
            <p className="text-gray-600">Welcome back, {user.email?.split("@")[0]}!</p>
          </div>
          <form action="/api/auth/signout" method="post">
            <Button type="submit" variant="outline" className="bg-red-500 text-white hover:bg-red-600">
              Sign Out
            </Button>
          </form>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player Stats */}
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg border-2 border-purple-100">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Star className="text-yellow-500" />
                Your Progress
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <Coins className="text-green-600" size={20} />
                    <span className="font-medium">ShopeeCoins</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{userProgress.shopee_coins}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={20} />
                    <span className="font-medium">Level</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{userProgress.level}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-600" size={20} />
                    <span className="font-medium">Experience</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{userProgress.xp} XP</span>
                </div>
              </div>
            </Card>

            {/* Game Actions */}
            <GameActions />
          </div>

          {/* Lunch Page Integration */}
          <LunchPage />
        </CardContent>
      </Card>
    </div>
  )
}
