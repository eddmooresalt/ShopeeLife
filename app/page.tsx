"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, TrendingUp, Star } from "lucide-react"

interface GameProgress {
  shopeeCoins: number
  level: number
  xp: number
  gameState: Record<string, any>
}

export default function HomePage() {
  const [progress, setProgress] = useState<GameProgress>({
    shopeeCoins: 100,
    level: 1,
    xp: 0,
    gameState: {},
  })
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState("")

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("office-simulator-progress")
    if (saved) {
      try {
        setProgress(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load saved progress:", e)
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("office-simulator-progress", JSON.stringify(progress))
  }, [progress])

  const doWork = () => {
    setWorking(true)
    setMessage("")

    // Simulate work delay
    setTimeout(() => {
      const xpGained = 20
      const coinsGained = 5
      const newXp = progress.xp + xpGained
      const newCoins = progress.shopeeCoins + coinsGained
      const newLevel = Math.floor(newXp / 100) + 1

      const leveledUp = newLevel > progress.level

      setProgress({
        ...progress,
        xp: newXp,
        shopeeCoins: newCoins,
        level: newLevel,
      })

      let msg = `Great work! +${xpGained} XP, +${coinsGained} coins`
      if (leveledUp) {
        msg += ` 🎉 LEVEL UP to ${newLevel}! +${newLevel * 50} bonus coins!`
        setProgress((prev) => ({
          ...prev,
          shopeeCoins: prev.shopeeCoins + newLevel * 50,
        }))
      }

      setMessage(msg)
      setWorking(false)
    }, 1000)
  }

  const attendMeeting = () => {
    setWorking(true)
    setMessage("")

    setTimeout(() => {
      const xpGained = 15
      const coinsGained = 3
      const newXp = progress.xp + xpGained
      const newCoins = progress.shopeeCoins + coinsGained
      const newLevel = Math.floor(newXp / 100) + 1

      const leveledUp = newLevel > progress.level

      setProgress({
        ...progress,
        xp: newXp,
        shopeeCoins: newCoins,
        level: newLevel,
      })

      let msg = `Meeting completed! +${xpGained} XP, +${coinsGained} coins`
      if (leveledUp) {
        msg += ` 🎉 LEVEL UP to ${newLevel}!`
      }

      setMessage(msg)
      setWorking(false)
    }, 1500)
  }

  const resetProgress = () => {
    if (confirm("Are you sure you want to reset all progress?")) {
      setProgress({
        shopeeCoins: 100,
        level: 1,
        xp: 0,
        gameState: {},
      })
      setMessage("Progress reset!")
    }
  }

  const getXpForNextLevel = () => {
    return (progress.level + 1) * 100
  }

  const getXpProgress = () => {
    const currentLevelXp = progress.level * 100
    const nextLevelXp = getXpForNextLevel()
    const progressXp = progress.xp - currentLevelXp
    const neededXp = nextLevelXp - currentLevelXp
    return Math.max(0, Math.min(100, (progressXp / neededXp) * 100))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-gray-800 mb-2">🏢 Office Simulator</CardTitle>
            <p className="text-gray-600">No login required - your progress is saved locally!</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player Stats */}
              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="text-yellow-500" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <Coins className="text-green-600" size={20} />
                      <span className="font-medium">ShopeeCoins</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{progress.shopeeCoins}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="text-blue-600" size={20} />
                      <span className="font-medium">Level</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{progress.level}</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-600" size={20} />
                        <span className="font-medium">Experience</span>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">{progress.xp} XP</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getXpProgress()}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {getXpForNextLevel() - progress.xp} XP to level {progress.level + 1}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Game Actions */}
              <Card className="bg-gradient-to-l from-yellow-50 to-orange-50 shadow-lg">
                <CardHeader>
                  <CardTitle>Game Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={doWork}
                    disabled={working}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {working ? "Working..." : "Do Work (+20 XP, +5 coins)"}
                  </Button>

                  <Button
                    onClick={attendMeeting}
                    disabled={working}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    {working ? "In Meeting..." : "Attend Meeting (+15 XP, +3 coins)"}
                  </Button>

                  <Button
                    onClick={resetProgress}
                    disabled={working}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Reset Progress
                  </Button>

                  {message && (
                    <div className="p-3 rounded-md text-sm text-center bg-green-100 text-green-700 border border-green-200">
                      {message}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Game Info */}
            <Card className="bg-gradient-to-r from-pink-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-xl">🍽️ Office Life</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-2xl mb-2">☕</div>
                    <h3 className="font-semibold">Coffee Break</h3>
                    <p className="text-sm text-gray-600">Take a break and recharge your energy!</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-2xl mb-2">🥪</div>
                    <h3 className="font-semibold">Lunch Time</h3>
                    <p className="text-sm text-gray-600">Enjoy a delicious meal with colleagues!</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-2xl mb-2">🏠</div>
                    <h3 className="font-semibold">Go Home</h3>
                    <p className="text-sm text-gray-600">End your day and rest up for tomorrow!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
