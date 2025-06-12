"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { GameState } from "@/types/game"
import { Flower, Sun, Wind, Camera, Leaf } from "lucide-react"
import { formatGameTime } from "@/utils/gameUtils"

interface RooftopGardenLocationProps {
  gameState: GameState
  onLocationAction: (actionId: string) => void
}

export function RooftopGardenLocation({ gameState, onLocationAction }: RooftopGardenLocationProps) {
  const currentHour = Math.floor(gameState.gameTime / 60) % 24
  const isGoldenHour = (currentHour >= 6 && currentHour <= 8) || (currentHour >= 17 && currentHour <= 19)

  const activities = [
    {
      id: "meditation",
      name: "Peaceful Meditation",
      description: "Find inner peace among the plants",
      icon: Leaf,
      duration: "10 minutes",
      effects: { burnout: -20, energy: 10 },
      energyCost: 0,
      bonus: isGoldenHour ? { burnout: -5 } : null,
    },
    {
      id: "garden-walk",
      name: "Garden Stroll",
      description: "Take a relaxing walk through the garden",
      icon: Flower,
      duration: "8 minutes",
      effects: { energy: 15, burnout: -10 },
      energyCost: 5,
    },
    {
      id: "fresh-air",
      name: "Breathe Fresh Air",
      description: "Enjoy the clean outdoor air",
      icon: Wind,
      duration: "5 minutes",
      effects: { energy: 20, productivity: 5 },
      energyCost: 0,
    },
    {
      id: "photo-session",
      name: "Take Photos",
      description: "Capture the beauty of the garden",
      icon: Camera,
      duration: "12 minutes",
      effects: { exp: 25, social: 10 },
      energyCost: 8,
      bonus: isGoldenHour ? { exp: 10 } : null,
    },
    {
      id: "sunbathe",
      name: "Sunbathe",
      description: "Soak up some vitamin D",
      icon: Sun,
      duration: "15 minutes",
      effects: { energy: 25, burnout: -15 },
      energyCost: 0,
      requiresSun: true,
    },
  ]

  const weatherCondition = gameState.currentWeather?.type || "Sunny"
  const isSunny = weatherCondition === "Sunny" || weatherCondition === "Sunrise" || weatherCondition === "Sunset"

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🌳</span>
            <span>Rooftop Garden</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            A peaceful oasis above the bustling office. Perfect for relaxation and rejuvenation.
          </p>

          {/* Current Conditions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">{formatGameTime(gameState.gameTime)}</Badge>
            <Badge variant={isSunny ? "default" : "secondary"}>{weatherCondition}</Badge>
            {isGoldenHour && <Badge className="bg-yellow-500 text-white">Golden Hour - Bonus Effects!</Badge>}
          </div>

          {/* Garden Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-lg font-bold text-green-600">🌱</div>
              <div className="text-sm">Plants Thriving</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-lg font-bold text-blue-600">🦋</div>
              <div className="text-sm">Wildlife Active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          const canPerform = gameState.stats.energy >= activity.energyCost
          const isAvailable = !activity.requiresSun || isSunny
          const totalEffects = { ...activity.effects }

          // Add bonus effects if applicable
          if (activity.bonus && isGoldenHour) {
            Object.entries(activity.bonus).forEach(([stat, value]) => {
              totalEffects[stat as keyof typeof totalEffects] =
                (totalEffects[stat as keyof typeof totalEffects] || 0) + value
            })
          }

          return (
            <Card key={activity.id} className={!canPerform || !isAvailable ? "opacity-50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{activity.name}</h3>
                      {activity.bonus && isGoldenHour && (
                        <Badge className="bg-yellow-500 text-white text-xs">Bonus!</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{activity.description}</p>
                    <div className="text-xs text-gray-500 mb-3">
                      Duration: {activity.duration} • Energy: {activity.energyCost}
                      {activity.requiresSun && !isSunny && " • Requires Sunny Weather"}
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
                      disabled={!canPerform || !isAvailable}
                      className="w-full"
                      size="sm"
                    >
                      {!isAvailable ? "Weather Not Suitable" : !canPerform ? "Not Enough Energy" : "Enjoy Activity"}
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
