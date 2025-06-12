"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GameState } from "@/types/game"
import { Dumbbell, Timer, Heart, Zap } from "lucide-react"
import { formatGameTime } from "@/utils/gameUtils"
import { useState, useEffect, useRef } from "react"

interface GymLocationProps {
  gameState: GameState
  onLocationAction: (actionId: string) => void
}

export function GymLocation({ gameState, onLocationAction }: GymLocationProps) {
  const [activeActivity, setActiveActivity] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [internalThought, setInternalThought] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const activities = [
    {
      id: "treadmill",
      name: "Treadmill Run",
      description: "Get your cardio in with a quick run",
      icon: Timer,
      duration: 15, // 15 seconds
      effects: { energy: -10, health: 20, burnout: -15 },
      thoughts: [
        "I can feel my heart pumping!",
        "Just a few more minutes...",
        "I should do this more often.",
        "Running to success!",
      ],
    },
    {
      id: "weights",
      name: "Weight Training",
      description: "Build strength with weights",
      icon: Dumbbell,
      duration: 20, // 20 seconds
      effects: { energy: -15, health: 25, burnout: -10 },
      thoughts: [
        "No pain, no gain!",
        "I'm getting stronger every day.",
        "One more rep!",
        "I'll be as strong as the CEO soon!",
      ],
    },
    {
      id: "stretching",
      name: "Stretching Session",
      description: "Improve flexibility and reduce stress",
      icon: Heart,
      duration: 10, // 10 seconds
      effects: { energy: 5, health: 10, burnout: -20 },
      thoughts: [
        "I can feel the tension melting away.",
        "So relaxing...",
        "My muscles thank me.",
        "I should stretch more during work hours.",
      ],
    },
    {
      id: "hiit",
      name: "HIIT Workout",
      description: "High intensity interval training",
      icon: Zap,
      duration: 18, // 18 seconds
      effects: { energy: -20, health: 30, burnout: -15, exp: 20 },
      thoughts: ["This is intense!", "Push through the pain!", "Almost there!", "I'm going to feel this tomorrow..."],
    },
  ]

  const handleActivityStart = (activity: any) => {
    if (gameState.stats.energy < Math.abs(activity.effects.energy) || activeActivity) return

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
        setInternalThought("Workout complete! I feel great!")
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

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4 pb-28">
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">💪</span>
                <span>Shopee Fitness Center</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Stay fit and healthy with our state-of-the-art gym facilities.
              </p>

              {/* Current Time */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{formatGameTime(gameState.gameTime)}</Badge>
                <Badge variant="secondary">Open 6:00 AM - 10:00 PM</Badge>
              </div>

              {/* Internal Thought */}
              {internalThought && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600">💭</span>
                    <span className="text-sm italic text-red-800 dark:text-red-200">"{internalThought}"</span>
                  </div>
                </div>
              )}

              {/* Gym Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-red-600">🏋️</div>
                  <div className="text-sm">Equipment Available</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">👥</div>
                  <div className="text-sm">Low Crowd</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => {
              const Icon = activity.icon
              const canPerform = gameState.stats.energy >= Math.abs(activity.effects.energy) && !activeActivity
              const isActive = activeActivity === activity.id

              return (
                <Card
                  key={activity.id}
                  className={`transition-all duration-200 ${
                    isActive
                      ? "ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20"
                      : !canPerform
                        ? "opacity-50"
                        : "hover:shadow-xl hover:scale-105"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                        <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{activity.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{activity.description}</p>
                        <div className="text-xs text-gray-500 mb-3">
                          Duration: {activity.duration}s • Energy: {Math.abs(activity.effects.energy)}
                        </div>

                        {/* Effects */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {Object.entries(activity.effects).map(([stat, value]) => (
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
                          disabled={!canPerform}
                          className="w-full"
                          size="sm"
                        >
                          {isActive
                            ? `In progress... (${Math.round(progress)}%)`
                            : !canPerform
                              ? "Not Enough Energy"
                              : "Start Activity"}
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
