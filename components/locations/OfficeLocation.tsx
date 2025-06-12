"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { GameState } from "@/types/game"
import { Monitor, Coffee, FileText, Lightbulb, Clock, Zap } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface OfficeLocationProps {
  gameState: GameState
  onLocationAction: (actionId: string) => void
}

export function OfficeLocation({ gameState, onLocationAction }: OfficeLocationProps) {
  const [activeActivity, setActiveActivity] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [internalThought, setInternalThought] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const activities = [
    {
      id: "organize-desk",
      name: "Organize Your Desk",
      description: "Marie Kondo would be proud of this workspace transformation",
      icon: Monitor,
      duration: 10, // 10 seconds
      difficulty: "Easy",
      effects: { productivity: 10, burnout: -5 },
      energyCost: 5,
      thoughts: [
        "Where did all these sticky notes come from?",
        "Is this pen even working? *click click*",
        "Found my missing coffee mug! It's... growing something.",
        "Why do I have 47 USB cables but none of them work?",
      ],
    },
    {
      id: "review-emails",
      name: "Check Emails",
      description: "Dive into the digital abyss of your inbox",
      icon: FileText,
      duration: 15, // 15 seconds
      difficulty: "Medium",
      effects: { productivity: 5, exp: 10 },
      energyCost: 8,
      thoughts: [
        "Another meeting that could have been an email...",
        "Why is this marked as 'urgent' from 3 weeks ago?",
        "Reply all... or not reply all? That is the question.",
        "This email chain has more plot twists than a soap opera.",
      ],
    },
    {
      id: "deep-focus",
      name: "Deep Focus Session",
      description: "Enter the zone and become one with your code",
      icon: Lightbulb,
      duration: 25, // 25 seconds
      difficulty: "Hard",
      effects: { productivity: 20, exp: 25, burnout: 5 },
      energyCost: 15,
      thoughts: [
        "I am one with the code, the code is with me...",
        "Wait, why is this variable named 'banana'?",
        "If I stare at this bug long enough, maybe it'll fix itself.",
        "I'm in the matrix now. There is no spoon... only semicolons.",
      ],
    },
    {
      id: "coffee-break",
      name: "Strategic Coffee Break",
      description: "Fuel up with the sacred bean juice",
      icon: Coffee,
      duration: 10, // 10 seconds
      difficulty: "Easy",
      effects: { energy: 15, burnout: -10, productivity: 5 },
      energyCost: 0,
      thoughts: [
        "Coffee: because adulting is hard.",
        "This is my 6th cup today... I regret nothing.",
        "I wonder if coffee counts as a vegetable...",
        "Caffeine is just liquid motivation.",
      ],
    },
  ]

  const handleActivityStart = (activity: any) => {
    if (gameState.stats.energy < activity.energyCost || activeActivity) return

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
        setInternalThought("Task completed! Time to celebrate... or start the next one.")
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
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🖥️</span>
            <span>Your Personal Workspace</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your desk: where productivity meets procrastination, and coffee cups go to die.
          </p>

          {/* Current Status */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{gameState.stats.productivity}</div>
              <div className="text-sm text-gray-500">Productivity</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{gameState.stats.energy}</div>
              <div className="text-sm text-gray-500">Energy</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">{gameState.stats.burnout}</div>
              <div className="text-sm text-gray-500">Burnout</div>
            </div>
          </div>

          {/* Internal Thought */}
          {internalThought && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">💭</span>
                <span className="text-sm italic text-yellow-800 dark:text-yellow-200">"{internalThought}"</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activities */}
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
                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : canPerform
                    ? "hover:shadow-xl hover:scale-105"
                    : "opacity-50"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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

                    {/* Effects */}
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

                    {/* Progress Bar */}
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
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      }`}
                    >
                      {isActive
                        ? `Working... (${Math.round(progress)}%)`
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
