import type React from "react"
import { Card } from "@/components/ui/card"
import type { GameState, WeatherCondition } from "@/types/game"
import { formatGameTime } from "@/utils/gameUtils"
import { Zap, TrendingUp, AlertTriangle, Sun, Cloud, CloudRain, Wind, CloudLightning } from "lucide-react"

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
    <Card className="w-full rounded-none border-b p-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md">
      <div className="flex items-center justify-between text-sm md:text-base">
        {/* Time and Weather */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-lg md:text-xl">{formattedTime}</span>
          {WeatherIcon && (
            <div className="flex items-center space-x-1">
              <WeatherIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">{currentWeather.description}</span>
            </div>
          )}
        </div>

        {/* ShopeeCoins and EXP */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="text-lg md:text-xl font-bold">🧡</span>
            <span className="font-semibold">{shopeeCoins} SC</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-lg md:text-xl font-bold">✨</span>
            <span className="font-semibold">{exp} EXP</span>
          </div>
        </div>
      </div>

      {/* Stats Progress Bars */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {/* ENERGY */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center">
              <Zap className="w-3 h-3 md:w-4 md:h-4 text-green-400 mr-1" />
              <span className="font-medium">ENERGY</span>
            </div>
            <span>{energy}/100</span>
          </div>
          <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
              style={{ width: `${energy}%` }}
            >
              {energy > 15 && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                  {energy}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* PRODUCTIVITY */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-400 mr-1" />
              <span className="font-medium">PRODUCTIVITY</span>
            </div>
            <span>{productivity}/100</span>
          </div>
          <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${productivity}%` }}
            >
              {productivity > 15 && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                  {productivity}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* BURNOUT */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center">
              <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 text-red-400 mr-1" />
              <span className="font-medium">BURNOUT</span>
            </div>
            <span>{burnout}/100</span>
          </div>
          <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-300"
              style={{ width: `${burnout}%` }}
            >
              {burnout > 15 && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                  {burnout}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
