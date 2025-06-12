"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { GameState } from "@/types/game"
import { Coffee, Users, Utensils, MessageCircle, Clock, Zap } from "lucide-react"
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
      id: "coffee-chat",
      name: "Coffee & Gossip",
      description: "The real office news network happens here",
      icon: Coffee,
      duration: 12, // 12 seconds
      difficulty: "Easy",
      effects: { energy: 10, social: 15, exp: 5 },
      energyCost: 3,
      thoughts: [
        "Did you hear about the printer on floor 2? It's become sentient.",
        "Apparently, someone microwaved fish again. The horror.",
        "The coffee machine is making weird noises... should we be concerned?",
        "I heard the CEO actually uses Comic Sans in their presentations.",
      ],
    },
    {
      id: "microwave-mastery",
      name: "Microwave Culinary Arts",
      description: "Transform leftovers into... slightly warmer leftovers",
      icon: Utensils,
      duration: 18, // 18 seconds
      difficulty: "Medium",
      effects: { energy: 20, productivity: 5, social: 5 },
      energyCost: 5,
      thoughts: [
        "Is 3 minutes too long for leftover pizza? Asking for a friend.",
        "Why does everything smell like popcorn in here?",
        "The microwave timer is broken, so I'm just guessing at this point.",
        "I'm pretty sure this container is older than my career here.",
      ],
    },
    {
      id: "team-bonding",
      name: "Impromptu Team Meeting",
      description: "When the pantry becomes an unofficial conference room",
      icon: Users,
      duration: 25, // 25 seconds
      difficulty: "Hard",
      effects: { social: 25, productivity: 10, exp: 15 },
      energyCost: 10,
      thoughts: [
        "How did a coffee break turn into a project planning session?",
        "We're solving world hunger while waiting for the kettle to boil.",
        "This is either the best idea ever or we need more caffeine.",
        "I love how we're redesigning the entire system over instant noodles.",
      ],
    },
    {
      id: "snack-hunt",
      name: "Emergency Snack Procurement",
      description: "Raid the communal snack stash like a professional",
      icon: MessageCircle,
      duration: 8, // 8 seconds
      difficulty: "Easy",
      effects: { energy: 15, burnout: -8 },
      energyCost: 2,
      thoughts: [
        "Who ate all the good cookies and left only the healthy ones?",
        "Is it socially acceptable to take the last donut? Asking for science.",
        "These crackers expired in 2019... they're probably fine, right?",
        "I'm not addicted to office snacks, I can quit anytime I want.",
      ],
    },
  ]

  const handleActivityStart = (activity: any) => {
    if (gameState.stats.energy < activity.energyCost || activeActivity) return

    setActiveActivity(activity.id)
    setProgress(0)
    setInternalThought(activity.thoughts[Math.floor(Math.random() * activity.thoughts.length)])

    const duration = activity.duration * 1000
    const startTime = Date.now()

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(100, (elapsed / duration) * 100)
      setProgress(newProgress)

      if (newProgress > 30 && newProgress < 35) {
        setInternalThought(activity.thoughts[Math.floor(Math.random() * activity.thoughts.length)])
      } else if (newProgress > 70 && newProgress < 75) {
        setInternalThought(activity.thoughts[Math.floor(Math.random() * activity.thoughts.length)])
      }

      if (newProgress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current)
        setActiveActivity(null)
        setProgress(0)
        setInternalThought("Mission accomplished! Time to return to the desk... eventually.")
        onLocationAction(activity.id)
        setTimeout(() => setInternalThought(null), 3000)
      }
    }, 100)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">☕</span>
            <span>Office Pantry</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The social hub of the office. Where caffeine meets conversation and microwaves meet their doom.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{gameState.stats.energy}</div>
              <div className="text-sm text-gray-500">Energy</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{gameState.stats.social || 50}</div>
              <div className="text-sm text-gray-500">Social</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">{100 - gameState.stats.burnout}</div>
              <div className="text-sm text-gray-500">Mood</div>
            </div>
          </div>

          {internalThought && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-orange-600">💭</span>
                <span className="text-sm italic text-orange-800 dark:text-orange-200">"{internalThought}"</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map((activity) => {
          const Icon = activity.icon
          const canPerform = gameState.stats.energy >= activity.energyCost && !activeActivity
          const isActive = activeActivity === activity.id

          return (
            <Card
              key={activity.id}
              className={`transition-all duration-200 border-0 shadow-lg ${
                isActive
                  ? "ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20"
                  : canPerform
                    ? "hover:shadow-xl hover:scale-105"
                    : "opacity-50"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{activity.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(activity.difficulty)}`}
                      >
                        {activity.difficulty}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{activity.description}</p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{activity.duration}s</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>{activity.energyCost} energy</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
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

                    {isActive && (
                      <div className="mb-4">
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
                      className={`w-full ${
                        isActive
                          ? "bg-orange-600 hover:bg-orange-700"
                          : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                      }`}
                    >
                      {isActive
                        ? `In Progress... (${Math.round(progress)}%)`
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
  )
}
