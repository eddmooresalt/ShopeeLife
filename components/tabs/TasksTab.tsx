"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" // Import Tooltip components
import type { GameState, Task } from "@/types/game"
import { ProgressDetail } from "@/components/ProgressDetail"

interface TasksTabProps {
  gameState: GameState
  onWork: (taskId: string) => void
  isWorking: boolean
  workingTaskId: string | null
  workProgress: number
}

export function TasksTab({ gameState, onWork, isWorking, workingTaskId, workProgress }: TasksTabProps) {
  const { tasks, stats } = gameState

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-24">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.map((task: Task) => {
                    const willExceedBurnout =
                      (task.burnoutEffect || 0) > 0 && stats.burnout + (task.burnoutEffect || 0) > 100

                    return (
                      <TooltipProvider key={task.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Card
                              className={`transition-all duration-200 ${
                                task.isCompleted
                                  ? "opacity-60 bg-green-50 dark:bg-green-900/20 border-green-200"
                                  : isWorking || willExceedBurnout
                                    ? "opacity-50 cursor-not-allowed"
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
                                  <ProgressDetail
                                    label="Working"
                                    value={workProgress}
                                    maxValue={100}
                                    className="mb-3"
                                  />
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
                                  {task.burnoutEffect && (
                                    <span
                                      className={`text-xs px-2 py-1 rounded ${
                                        task.burnoutEffect > 0
                                          ? "bg-red-100 text-red-700"
                                          : "bg-green-100 text-green-700"
                                      }`}
                                    >
                                      Burnout: {task.burnoutEffect > 0 ? "+" : ""}
                                      {task.burnoutEffect}
                                    </span>
                                  )}
                                </div>

                                <Button
                                  onClick={() => onWork(task.id)}
                                  disabled={
                                    task.isCompleted || stats.energy < task.energyCost || isWorking || willExceedBurnout
                                  }
                                  className={`w-full ${
                                    isWorking && workingTaskId === task.id
                                      ? "bg-blue-600 hover:bg-blue-700"
                                      : task.isCompleted
                                        ? "bg-green-500 hover:bg-green-600"
                                        : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                                  }`}
                                >
                                  {isWorking && workingTaskId === task.id
                                    ? `Working... (${Math.round(workProgress)}%)`
                                    : task.isCompleted
                                      ? "✅ Completed"
                                      : willExceedBurnout
                                        ? "Burnout Risk Too High"
                                        : "🚀 Start Task"}
                                </Button>
                              </CardContent>
                            </Card>
                          </TooltipTrigger>
                          {willExceedBurnout && (
                            <TooltipContent className="bg-red-600 text-white">
                              <p>This task would cause your burnout to exceed 100%.</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
