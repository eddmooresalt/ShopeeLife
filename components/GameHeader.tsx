import type React from "react"
import { Card } from "@/components/ui/card"
import type { GameState, WeatherCondition } from "@/types/game"
import { formatGameTime } from "@/utils/gameUtils"
import { Zap, TrendingUp, AlertTriangle, Sun, Cloud, CloudRain, Wind, CloudLightning, Clock } from "lucide-react"

interface GameHeaderProps {
  gameState: GameState
  currentWeather: WeatherCondition
}

const weatherIcons: Record<string, React.ElementType> = {
  Sunny: Sun,
  Cloudy: Cloud,
  Rainy: CloudRain,
  Windy: Wind,
  Thunderstorm: CloudLightning,
  Sunrise: Sun,
  Sunset: Sun,
  "Night Time": Cloud,
}

export function GameHeader({ gameState, currentWeather }: GameHeaderProps) {
  const { gameTime, exp, shopeeCoins, stats } = gameState
  const { energy, productivity, burnout } = stats

  const formattedTime = formatGameTime(gameTime)
  const WeatherIcon = weatherIcons[currentWeather.type] || Sun

  return (
    <Card className="w-full rounded-none border-b p-0 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg">
      <div className="p-3">
        {/* Top Row: Time, Weather, and Currency */}
        <div className="flex items-center justify-between mb-2">
          {/* Time and Weather */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center space-x-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-semibold text-lg md:text-xl">{formattedTime}</span>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center space-x-2">
              {WeatherIcon && <WeatherIcon className="w-4 h-4 md:w-5 md:h-5" />}
              <span className="hidden sm:inline text-sm font-medium">{currentWeather.description}</span>
            </div>
          </div>

          {/* ShopeeCoins and EXP */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center space-x-2">
              <span className="text-lg md:text-xl font-bold">🧡</span>
              <div>
                <span className="font-semibold">{shopeeCoins}</span>
                <span className="text-xs ml-1">SC</span>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center space-x-2">
              <span className="text-lg md:text-xl font-bold">✨</span>
              <div>
                <span className="font-semibold">{exp}</span>
                <span className="text-xs ml-1">EXP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Progress Bars */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          {/* ENERGY */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center">
                <Zap className="w-3 h-3 md:w-4 md:h-4 text-green-300 mr-1" />
                <span className="font-medium">ENERGY</span>
              </div>
              <span className="font-medium">{energy}/100</span>
            </div>
            <div className="relative h-3 w-full bg-black/20 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-300 transition-all duration-300"
                style={{ width: `${energy}%` }}
              >
                {energy > 15 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-green-900">
                    {energy}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* PRODUCTIVITY */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-300 mr-1" />
                <span className="font-medium">PRODUCTIVITY</span>
              </div>
              <span className="font-medium">{productivity}/100</span>
            </div>
            <div className="relative h-3 w-full bg-black/20 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-300 transition-all duration-300"
                style={{ width: `${productivity}%` }}
              >
                {productivity > 15 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-blue-900">
                    {productivity}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* BURNOUT */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center">
                <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 text-red-300 mr-1" />
                <span className="font-medium">BURNOUT</span>
              </div>
              <span className="font-medium">{burnout}/100</span>
            </div>
            <div className="relative h-3 w-full bg-black/20 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-400 to-red-300 transition-all duration-300"
                style={{ width: `${burnout}%` }}
              >
                {burnout > 15 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-red-900">
                    {burnout}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
