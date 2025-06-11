"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Award, Clock, Zap, Brain, AlertTriangle } from "lucide-react"
import type { GameState, Role, Task, GameTime } from "../../types/game"
import { getEnergyColor, getProductivityColor, getBurnoutColor } from "../../utils/gameUtils"
import { ProgressDetail } from "../ProgressDetail"

interface OfficeTabProps {
  gameState: GameState
  currentRole: Role
  nextRole: Role
  canLevelUp: boolean
  isWorking: boolean
  currentTask: string | null
  taskProgress: number
  tasks: Task[]
  queuedTasks: Task[] // Added queuedTasks prop
  onLevelUp: () => void
  onExecuteTask: (task: Task) => void
  taskProgressRef: React.RefObject<HTMLDivElement> // Added ref for scrolling
  gameTime: GameTime // Added gameTime for weather
  dailyWeather: { emoji: string; description: string } | null // Added dailyWeather
}

export const OfficeTab: React.FC<OfficeTabProps> = ({
  gameState,
  currentRole,
  nextRole,
  canLevelUp,
  isWorking,
  currentTask,
  taskProgress,
  tasks,
  queuedTasks, // Destructure queuedTasks
  onLevelUp,
  onExecuteTask,
  taskProgressRef, // Destructure ref
  gameTime, // Destructure gameTime
  dailyWeather, // Destructure dailyWeather
}) => {
  const currentTaskData = tasks.find((t) => t.id === currentTask)

  const getWeatherDisplay = (hour: number, dailyWeather: { emoji: string; description: string } | null) => {
    if (hour >= 6 && hour < 9) {
      return { emoji: "🌅", description: "Sunrise" }
    } else if (hour >= 9 && hour < 17) {
      return dailyWeather || { emoji: "☀️", description: "Sunny" } // Use daily weather for daytime
    } else if (hour >= 17 && hour < 19) {
      return { emoji: "🌇", description: "Sunset" }
    } else {
      return { emoji: "🌃", description: "Night Time" }
    }
  }

  const weather = getWeatherDisplay(gameTime.hour, dailyWeather)

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Panel */}
        <div className="lg:col-span-1">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Career Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{currentRole.title}</span>
                  <Badge variant="secondary">{gameState.money.toLocaleString()} SC</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{currentRole.description}</p>

                {canLevelUp && (
                  <Button onClick={onLevelUp} className="w-full bg-orange-500 hover:bg-orange-600">
                    Promote to {nextRole.title}!
                  </Button>
                )}

                {!canLevelUp && gameState.level < 7 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress to {nextRole.title}</span>
                      <span>
                        {gameState.experience}/{nextRole.experienceRequired} XP
                      </span>
                    </div>
                    <Progress value={(gameState.experience / nextRole.experienceRequired) * 100} className="h-2" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Time & Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>📅 Day:</span>
                  <span className="font-medium">{gameState.day}</span>
                </div>
                <div className="flex justify-between">
                  <span>🕐 Time:</span>
                  <span className="font-medium">{gameTime.hour}:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>☀️ Weather:</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <span className="text-lg">{weather.emoji}</span> {weather.description}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>💼 Status:</span>
                  <Badge variant={gameState.hour >= 18 ? "secondary" : "default"}>
                    {gameState.hour >= 18 ? "Off Work" : "Working Hours"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Bars */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Energy</span>
                  </div>
                  <span className="text-sm">{gameState.energy}/100</span>
                </div>
                <Progress value={gameState.energy} className={`h-3 ${getEnergyColor(gameState.energy)}`} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Productivity</span>
                  </div>
                  <span className="text-sm">{gameState.productivity}/100</span>
                </div>
                <Progress
                  value={gameState.productivity}
                  className={`h-3 ${getProductivityColor(gameState.productivity)}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">Burnout</span>
                  </div>
                  <span className="text-sm">{gameState.burnout}/100</span>
                </div>
                <Progress value={gameState.burnout} className={`h-3 ${getBurnoutColor(gameState.burnout)}`} />
              </div>

              {gameState.burnout > 70 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm font-medium">High Burnout Warning!</p>
                  <p className="text-red-600 text-xs">Take a break to avoid productivity loss</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Tasks Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Essential daily tasks at your fingertips</CardDescription>
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

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tasks
                  .filter((task) => task.available(gameState.level))
                  .slice(0, 6)
                  .map((task) => {
                    const canExecute =
                      !isWorking &&
                      gameState.energy > 0 &&
                      (task.energyCost <= 0 || gameState.energy >= task.energyCost)

                    return (
                      <Button
                        key={task.id}
                        onClick={() => onExecuteTask(task)}
                        disabled={!canExecute && isWorking} // Disable if a task is running and this isn't the current one
                        variant="outline"
                        className="h-20 flex flex-col gap-1 p-2"
                      >
                        <span className="text-xl">{task.emoji}</span>
                        <span className="text-xs">{task.name}</span>
                        {isWorking && !canExecute && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Queue
                          </Badge>
                        )}
                      </Button>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
