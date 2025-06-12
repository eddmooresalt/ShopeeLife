"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  type GameState,
  type Task,
  type DailyQuest,
  QuestType,
  type WeatherCondition,
  TabType,
  type ConsumableInventoryItem,
} from "@/types/game"
import { CheckCircle2, XCircle, Sun, Coffee, Target, Trophy, Gift, Package, Heart, User } from "lucide-react" // Added Heart icon
import { formatGameTime, calculatePlayerGrade, getLevelRank } from "@/utils/gameUtils" // Import getLevelRank and calculatePlayerGrade
import { gameData } from "@/data/gameData" // Import gameData to access shopItems

interface OfficeTabProps {
  gameState: GameState
  onWork: (taskId: string) => void
  onClaimQuestReward: (questId: string) => void
  dailyQuests: DailyQuest[]
  currentWeather: WeatherCondition
  isWorking: boolean
  workingTaskId: string | null
  workProgress: number
  onUseConsumable: (itemId: string) => void // New prop for using consumables
  setActiveTab: (tab: TabType) => void // Added setActiveTab
  onNavigateToLocation: (locationId: string) => void // New prop for navigating to specific locations
}

export function OfficeTab({
  gameState,
  onWork,
  onClaimQuestReward,
  dailyQuests,
  currentWeather,
  isWorking,
  workingTaskId,
  workProgress,
  onUseConsumable, // Destructure new prop
  setActiveTab, // Destructure setActiveTab
  onNavigateToLocation, // Destructure new prop
}: OfficeTabProps) {
  const { tasks, stats, gameTime, consumablesInventory, level, playerName } = gameState // Destructure consumablesInventory, level, playerName

  const currentHour = Math.floor(gameTime / 60) % 24
  const isBonusTime = currentHour < 18 || (currentHour === 18 && gameTime % 60 <= 30)
  const allQuestsCompleted = dailyQuests.every((q) => q.isCompleted)
  const allQuestsClaimed = dailyQuests.every((q) => q.isClaimed)
  const completedQuestsCount = dailyQuests.filter((q) => q.isCompleted).length

  const playerGrade = calculatePlayerGrade(stats.productivity, stats.burnout) // Calculate grade
  const levelRank = getLevelRank(level) // Get level rank

  const getGreeting = () => {
    if (currentHour < 12) return "Good Morning"
    if (currentHour < 17) return "Good Afternoon"
    if (currentHour < 20) return "Good Evening"
    return "Working Late"
  }

  const getMotivationalMessage = () => {
    const messages = [
      "Ready to conquer the day? ✨",
      "Your productivity journey starts here! 🚀",
      "Time to turn coffee into code! ☕",
      "Let's make today amazing! 🌟",
      "You've got this, superstar! 💪",
      "Another day, another opportunity to shine! ✨",
      "Ready to level up your career? 🎯",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const getQuestIcon = (questType: QuestType) => {
    switch (questType) {
      case QuestType.Task:
        return "📋"
      case QuestType.Navigate:
        return "🗺️"
      case QuestType.Lunch:
        return "🍽️"
      case QuestType.Shop:
        return "🛒"
      case QuestType.Stat:
        return "📊"
      case QuestType.SeaTalk:
        return "💬"
      case QuestType.Wardrobe:
        return "👕"
      default:
        return "🎯"
    }
  }

  const getQuestProgress = (quest: DailyQuest) => {
    if (quest.type === QuestType.Stat && quest.criteria?.statName) {
      const currentStatValue = gameState.stats[quest.criteria.statName]
      // For burnout, lower is better, so progress is inverse
      if (quest.criteria.statName === "burnout") {
        return Math.min(100 - currentStatValue, 100 - (quest.targetValue || 0)) // Progress towards lower burnout
      }
      return Math.min(currentStatValue, quest.targetValue || 0)
    }
    return quest.currentProgress
  }

  // Ensure we have exactly 3 quests to display
  const displayQuests = dailyQuests.slice(0, 3)

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-24">
          {" "}
          {/* Increased pb to 24 */}
          {/* Welcome Section */}
          <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl animate-bounce">👋</div>
                  <div>
                    <h1 className="text-xl font-bold md:text-2xl text-orange-800 dark:text-orange-200">
                      {getGreeting()}, {playerName}!
                    </h1>
                    <p className="text-orange-600 dark:text-orange-300">{getMotivationalMessage()}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 mt-1">
                      <User className="w-4 h-4" />
                      <span>
                        Level {level} ({levelRank}) | Grade: {playerGrade}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-lg font-semibold text-orange-700 dark:text-orange-300">
                    <Sun className="w-5 h-5" />
                    <span>{formatGameTime(gameTime)}</span>
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    {currentWeather.description} day ahead
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                {" "}
                {/* Changed to 3 columns */}
                <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-green-600">{stats.energy}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Energy</div>
                </div>
                <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-blue-600">{stats.productivity}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Productivity</div>
                </div>
                <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-red-600">{stats.burnout}</div> {/* Display burnout stat */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">Burnout</div>
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="mt-4 p-3 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg border border-orange-200 dark:border-orange-700">
                <div className="flex items-center space-x-2">
                  <Coffee className="w-5 h-5 text-orange-600" />
                  <span className="text-sm italic text-orange-800 dark:text-orange-200">
                    "Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston
                    Churchill
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Daily Quests Section - 3 Column Layout */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-xl md:text-2xl">
                <div className="flex items-center space-x-2">
                  <Target className="w-6 h-6" />
                  <span>Today's Challenges</span>
                  <Badge className="bg-white/20 text-white border-white/30">{completedQuestsCount}/3 Complete</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {allQuestsCompleted && !allQuestsClaimed && (
                    <Badge className="bg-yellow-500 text-yellow-900 animate-pulse flex items-center space-x-1">
                      <Trophy className="w-3 h-3" />
                      <span>Bonus Ready!</span>
                    </Badge>
                  )}
                  {isBonusTime && !gameState.hasClaimedDailyBonus && (
                    <Badge className="bg-green-500 text-white animate-pulse">Until 6:30 PM!</Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {displayQuests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-gray-500 dark:text-gray-400">No daily quests available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {displayQuests.map((quest, index) => {
                    const questProgress = getQuestProgress(quest)
                    const progressPercentage = quest.targetValue ? (questProgress / quest.targetValue) * 100 : 0

                    return (
                      <Card
                        key={quest.id}
                        className={`transition-all duration-200 ${
                          quest.isClaimed
                            ? "opacity-75 bg-green-50 dark:bg-green-900/20 border-green-300"
                            : quest.isCompleted
                              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 shadow-md"
                              : "hover:shadow-md border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <CardContent className="p-4">
                          {/* Quest Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{getQuestIcon(quest.type)}</span>
                              <Badge variant="outline" className="text-xs">
                                Quest {index + 1}
                              </Badge>
                            </div>
                            {quest.isClaimed ? (
                              <div className="flex items-center space-x-1 text-green-600">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xs font-medium">Claimed</span>
                              </div>
                            ) : quest.isCompleted ? (
                              <div className="flex items-center space-x-1 text-blue-600">
                                <Gift className="w-4 h-4" />
                                <span className="text-xs font-medium">Ready</span>
                              </div>
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400" />
                            )}
                          </div>

                          {/* Quest Description */}
                          <h4 className="font-semibold text-sm mb-3 leading-tight">{quest.description}</h4>

                          {/* Progress Bar */}
                          {!quest.isCompleted && (
                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>
                                  {questProgress}/{quest.targetValue || 1}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(100, progressPercentage)}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Rewards */}
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            <div className="flex items-center justify-between">
                              <span>Reward:</span>
                              <span className="font-medium">
                                {quest.rewardExp} EXP + {quest.rewardCoins} SC
                              </span>
                            </div>
                          </div>

                          {/* Action Button */}
                          {quest.isCompleted && !quest.isClaimed && (
                            <Button
                              onClick={() => onClaimQuestReward(quest.id)}
                              size="sm"
                              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            >
                              <Gift className="w-3 h-3 mr-1" />
                              Claim Reward
                            </Button>
                          )}

                          {quest.isClaimed && (
                            <Button size="sm" className="w-full bg-green-500" disabled>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completed
                            </Button>
                          )}

                          {!quest.isCompleted && (
                            <Button size="sm" variant="outline" className="w-full" disabled>
                              <Target className="w-3 h-3 mr-1" />
                              In Progress
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* Bonus Information */}
              {displayQuests.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-6 h-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-purple-800 dark:text-purple-200">Daily Challenge Bonus</h3>
                        <p className="text-sm text-purple-600 dark:text-purple-300">
                          Complete all 3 quests and claim rewards by 6:30 PM for a special bonus!
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">+50 EXP</div>
                      <div className="text-sm text-purple-500">+100 SC</div>
                    </div>
                  </div>

                  {allQuestsCompleted && !allQuestsClaimed && (
                    <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded border border-yellow-300 dark:border-yellow-700">
                      <p className="text-center text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                        🎉 All quests completed! Claim all rewards to unlock your bonus! 🎉
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Inventory Section */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-xl md:text-2xl">
                <Package className="w-6 h-6" />
                <span>Your Inventory (Consumables)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {consumablesInventory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-gray-500 dark:text-gray-400">Your consumable inventory is empty.</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Visit the Shop tab to buy some useful items!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {consumablesInventory.map((item: ConsumableInventoryItem) => {
                    const shopItem = gameData.shopItems.find((s) => s.id === item.itemId)
                    if (!shopItem) return null // Should not happen if data is consistent

                    const isMarlboro = item.itemId === "marlboro-cigarettes"
                    const quantityDisplay = isMarlboro
                      ? `${item.quantity}/20 sticks remaining`
                      : `${item.quantity} remaining`

                    return (
                      <Card key={item.itemId} className="hover:shadow-md transition-all duration-200">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <span className="text-4xl mb-2">{shopItem.emoji}</span>
                          <h3 className="font-semibold text-lg mb-1">{shopItem.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{shopItem.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                            ({quantityDisplay})
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            {shopItem.effect && (
                              <div className="flex flex-wrap justify-center gap-x-2">
                                {shopItem.effect.energy && (
                                  <span>
                                    ⚡ Energy: {shopItem.effect.energy > 0 ? "+" : ""}
                                    {shopItem.effect.energy}
                                  </span>
                                )}
                                {shopItem.effect.productivity && (
                                  <span>
                                    📈 Prod: {shopItem.effect.productivity > 0 ? "+" : ""}
                                    {shopItem.effect.productivity}
                                  </span>
                                )}
                                {shopItem.effect.burnout && (
                                  <span>
                                    <Heart className="inline-block w-3 h-3 mr-1 text-red-500" /> Burnout:{" "}
                                    {shopItem.effect.burnout > 0 ? "+" : ""}
                                    {shopItem.effect.burnout}
                                  </span>
                                )}
                                {shopItem.effect.exp && (
                                  <span>
                                    ✨ EXP: {shopItem.effect.exp > 0 ? "+" : ""}
                                    {shopItem.effect.exp}
                                  </span>
                                )}
                                {shopItem.effect.shopeeCoins && (
                                  <span>
                                    💰 SC: {shopItem.effect.shopeeCoins > 0 ? "+" : ""}
                                    {shopItem.effect.shopeeCoins}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          {isMarlboro ? (
                            <Button
                              onClick={() => onNavigateToLocation("smoking-area")}
                              size="sm"
                              className="w-full bg-gray-700 hover:bg-gray-800 text-white"
                            >
                              Go To Smoking Area
                            </Button>
                          ) : (
                            <Button
                              onClick={() => onUseConsumable(item.itemId)}
                              size="sm"
                              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                            >
                              Use Item
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Current Tasks Section (Compact) */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-xl md:text-2xl">
                <span className="text-2xl">📋</span>
                <span>Quick Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {tasks.filter((task) => !task.isCompleted).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-gray-500 dark:text-gray-400">All tasks completed for now!</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Check back tomorrow for new challenges.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {tasks
                    .filter((task) => !task.isCompleted)
                    .map((task: Task) => (
                      <Button
                        key={task.id}
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 w-full p-2 text-center group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => setActiveTab(TabType.Tasks)} // Redirect to Tasks tab
                        disabled={isWorking}
                      >
                        <span className="text-3xl mb-1 transition-transform group-hover:scale-110">{task.emoji}</span>
                        <span className="text-xs font-medium truncate w-full">{task.name}</span>
                        {isWorking && workingTaskId === task.id && (
                          <div
                            className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                            style={{ width: `${workProgress}%` }}
                          />
                        )}
                      </Button>
                    ))}
                </div>
              )}
              <div className="mt-4 text-center">
                <Button onClick={() => setActiveTab(TabType.Tasks)} variant="link">
                  View All Tasks →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
