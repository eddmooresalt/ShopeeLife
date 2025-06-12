import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GameState } from "@/types/game"
import { Flame, Zap, TrendingUp, AlertTriangle } from "lucide-react"

interface CharacterTabProps {
  gameState: GameState
}

export function CharacterTab({ gameState }: CharacterTabProps) {
  const { exp, level, stats, wardrobe } = gameState
  const { energy, productivity, burnout } = stats

  // Placeholder for level up logic (e.g., EXP needed for next level)
  const expToNextLevel = level * 100
  const expPercentage = (exp / expToNextLevel) * 100

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-24">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">👤</span>
                <span>Your Character</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-6xl border-4 border-orange-500 shadow-lg">
                  👤{/* Render wardrobe items on avatar if applicable */}
                  {wardrobe.includes("shopee-hoodie") && (
                    <span className="absolute top-0 left-0 text-5xl -translate-x-1/4 -translate-y-1/4">🍊</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold">You (Level {level})</h2>
              </div>

              {/* Stats Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Stats:</h3>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Zap className="w-5 h-5 text-green-500 mr-2" />
                        <span className="font-medium">ENERGY</span>
                      </div>
                      <span className="font-medium">{energy}/100</span>
                    </div>
                    <div className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${energy}%` }}
                      >
                        {energy > 15 && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            {energy}%
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Energy is consumed when working on tasks and replenished by eating lunch or using items.
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="font-medium">PRODUCTIVITY</span>
                      </div>
                      <span className="font-medium">{productivity}/100</span>
                    </div>
                    <div className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${productivity}%` }}
                      >
                        {productivity > 15 && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            {productivity}%
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Productivity affects your work efficiency and task completion speed.
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="font-medium">BURNOUT</span>
                      </div>
                      <span className="font-medium">{burnout}/100</span>
                    </div>
                    <div className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-300"
                        style={{ width: `${burnout}%` }}
                      >
                        {burnout > 15 && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            {burnout}%
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Burnout reduces your effectiveness. Lower is better. Manage it with breaks and wellness
                      activities.
                    </p>
                  </div>
                </div>
              </div>

              {/* EXP Progress */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Experience:</h3>
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span>EXP to next level</span>
                      <span>
                        {exp}/{expToNextLevel}
                      </span>
                    </div>
                    <Progress value={expPercentage} className="h-2 bg-gray-200 [&>*]:bg-red-500" />
                  </div>
                </div>
              </div>

              {/* Wardrobe Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Wardrobe:</h3>
                <div className="min-h-[100px] border rounded-md p-2">
                  {wardrobe.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      Your wardrobe is empty. Visit the shop!
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {wardrobe.map((itemId) => {
                        const item = gameState.shopItems.find((sItem) => sItem.id === itemId)
                        return (
                          item && (
                            <div
                              key={item.id}
                              className="flex flex-col items-center p-2 border rounded-md bg-gray-100 dark:bg-gray-700"
                            >
                              <span className="text-3xl">{item.emoji}</span>
                              <span className="text-xs text-center">{item.name}</span>
                            </div>
                          )
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
