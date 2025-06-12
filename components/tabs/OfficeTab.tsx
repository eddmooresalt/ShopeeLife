"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type GameState, type Task, type DailyQuest, QuestType, type WeatherCondition } from "@/types/game"
import { ProgressDetail } from "@/components/ProgressDetail"
import { CheckCircle2, XCircle } from "lucide-react"

interface OfficeTabProps {
  gameState: GameState
  onWork: (taskId: string) => void
  onClaimQuestReward: (questId: string) => void
  dailyQuests: DailyQuest[]
  currentWeather: WeatherCondition
  isWorking: boolean // New prop
  workingTaskId: string | null // New prop
  workProgress: number // New prop
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

  return (
    <div className="p-4 space-y-4">
      {/* Daily Quests Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Daily Quests
            {isBonusTime && !gameState.hasClaimedDailyBonus && (
              <span className="text-sm text-orange-600 dark:text-orange-400 font-normal">Bonus until 6:30 PM!</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-auto max-h-[200px] pr-4">
            {dailyQuests.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No daily quests available.</p>
            ) : (
              <div className="space-y-3">
                {dailyQuests.map((quest) => (
                  <Card key={quest.id} className={quest.isClaimed ? "opacity-60" : ""}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-base">{quest.description}</h4>
                        {quest.isClaimed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : quest.isCompleted ? (
                          <Button onClick={() => onClaimQuestReward(quest.id)} size="sm" className="text-xs px-2 py-1">
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
          </ScrollArea>
          {allQuestsCompleted && !allQuestsClaimed && isBonusTime && (
            <p className="text-center text-sm text-orange-700 dark:text-orange-300 mt-3 font-medium">
              Complete all quests and claim rewards by 6:30 PM for a bonus!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Current Tasks Section */}
      <Card>
        <CardHeader>
          <CardTitle>Current Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-500px)] pr-4">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No tasks available.</p>
            ) : (
              <div className="space-y-4">
                {tasks.map((task: Task) => (
                  <Card key={task.id} className={task.isCompleted ? "opacity-60" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{task.emoji}</span>
                        <h3 className="font-semibold text-lg">{task.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                      {isWorking && workingTaskId === task.id ? (
                        <ProgressDetail label="Working" value={workProgress} maxValue={100} className="mb-2" />
                      ) : (
                        <ProgressDetail
                          label="Progress"
                          value={task.progress}
                          maxValue={task.targetProgress}
                          className="mb-2"
                        />
                      )}
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>
                          Reward: {task.rewardExp} EXP, {task.rewardCoins} SC
                        </span>
                        <span>Energy Cost: {task.energyCost}</span>
                      </div>
                      <Button
                        onClick={() => onWork(task.id)}
                        disabled={task.isCompleted || stats.energy < task.energyCost || isWorking}
                        className="w-full mt-4"
                      >
                        {isWorking && workingTaskId === task.id
                          ? `Working... (${Math.round(workProgress)}%)`
                          : task.isCompleted
                            ? "Completed"
                            : "Work on Task"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
