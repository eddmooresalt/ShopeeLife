"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RandomEvent } from "@/types/game"
import { Sparkles, Zap, TrendingUp, Heart, Coins } from "lucide-react"

interface RandomEventModalProps {
  event: RandomEvent
  onChoice: (choiceId: string) => void
}

export function RandomEventModal({ event, onChoice }: RandomEventModalProps) {
  const getEffectIcon = (effect: any) => {
    if (effect?.exp) return <Sparkles className="w-4 h-4 text-yellow-500" />
    if (effect?.energy) return <Zap className="w-4 h-4 text-green-500" />
    if (effect?.productivity) return <TrendingUp className="w-4 h-4 text-blue-500" />
    if (effect?.burnout && effect.burnout < 0) return <Heart className="w-4 h-4 text-red-500" />
    if (effect?.shopeeCoins) return <Coins className="w-4 h-4 text-orange-500" />
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-2 left-4 text-4xl animate-bounce">✨</div>
            <div className="absolute top-4 right-8 text-3xl animate-pulse">🎭</div>
            <div className="absolute bottom-2 left-8 text-2xl animate-bounce delay-300">🎪</div>
            <div className="absolute bottom-4 right-4 text-3xl animate-pulse delay-500">🎨</div>
          </div>

          <div className="relative z-10">
            <div className="text-6xl mb-4 animate-bounce">🎲</div>
            <CardTitle className="text-3xl font-bold mb-2">{event.title}</CardTitle>
            <Badge className="bg-white/20 text-white border-white/30">Random Office Event</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <CardDescription className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6 text-center">
            {event.description}
          </CardDescription>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">
              Choose Your Response:
            </h3>

            {event.choices.map((choice, index) => (
              <Card
                key={choice.id}
                className="transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer border-2 hover:border-purple-300 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600"
                onClick={() => onChoice(choice.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
                        {String.fromCharCode(65 + index)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">{choice.text}</h4>

                      {choice.effect && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {Object.entries(choice.effect).map(([stat, value]) => (
                            <div
                              key={stat}
                              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                value > 0
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {getEffectIcon(choice.effect)}
                              <span>
                                {value > 0 ? "+" : ""}
                                {value} {stat}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{choice.result}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 dark:bg-gray-800 text-center py-4">
          <div className="w-full">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              💡 <strong>Pro Tip:</strong> Choose wisely, your actions have consequences!
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
              <span>🎯</span>
              <span>Office Life Simulator</span>
              <span>•</span>
              <span>Random Event System</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
