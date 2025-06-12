"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GameState } from "@/types/game"
import { Flower, Sun, Wind, Camera, Leaf } from "lucide-react"
import { formatGameTime } from "@/utils/gameUtils"
import { useState, useEffect, useRef } from "react"

interface RooftopGardenLocationProps {
  gameState: GameState
  onLocationAction: (actionId: string) => void
}

export function RooftopGardenLocation({ gameState, onLocationAction }: RooftopGardenLocationProps) {
  const [activeActivity, setActiveActivity] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [internalThought, setInternalThought] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentHour = Math.floor(gameState.gameTime / 60) % 24
  const isGoldenHour = (currentHour >= 6 && currentHour <= 8) || (currentHour >= 17 && currentHour <= 19)

  const activities = [
    {
      id: "meditation",
      name: "Peaceful Meditation",
      description: "Find inner peace among the plants",
      icon: Leaf,
      duration: 10, // 10 seconds
      effects: { burnout: -20, energy: 10 },
      energyCost: 0,
      bonus: isGoldenHour ? { burnout: -5 } : null,
      thoughts: [
        "Breathe in... breathe out...",
        "I am one with the plants...",
        "My mind is clear like the sky...",
        "Ommmmmm...",
      ],
    },
    {
      id: "garden-walk",
      name: "Garden Stroll",
      description: "Take a relaxing walk through the garden",
      icon: Flower,
      duration: 8, // 8 seconds
      effects: { energy: 15, burnout: -10 },
      energyCost: 5,
      thoughts: [
        "These flowers are so beautiful!",
        "I should take more walks during the day.",
        "The air feels so fresh up here.",
        "I wonder who takes care of all these plants?",
      ],
    },
    {
      id: "fresh-air",
      name: "Breathe Fresh Air",
      description: "Enjoy the clean outdoor air",
      icon: Wind,
      duration: 5, // 5 seconds
      effects: { energy: 20, productivity: 5 },
      energyCost: 0,
      thoughts: [
        "This air is so much better than the recycled office air.",
        "I can feel my lungs thanking me.",
        "Why don't I come up here more often?",
        "I feel refreshed already!",
      ],
    },
    {
      id: "photo-session",
      name: "Take Photos",
      description: "Capture the beauty of the garden",
      icon: Camera,
      duration: 12, // 12 seconds
      effects: { exp: 25, social: 10 },
      energyCost: 8,
      bonus: isGoldenHour ? { exp: 10 } : null,
      thoughts: [
        "This lighting is perfect!",
        "This is definitely going on my social media.",
        "I should become a plant photographer.",
        "The view from up here is incredible!",
      ],
    },
    {
      id: "sunbathe",
      name: "Sunbathe",
      description: "Soak up some vitamin D",
      icon: Sun,
      duration: 15, // 15 seconds
      effects: { energy: 25, burnout: -15 },
      energyCost: 0,
      requiresSun: true,
      thoughts: [
        "Vitamin D, come to me!",
        "I hope I don't get sunburned...",
        "This is so much better than sitting under fluorescent lights.",
        "I could fall asleep right here...",
      ],
    },
  ]

  const handleActivityStart = (activity: any) => {
    if (gameState.stats.energy < activity.energyCost || activeActivity) return
    if (
      activity.requiresSun &&
      !(weatherCondition === "Sunny" || weatherCondition === "Sunrise" || weatherCondition === "Sunset")
    )
      return

    setActiveActivity(activity.id)
    setProgress(0)
    setInternalThought(activity.thoughts[Math.floor(Math.random() * activity.thoughts.length)])

    const duration = activity.duration * 1000 // Convert to milliseconds
    const startTime = Date.now()

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(100, (elapsed / duration) * 100)
      setProgress(newProgress)

      // Add random thoughts during activity
      if (newProgress > 25 && newProgress < 30) {
        setInternalThought(activity.thoughts[Math.floor(Math.random() * activity.thoughts.length)])
      } else if (newProgress > 60 && newProgress < 65) {
        setInternalThought(activity.thoughts[Math.floor(Math.random() * activity.thoughts.length)])
      }

      if (newProgress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current)
        setActiveActivity(null)
        setProgress(0)
        setInternalThought("That was refreshing! I feel so much better now.")
        onLocationAction(activity.id)

        // Clear thought after completion
        setTimeout(() => setInternalThought(null), 3000)
      }
    }, 100)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const weatherCondition = gameState.currentWeather?.type || "Sunny"
  const isSunny = weatherCondition === "Sunny" || weatherCondition === "Sunrise" || weatherCondition === "Sunset"

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4 pb-28">
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

              {/* Internal Thought */}
              {internalThought && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">💭</span>
                    <span className="text-sm italic text-green-800 dark:text-green-200">"{internalThought}"</span>
                  </div>
                </div>
              )}

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
              const canPerform = gameState.stats.energy >= activity.energyCost && !activeActivity
              const isAvailable = !activity.requiresSun || isSunny
              const isActive = activeActivity === activity.id
              const totalEffects = { ...activity.effects }

              // Add bonus effects if applicable
              if (activity.bonus && isGoldenHour) {
                Object.entries(activity.bonus).forEach(([stat, value]) => {
                  totalEffects[stat as keyof typeof totalEffects] =
                    (totalEffects[stat as keyof typeof totalEffects] || 0) + value
                })
              }

              return (
                <Card
                  key={activity.id}
                  className={`transition-all duration-200 ${
                    isActive
                      ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20"
                      : !canPerform || !isAvailable
                        ? "opacity-50"
                        : "hover:shadow-xl hover:scale-105"
                  }`}
                >
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
                          Duration: {activity.duration}s • Energy: {activity.energyCost}
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

                        {/* Progress Bar */}
                        {isActive && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        )}

                        <Button
                          onClick={() => handleActivityStart(activity)}
                          disabled={!canPerform || !isAvailable}
                          className="w-full"
                          size="sm"
                        >
                          {isActive
                            ? `In progress... (${Math.round(progress)}%)`
                            : !isAvailable
                              ? "Weather Not Suitable"
                              : !canPerform
                                ? "Not Enough Energy"
                                : "Enjoy Activity"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
