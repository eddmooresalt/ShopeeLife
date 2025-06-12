"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GameState } from "@/types/game"
import { Briefcase, Code, FileText, Mail } from "lucide-react"
import { formatGameTime } from "@/utils/gameUtils"
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
      id: "coding",
      name: "Coding Session",
      description: "Focus on programming tasks",
      icon: Code,
      duration: 15, // 15 seconds
      effects: { productivity: 25, energy: -10, exp: 15 },
      thoughts: [
        "This code is coming together nicely!",
        "I should refactor this later...",
        "Just one more bug to fix...",
        "I'm in the flow state now!",
      ],
    },
    {
      id: "emails",
      name: "Clear Emails",
      description: "Process your inbox",
      icon: Mail,
      duration: 10, // 10 seconds
      effects: { productivity: 15, energy: -5, burnout: 5 },
      thoughts: [
        "So many emails to get through...",
        "Why am I CC'd on this thread?",
        "I should set up better filters.",
        "Finally reaching inbox zero!",
      ],
    },
    {
      id: "documentation",
      name: "Write Documentation",
      description: "Document your work",
      icon: FileText,
      duration: 12, // 12 seconds
      effects: { productivity: 20, energy: -8, exp: 10 },
      thoughts: [
        "Future me will thank present me for this.",
        "I hope someone actually reads this...",
        "This is more time-consuming than I thought.",
        "Good documentation is underrated.",
      ],
    },
    {
      id: "planning",
      name: "Project Planning",
      description: "Plan upcoming work",
      icon: Briefcase,
      duration: 8, // 8 seconds
      effects: { productivity: 15, burnout: -10, exp: 5 },
      thoughts: [
        "Organization is key to success.",
        "I need to prioritize better.",
        "This sprint is going to be challenging.",
        "Planning now saves time later.",
      ],
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
        setInternalThought("Task complete! What's next on my list?")
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
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">💼</span>
                <span>Your Office</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your personal workspace where you can focus on tasks and boost productivity.
              </p>

              {/* Current Time */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{formatGameTime(gameState.gameTime)}</Badge>
                <Badge variant="secondary">Productivity Zone</Badge>
              </div>

              {/* Internal Thought */}
              {internalThought && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">💭</span>
                    <span className="text-sm italic text-blue-800 dark:text-blue-200">"{internalThought}"</span>
                  </div>
                </div>
              )}

              {/* Office Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">💻</div>
                  <div className="text-sm">Workstation Ready</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-indigo-600">🔋</div>
                  <div className="text-sm">Focus Level: High</div>
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
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : !canPerform
                        ? "opacity-50"
                        : "hover:shadow-xl hover:scale-105"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
