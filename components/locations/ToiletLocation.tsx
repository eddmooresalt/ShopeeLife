"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GameState } from "@/types/game"
import { TableIcon as Toilet } from "lucide-react"

interface ToiletLocationProps {
  gameState: GameState
  onLocationAction: (actionId: string) => void
}

export function ToiletLocation({ gameState, onLocationAction }: ToiletLocationProps) {
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
                        onClick={() => onLocationAction(action.id)}
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      >
                        {action.name}
                      </Button>
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
