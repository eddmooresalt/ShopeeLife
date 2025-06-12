"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { type GameState, type Task, type DailyQuest, QuestType, type WeatherCondition } from "@/types/game"
import { ProgressDetail } from "@/components/ProgressDetail"
import { CheckCircle2, XCircle, Sun, Coffee, Sparkles } from "lucide-react"
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

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
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

          {/* Daily Quests Section */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6" />
                  <span>Daily Quests</span>
                </div>
                {isBonusTime && !gameState.hasClaimedDailyBonus && (
                  <Badge className="bg-yellow-500 text-yellow-900 animate-pulse">Bonus until 6:30 PM!</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {dailyQuests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-gray-500 dark:text-gray-400">No daily quests available.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dailyQuests.map((quest) => (
                    <Card
                      key={quest.id}
                      className={`transition-all duration-200 ${
                        quest.isClaimed
                          ? "opacity-60 bg-green-50 dark:bg-green-900/20 border-green-200"
                          : quest.isCompleted
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200"
                            : "hover:shadow-md"
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-base">{quest.description}</h4>
                          {quest.isClaimed ? (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm font-medium">Claimed</span>
                            </div>
                          ) : quest.isCompleted ? (
                            <Button
                              onClick={() => onClaimQuestReward(quest.id)}
                              size="sm"
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            >
                              Claim Reward
                            </Button>
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        {!quest.isCompleted && (
                          <ProgressDetail
                            label="Progress"
                            value={quest.currentProgress}
                            maxValue={quest.targetValue || 1}
                            className="mb-1"
                          />
                        )}
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            Reward: {quest.rewardExp} EXP, {quest.rewardCoins} SC
                          </span>
                          {quest.type === QuestType.Stat && quest.criteria?.statName && (
                            <span>
                              Target {quest.criteria.statName}: {quest.targetValue}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {allQuestsCompleted && !allQuestsClaimed && isBonusTime && (
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <p className="text-center text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                    🎉 Complete all quests and claim rewards by 6:30 PM for a bonus! 🎉
                  </p>
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
