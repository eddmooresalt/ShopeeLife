"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GameState } from "@/types/game"
import { Coffee, Utensils, Users, MessageSquare } from "lucide-react"
import { formatGameTime } from "@/utils/gameUtils"
import { useState, useEffect, useRef } from "react"

interface PantryLocationProps {
  gameState: GameState
  onLocationAction: (actionId: string) => void
}

export function PantryLocation({ gameState, onLocationAction }: PantryLocationProps) {
  const [activeActivity, setActiveActivity] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [internalThought, setInternalThought] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const activities = [
    {
      id: "coffee-break",
      name: "Coffee Break",
      description: "Enjoy a quick coffee to boost energy",
      icon: Coffee,
      duration: 5, // 5 seconds
      effects: { energy: 15, productivity: 5 },
      thoughts: [
        "This coffee is exactly what I needed!",
        "I can feel the caffeine kicking in already.",
        "One more cup and I'll be unstoppable!",
        "The aroma alone is energizing.",
      ],
    },
    {
      id: "snack-time",
      name: "Grab a Snack",
      description: "Have a quick snack to satisfy hunger",
      icon: Utensils,
      duration: 8, // 8 seconds
      effects: { energy: 10, hunger: -20 },
      thoughts: [
        "These snacks are delicious!",
        "I needed this sugar boost.",
        "I should bring my own healthy snacks tomorrow.",
        "I hope nobody notices me taking extra cookies.",
      ],
    },
    {
      id: "water-cooler-chat",
      name: "Water Cooler Chat",
      description: "Socialize with colleagues",
      icon: Users,
      duration: 12, // 12 seconds
      effects: { social: 20, burnout: -10, energy: 5 },
      thoughts: [
        "Did you hear about the new project?",
        "Office gossip is the best part of the day!",
        "I should get back to work soon...",
        "It's good to connect with colleagues.",
      ],
    },
    {
      id: "team-lunch",
      name: "Team Lunch",
      description: "Have lunch with your team",
      icon: MessageSquare,
      duration: 15, // 15 seconds
      effects: { social: 25, hunger: -30, exp: 10 },
      thoughts: [
        "Team bonding is so important!",
        "The food tastes better with good company.",
        "I'm learning so much about my colleagues.",
        "This is a great break from work.",
      ],
    },
  ]

  const handleActivityStart = (activity: any) => {
    if (activeActivity) return

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
        setInternalThought("That was refreshing! Back to work now.")
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
          <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">☕</span>
                <span>Office Pantry</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Take a break and recharge with snacks, drinks, and casual conversations.
              </p>

              {/* Current Time */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{formatGameTime(gameState.gameTime)}</Badge>
                <Badge variant="secondary">Open 24/7</Badge>
              </div>

              {/* Internal Thought */}
              {internalThought && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-600">💭</span>
                    <span className="text-sm italic text-orange-800 dark:text-orange-200">"{internalThought}"</span>
                  </div>
                </div>
              )}

              {/* Pantry Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">🍪</div>
                  <div className="text-sm">Snacks Available</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600">👥</div>
                  <div className="text-sm">Colleagues Present</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => {
              const Icon = activity.icon
              const isActive = activeActivity === activity.id
              const canPerform = !activeActivity

              return (
                <Card
                  key={activity.id}
                  className={`transition-all duration-200 ${
                    isActive
                      ? "ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20"
                      : !canPerform
                        ? "opacity-50"
                        : "hover:shadow-xl hover:scale-105"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                        <Icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{activity.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{activity.description}</p>
                        <div className="text-xs text-gray-500 mb-3">Duration: {activity.duration}s</div>

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
                              ? "Already Taking a Break"
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
