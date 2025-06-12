"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import type { GameState, Task } from "@/types/game"
import { ProgressDetail } from "@/components/ProgressDetail"

interface TasksTabProps {
  gameState: GameState
  onWork: (taskId: string) => void
  isWorking: boolean // New prop
  workingTaskId: string | null // New prop
  workProgress: number // New prop
}

export function TasksTab({ gameState, onWork, isWorking, workingTaskId, workProgress }: TasksTabProps) {
  const { tasks, stats } = gameState

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
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
