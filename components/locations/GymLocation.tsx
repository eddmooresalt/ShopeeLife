"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { GameState } from "@/types/game"
import { Dumbbell, Heart, Zap, Target, Timer } from "lucide-react"
import { formatGameTime } from "@/utils/gameUtils"

interface GymLocationProps {
  gameState: GameState
  onLocationAction: (actionId: string) => void
}

export function GymLocation({ gameState, onLocationAction }: GymLocationProps) {
  const currentHour = Math.floor(gameState.gameTime / 60) % 24
  const isPeakHours = (currentHour >= 12 && currentHour <= 14) || (currentHour >= 17 && currentHour <= 19)

  const activities = [
    {
      id: "light-cardio",
      name: "Light Cardio",
      description: "Gentle exercise to get your blood flowing",
      icon: Heart,
      duration: "15 minutes",
      effects: { energy: 20, burnout: -15, exp: 10 },
      energyCost: 10,
      difficulty: "Easy",
    },
    {
      id: "strength-training",
      name: "Strength Training",
      description: "Build muscle and mental resilience",
      icon: Dumbbell,
      duration: "25 minutes",
      effects: { energy: 15, productivity: 20, burnout: -10, exp: 20 },
      energyCost: 20,
      difficulty: "Medium",
    },
    {
      id: "hiit-workout",
      name: "HIIT Workout",
      description: "High-intensity interval training",
      icon: Zap,
      duration: "20 minutes",
      effects: { energy: 30, productivity: 25, burnout: -20, exp: 30 },
      energyCost: 25,
      difficulty: "Hard",
      bonus: isPeakHours ? { exp: 10 } : null,
    },
    {
      id: "yoga-session",
      name: "Yoga & Stretching",
      description: "Improve flexibility and mindfulness",
      icon: Target,
      duration: "30 minutes",
      effects: { energy: 25, burnout: -25, productivity: 10, exp: 15 },
      energyCost: 8,
      difficulty: "Easy",
    },
    {
      id: "quick-stretch",
      name: "Quick Stretch",
      description: "5-minute desk break stretches",
      icon: Timer,
      duration: "5 minutes",
      effects: { energy: 10, burnout: -8, productivity: 5 },
      energyCost: 3,
      difficulty: "Easy",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700"
      case "Medium":
        return "bg-yellow-100 text-yellow-700"
      case "Hard":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900 dark:to-orange-900">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">💪</span>
            <span>Office Gym</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Stay fit and healthy! Exercise boosts energy, productivity, and reduces burnout.
          </p>

          {/* Current Status */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">{formatGameTime(gameState.gameTime)}</Badge>
            <Badge variant={isPeakHours ? "default" : "secondary"}>
              {isPeakHours ? "Peak Hours - Bonus XP!" : "Regular Hours"}
            </Badge>
          </div>

          {/* Fitness Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{gameState.stats.energy}</div>
              <div className="text-sm text-gray-500">Energy</div>
              <Progress value={gameState.stats.energy} className="h-2 mt-1" />
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{gameState.stats.productivity}</div>
              <div className="text-sm text-gray-500">Productivity</div>
              <Progress value={gameState.stats.productivity} className="h-2 mt-1" />
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{100 - gameState.stats.burnout}</div>
              <div className="text-sm text-gray-500">Wellness</div>
              <Progress value={100 - gameState.stats.burnout} className="h-2 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          const canPerform = gameState.stats.energy >= activity.energyCost
          const totalEffects = { ...activity.effects }

          // Add bonus effects if applicable
          if (activity.bonus && isPeakHours) {
            Object.entries(activity.bonus).forEach(([stat, value]) => {
              totalEffects[stat as keyof typeof totalEffects] =
                (totalEffects[stat as keyof typeof totalEffects] || 0) + value
            })
          }

          return (
            <Card key={activity.id} className={!canPerform ? "opacity-50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{activity.name}</h3>
                      <Badge className={getDifficultyColor(activity.difficulty)}>{activity.difficulty}</Badge>
                      {activity.bonus && isPeakHours && (
                        <Badge className="bg-orange-500 text-white text-xs">Bonus!</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{activity.description}</p>
                    <div className="text-xs text-gray-500 mb-3">
                      Duration: {activity.duration} • Energy Cost: {activity.energyCost}
                    </div>

                    {/* Effects */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {Object.entries(totalEffects).map(([stat, value]) => (
                        <span
                          key={stat}
                          className={`text-xs px-2 py-1 rounded ${
                            value > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {value > 0 ? "+" : ""}
                          {value} {stat}
                        </span>
                      ))}
                    </div>

                    <Button
                      onClick={() => onLocationAction(activity.id)}
                      disabled={!canPerform}
                      className="w-full"
                      size="sm"
                    >
                      {canPerform ? "Start Workout" : "Not Enough Energy"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
