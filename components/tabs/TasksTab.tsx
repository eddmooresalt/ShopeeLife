"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Lock, DollarSign } from "lucide-react"
import type { GameState, Task } from "../../types/game"
import { ProgressDetail } from "../ProgressDetail"

interface TasksTabProps {
  gameState: GameState
  isWorking: boolean
  currentTask: string | null
  taskProgress: number
  tasks: Task[]
  queuedTasks: Task[] // Added queuedTasks prop
  onExecuteTask: (task: Task) => void
  taskProgressRef: React.RefObject<HTMLDivElement> // Added ref for scrolling
}

const TasksTab: React.FC<TasksTabProps> = ({
  gameState,
  isWorking,
  currentTask,
  taskProgress,
  tasks,
  queuedTasks, // Destructure queuedTasks
  onExecuteTask,
  taskProgressRef, // Destructure ref
}) => {
  const currentTaskData = tasks.find((t) => t.id === currentTask)

  const getTaskRequirements = (task: Task) => {
    const requirements = []

    // Level requirement
    if (!task.available(gameState.level)) {
      const minLevel = task.available(0)
        ? 0
        : task.available(1)
          ? 1
          : task.available(2)
            ? 2
            : task.available(3)
              ? 3
              : task.available(4)
                ? 4
                : task.available(5)
                  ? 5
                  : 6
      requirements.push(`Level ${minLevel + 1}+`)
    }

    // Energy requirement
    if (task.energyCost > 0) {
      requirements.push(`${task.energyCost} Energy`)
    }

    // Money requirement
    if (task.moneyGain < 0) {
      requirements.push(`${Math.abs(task.moneyGain)} SC`)
    }

    return requirements
  }

  const getTaskRewards = (task: Task) => {
    const rewards = []

    if (task.experienceGain > 0) rewards.push(`+${task.experienceGain} XP`)
    if (task.productivityGain > 0) rewards.push(`+${task.productivityGain} Productivity`)
    if (task.energyCost < 0) rewards.push(`+${Math.abs(task.energyCost)} Energy`)
    if (task.burnoutGain < 0) rewards.push(`${task.burnoutGain} Burnout`)
    if (task.moneyGain > 0) rewards.push(`+${task.moneyGain} SC`)
    if (task.burnoutGain > 0) rewards.push(`+${task.burnoutGain} Burnout`) // Display positive burnout gain

    return rewards
  }

  const canExecuteTask = (task: Task) => {
    return (
      !isWorking &&
      gameState.energy > 0 &&
      task.available(gameState.level) &&
      (task.energyCost <= 0 || gameState.energy >= task.energyCost) &&
      (task.moneyGain >= 0 || gameState.money >= Math.abs(task.moneyGain))
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>All Available Tasks</CardTitle>
          <CardDescription>Complete tasks to gain experience and advance your career</CardDescription>
        </CardHeader>
        <CardContent>
          {isWorking && currentTask && currentTaskData && (
            <div ref={taskProgressRef}>
              <ProgressDetail
                taskName={currentTaskData.name}
                progress={taskProgress}
                duration={currentTaskData.duration}
                taskType="task"
                taskId={currentTask}
              />
            </div>
          )}

          {queuedTasks.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">Task Queue:</p>
              <ul className="list-disc list-inside text-sm text-blue-700">
                {queuedTasks.map((task, index) => (
                  <li key={task.id + index}>
                    {task.emoji} {task.name} ({task.duration * 5}s)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => {
              const canExecute = canExecuteTask(task)
              const requirements = getTaskRequirements(task)
              const rewards = getTaskRewards(task)
              const isAvailable = task.available(gameState.level)

              return (
                <Card
                  key={task.id}
                  className={`transition-all ${
                    !isAvailable
                      ? "opacity-40 border-gray-300"
                      : !canExecute && isWorking // If a task is running, and this one can't start
                        ? "opacity-70 border-yellow-300"
                        : !canExecute // If no task is running, but this one can't start due to stats
                          ? "opacity-70 border-red-300"
                          : "hover:shadow-md border-green-300"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          !isAvailable
                            ? "bg-gray-100"
                            : !canExecute && isWorking
                              ? "bg-yellow-100"
                              : !canExecute
                                ? "bg-red-100"
                                : "bg-orange-100"
                        }`}
                      >
                        <span
                          className={`text-xl ${
                            !isAvailable
                              ? "text-gray-400"
                              : !canExecute && isWorking
                                ? "text-yellow-600"
                                : !canExecute
                                  ? "text-red-600"
                                  : "text-orange-600"
                          }`}
                        >
                          {task.emoji}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{task.name}</h3>
                          {!isAvailable && (
                            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                              <Lock className="w-3 h-3 mr-1" />
                              Locked
                            </Badge>
                          )}
                          {task.duration && (
                            <Badge variant="outline" className="text-xs">
                              {task.duration * 5}s
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                        {/* Prerequisites */}
                        {requirements.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">📋 Prerequisites:</p>
                            <div className="flex flex-wrap gap-1">
                              {requirements.map((req, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs bg-red-50 text-red-700 border-red-200"
                                >
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Rewards */}
                        {rewards.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">🎁 Rewards:</p>
                            <div className="flex flex-wrap gap-1">
                              {rewards.map((reward, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs bg-green-50 text-green-700 border-green-200"
                                >
                                  {reward}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <Separator className="my-2" />

                        <Button
                          onClick={() => onExecuteTask(task)}
                          disabled={!isAvailable && !isWorking} // Disable if locked and no task running
                          className={`w-full ${
                            !isAvailable
                              ? "bg-gray-300 text-gray-500"
                              : isWorking
                                ? "bg-blue-500 hover:bg-blue-600" // Queue button style
                                : !canExecute
                                  ? "bg-red-300 text-red-800" // Cannot execute due to stats
                                  : "bg-orange-500 hover:bg-orange-600" // Execute button style
                          }`}
                          size="sm"
                        >
                          {!isAvailable ? (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              Requires Higher Level
                            </>
                          ) : isWorking ? (
                            <>
                              <span className="mr-1">➕</span> Queue Task
                            </>
                          ) : !canExecute ? (
                            gameState.energy < task.energyCost ? (
                              "❌ Not Enough Energy"
                            ) : gameState.money < Math.abs(task.moneyGain) ? (
                              "❌ Not Enough ShopeeCoins"
                            ) : (
                              "❌ Cannot Execute"
                            )
                          ) : (
                            <>
                              {task.moneyGain > 0 ? (
                                <>
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  Do Task (+{task.moneyGain} SC)
                                </>
                              ) : task.moneyGain < 0 ? (
                                <>
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  Do Task (-{Math.abs(task.moneyGain)} SC)
                                </>
                              ) : (
                                "Do Task"
                              )}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TasksTab
