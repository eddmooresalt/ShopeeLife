"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import type { GameState } from "@/types/game"
import { TableIcon as Toilet } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface ToiletLocationProps {
  gameState: GameState
  onLocationAction: (actionId: string) => void
  onActionStart: () => void // Keep this prop, but its implementation in page.tsx will no longer pause time
  onToiletActionCompleteRedirect: () => void
}

export function ToiletLocation({
  gameState,
  onLocationAction,
  onActionStart,
  onToiletActionCompleteRedirect,
}: ToiletLocationProps) {
  const [actionProgress, setActionProgress] = useState(0)
  const [isActionInProgress, setIsActionInProgress] = useState(false)
  const [currentActionId, setCurrentActionId] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const actionDuration = 10000 // 10 seconds for the progress bar

  useEffect(() => {
    if (isActionInProgress) {
      onActionStart() // Call this, but it won't pause time anymore
      setActionProgress(0) // Reset progress when a new action starts
      const startTime = Date.now()
      intervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime
        const progress = Math.min(100, (elapsedTime / actionDuration) * 100)
        setActionProgress(progress)

        if (progress >= 100) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          setIsActionInProgress(false)
          if (currentActionId) {
            onLocationAction(currentActionId) // Perform the action after progress completes
          }
          setCurrentActionId(null)
          onToiletActionCompleteRedirect()
        }
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActionInProgress, currentActionId, onLocationAction, onActionStart, onToiletActionCompleteRedirect])

  const handleActionClick = (actionId: string) => {
    if (!isActionInProgress) {
      setCurrentActionId(actionId)
      setIsActionInProgress(true)
    }
  }

  const actions = [
    {
      id: "do-business",
      name: "Do Business",
      emoji: "🚽",
      description: "Take care of nature's call. A quick relief.",
      effect: { burnout: -5, productivity: -2 },
    },
    {
      id: "groom",
      name: "Groom",
      emoji: "💇",
      description: "Quick touch-up to your appearance.",
      effect: { burnout: -8, productivity: -3 },
    },
    {
      id: "brush-teeth",
      name: "Brush Teeth",
      emoji: "🦷",
      description: "Freshen up your breath and feel clean.",
      effect: { burnout: -7, productivity: -2 },
    },
    {
      id: "wash-hands",
      name: "Wash Hands",
      emoji: "🧼",
      description: "Maintain hygiene. Simple but effective.",
      effect: { burnout: -3, productivity: -1 },
    },
  ]

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-24">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-xl md:text-2xl">
                <Toilet className="w-6 h-6" />
                <span>Toilet</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                A necessary stop for personal maintenance and a moment of peace.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {actions.map((action) => (
                  <Card key={action.id} className="hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <span className="text-4xl mb-2">{action.emoji}</span>
                      <h3 className="font-semibold text-lg mb-1">{action.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-1">{action.description}</p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        {action.effect.burnout && (
                          <span>
                            😌 Burnout: {action.effect.burnout > 0 ? "+" : ""}
                            {action.effect.burnout}
                          </span>
                        )}
                        {action.effect.productivity && (
                          <span className="ml-2">
                            📈 Prod: {action.effect.productivity > 0 ? "+" : ""}
                            {action.effect.productivity}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => handleActionClick(action.id)}
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        disabled={isActionInProgress}
                      >
                        {action.name}
                      </Button>
                      {isActionInProgress && currentActionId === action.id && (
                        <div className="w-full mt-2">
                          <Progress value={actionProgress} className="h-2 bg-gray-200 [&>*]:bg-green-500" />
                          <p className="text-xs text-gray-500 mt-1">{Math.round(actionProgress)}% Complete</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
