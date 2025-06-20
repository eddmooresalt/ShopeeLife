"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area" // Ensure ScrollArea is imported
import type { RandomEvent } from "@/types/game"
import { Sparkles, Zap, TrendingUp, Heart, Coins, AlertTriangle } from "lucide-react"

interface RandomEventModalProps {
  event: RandomEvent
  onChoice: (choiceId: string) => void
}

export function RandomEventModal({ event, onChoice }: RandomEventModalProps) {
  const getEffectIcon = (effect: any) => {
    if (effect?.exp) return <Sparkles className="w-4 h-4 text-yellow-500" />
    if (effect?.energy) return <Zap className="w-4 h-4 text-green-500" />
    if (effect?.productivity) return <TrendingUp className="w-4 h-4 text-blue-500" />
    if (effect?.burnout && effect.burnout < 0) return <Heart className="w-4 h-4 text-red-500" /> // Lower burnout is better
    if (effect?.burnout && effect.burnout > 0) return <AlertTriangle className="w-4 h-4 text-orange-500" /> // Indicate increase in burnout
    if (effect?.shopeeCoins) return <Coins className="w-4 h-4 text-orange-500" />
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 md:max-w-4xl md:max-h-[80vh]">
        <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white relative overflow-hidden flex-shrink-0 py-4 md:py-8">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-4 left-8 text-6xl animate-bounce">✨</div>
            <div className="absolute top-8 right-12 text-5xl animate-pulse">🎭</div>
            <div className="absolute bottom-4 left-12 text-4xl animate-bounce delay-300">🎪</div>
            <div className="absolute bottom-8 right-8 text-5xl animate-pulse delay-500">🎨</div>
            <div className="absolute top-1/2 left-1/4 text-3xl animate-spin">⭐</div>
            <div className="absolute top-1/3 right-1/4 text-4xl animate-bounce delay-700">🌟</div>
          </div>

          <div className="relative z-10">
            <div className="text-6xl md:text-8xl mb-4 md:mb-6 animate-bounce">{event.emoji}</div>
            <CardTitle className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">{event.title}</CardTitle>
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1 md:text-lg md:px-4 md:py-2">
              Random Office Event
            </Badge>
          </div>
        </CardHeader>

        <ScrollArea className="flex-1 min-h-0">
          <CardContent className="p-4 md:p-8 max-w-4xl mx-auto">
            <CardDescription className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6 md:mb-8 text-center font-medium md:text-xl">
              {event.description}
            </CardDescription>

            <div className="space-y-4 md:space-y-6">
              <h3 className="text-xl md:text-2xl font-semibold text-center mb-4 md:mb-6 text-gray-800 dark:text-gray-200">
                Choose Your Response:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {event.choices.map((choice, index) => (
                  <Card
                    key={choice.id}
                    className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer border-3 hover:border-purple-400 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 h-full"
                    onClick={() => onChoice(choice.id)}
                  >
                    <CardContent className="p-4 md:p-6 h-full flex flex-col">
                      <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg">
                            {String.fromCharCode(65 + index)}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col">
                          <h4 className="font-semibold text-base mb-2 text-gray-800 dark:text-gray-200 leading-tight md:text-lg">
                            {choice.text}
                          </h4>

                          {choice.effect && (
                            <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-3">
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

                          <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed mt-auto md:text-sm">
                            "{choice.result}"
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </ScrollArea>

        <CardFooter className="bg-gray-50 dark:bg-gray-800 text-center py-4 md:py-6 flex-shrink-0">
          <div className="w-full">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-3">
              💡 <strong>Pro Tip:</strong> Choose wisely, your actions have consequences!
            </p>
            <div className="flex items-center justify-center space-x-2 md:space-x-3 text-xs text-gray-400">
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
