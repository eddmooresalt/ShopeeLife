"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { type GameState, type Task, type DailyQuest, QuestType, type WeatherCondition } from "@/types/game"
import { ProgressDetail } from "@/components/ProgressDetail"
import { CheckCircle2, XCircle, Sun, Coffee, Target, Trophy, Gift } from "lucide-react"
import { formatGameTime } from "@/utils/gameUtils"

interface OfficeTabProps {
  gameState: GameState
  onWork: (taskId: string) => void
  onClaimQuestReward: (questId: string) => void
  dailyQuests: DailyQuest[]
  currentWeather: WeatherCondition
  isWorking: boolean
  workingTaskId: string | null
  workProgress: number
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
}: OfficeTabProps) {
  const { tasks, stats, gameTime } = gameState

  const currentHour = Math.floor(gameTime / 60) % 24
  const isBonusTime = currentHour < 18 || (currentHour === 18 && gameTime % 60 <= 30)
  const allQuestsCompleted = dailyQuests.every((q) => q.isCompleted)
  const allQuestsClaimed = dailyQuests.every((q) => q.isClaimed)
  const completedQuestsCount = dailyQuests.filter((q) => q.isCompleted).length

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
      return Math.min(currentStatValue, quest.targetValue || 0)
    }
    return quest.currentProgress
  }

  // Ensure we have exactly 3 quests to display
  const displayQuests = dailyQuests.slice(0, 3)

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-20">
          {/* Welcome Section */}
          <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl animate-bounce">👋</div>
                  <div>
                    <h1 className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                      {getGreeting()}, Champion!
                    </h1>
                    <p className="text-orange-600 dark:text-orange-300">{getMotivationalMessage()}</p>
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
                <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-green-600">{stats.energy}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Energy</div>
                </div>
                <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-blue-600">{stats.productivity}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Productivity</div>
                </div>
                <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-orange-600">{gameState.shopeeCoins}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">ShopeeCoins</div>
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
              <CardTitle className="flex items-center justify-between">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Current Tasks Section */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">📋</span>
                <span>Your Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-gray-500 dark:text-gray-400">No tasks available.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task: Task) => (
                    <Card
                      key={task.id}
                      className={`transition-all duration-200 ${
                        task.isCompleted
                          ? "opacity-60 bg-green-50 dark:bg-green-900/20 border-green-200"
                          : "hover:shadow-md hover:scale-[1.02]"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-3xl">{task.emoji}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{task.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                          </div>
                        </div>

                        {isWorking && workingTaskId === task.id ? (
                          <ProgressDetail label="Working" value={workProgress} maxValue={100} className="mb-3" />
                        ) : (
                          <ProgressDetail
                            label="Progress"
                            value={task.progress}
                            maxValue={task.targetProgress}
                            className="mb-3"
                          />
                        )}

                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span>
                            Reward: {task.rewardExp} EXP, {task.rewardCoins} SC
                          </span>
                          <span>Energy Cost: {task.energyCost}</span>
                        </div>

                        <Button
                          onClick={() => onWork(task.id)}
                          disabled={task.isCompleted || stats.energy < task.energyCost || isWorking}
                          className={`w-full ${
                            isWorking && workingTaskId === task.id
                              ? "bg-blue-600 hover:bg-blue-700"
                              : task.isCompleted
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          }`}
                        >
                          {isWorking && workingTaskId === task.id
                            ? `Working... (${Math.round(workProgress)}%)`
                            : task.isCompleted
                              ? "✅ Completed"
                              : "🚀 Start Task"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
