"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GameState } from "@/types/game"
import { Dumbbell, Heart, PlayIcon as Run, SpaceIcon as Yoga, StretchVerticalIcon as Stretch } from "lucide-react"
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
      id: "light-cardio",
      name: "Light Cardio",
      description: "A quick run on the treadmill to get the blood flowing.",
      icon: Run,
      duration: 8, // seconds
      effects: { energy: 20, burnout: -15, exp: 10 },
      energyCost: 5,
      thoughts: [
        "Feel the burn... or maybe just a slight warmth.",
        "This is better than sitting all day.",
        "Almost there, just a few more minutes!",
        "I should do this more often.",
      ],
    },
    {
      id: "strength-training",
      name: "Strength Training",
      description: "Lift some weights to build muscle and confidence.",
      icon: Dumbbell,
      duration: 12, // seconds
      effects: { energy: 15, productivity: 20, burnout: -10, exp: 20 },
      energyCost: 10,
      thoughts: [
        "One more rep! You got this!",
        "My muscles are singing... or screaming.",
        "Feeling stronger already!",
        "Is that a bicep I see?",
      ],
    },
    {
      id: "hiit-workout",
      name: "HIIT Workout",
      description: "High-intensity interval training for maximum impact.",
      icon: Heart,
      duration: 15, // seconds
      effects: { energy: 30, productivity: 25, burnout: -20, exp: 30 },
      energyCost: 15,
      thoughts: [
        "I can do this! Just keep pushing!",
        "Why did I sign up for this?",
        "Sweat is just fat crying, right?",
        "Feeling like a superhero!",
      ],
    },
    {
      id: "yoga-session",
      name: "Yoga Session",
      description: "Find your balance and flexibility with a calming yoga flow.",
      icon: Yoga,
      duration: 10, // seconds
      effects: { energy: 25, burnout: -25, productivity: 10, exp: 15 },
      energyCost: 0,
      thoughts: [
        "Breathe in, breathe out. Find your inner peace.",
        "My body is a temple... a very stiff temple.",
        "Namaste, muscles!",
        "Feeling so flexible and calm.",
      ],
    },
    {
      id: "quick-stretch",
      name: "Quick Stretch",
      description: "Loosen up those tight muscles after a long day at the desk.",
      icon: Stretch,
      duration: 5, // seconds
      effects: { energy: 10, burnout: -8, productivity: 5 },
      energyCost: 0,
      thoughts: [
        "Ah, that's better!",
        "My back thanks me.",
        "Just a little stretch, but it makes a difference.",
        "Ready to tackle the next task!",
      ],
    },
  ]

  const handleActivityStart = (activity: any) => {
    if (gameState.stats.energy < activity.energyCost || activeActivity) return

    // Burnout safeguard check
    const potentialBurnout = gameState.stats.burnout + (activity.effects.burnout || 0)
    if ((activity.effects.burnout || 0) > 0 && potentialBurnout > 100) {
      setInternalThought("Cannot start activity: This would cause too much burnout.")
      return
    }

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
        setInternalThought("Workout complete! Feeling strong and refreshed.")
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
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900 dark:to-orange-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🏋️</span>
                <span>Office Gym</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                A state-of-the-art gym to help you stay fit and de-stress.
              </p>

              {/* Current Conditions */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{formatGameTime(gameState.gameTime)}</Badge>
                <Badge variant="default">{gameState.currentWeather?.type || "Sunny"}</Badge>
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
                  <div className="text-lg font-bold text-red-600">🔥</div>
                  <div className="text-sm">Calories Burned</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">💪</div>
                  <div className="text-sm">Strength Gained</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => {
              const Icon = activity.icon
              const canPerform = gameState.stats.energy >= activity.energyCost && !activeActivity
              const isActive = activeActivity === activity.id
              const willExceedBurnout =
                gameState.stats.burnout + (activity.effects.burnout || 0) > 100 && (activity.effects.burnout || 0) > 0

              return (
                <Card
                  key={activity.id}
                  className={`transition-all duration-200 ${
                    isActive
                      ? "ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20"
                      : !canPerform || willExceedBurnout
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
                          Duration: {activity.duration}s • Energy: {activity.energyCost}
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
                          disabled={!canPerform || willExceedBurnout}
                          className="w-full"
                          size="sm"
                        >
                          {isActive
                            ? `In progress... (${Math.round(progress)}%)`
                            : willExceedBurnout
                              ? "Burnout Risk Too High"
                              : !canPerform
                                ? "Not Enough Energy"
                                : "Start Activity"}
                        </Button>
                        {willExceedBurnout && (
                          <p className="text-red-500 text-xs mt-1 text-center">
                            This activity would cause too much burnout.
                          </p>
                        )}
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
