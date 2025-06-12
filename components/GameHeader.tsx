"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { GameState, WeatherCondition } from "@/types/game"
import { formatGameTime, calculatePlayerGrade, getLevelRank } from "@/utils/gameUtils" // Import getLevelRank
import { Zap, TrendingUp, AlertTriangle, Coins, Sun, User } from "lucide-react"

interface GameHeaderProps {
  gameState: GameState
  currentWeather: WeatherCondition
}

export function GameHeader({ gameState, currentWeather }: GameHeaderProps) {
  const { gameTime, exp, level, shopeeCoins, stats, playerName } = gameState
  const { energy, productivity, burnout } = stats

  const expToNextLevel = level * 100
  const expPercentage = (exp / expToNextLevel) * 100

  const playerGrade = calculatePlayerGrade(productivity, burnout) // Calculate grade
  const levelRank = getLevelRank(level) // Get level rank

  return (
    <Card className="rounded-none border-x-0 border-t-0 border-b shadow-md bg-gradient-to-r from-orange-400 to-pink-500 text-white flex-shrink-0">
      <CardContent className="p-2 md:p-3 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left Section: Player Info & Time */}
        <div className="flex items-center space-x-2 md:space-x-3 flex-grow">
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-bold text-sm md:text-base">{playerName}</span>
            </div>
            <div className="text-xs md:text-sm text-gray-100">
              Level {level} ({levelRank}) | Grade: {playerGrade}
            </div>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2 ml-auto">
            <Sun className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-semibold text-base md:text-lg">{formatGameTime(gameTime)}</span>
            <span className="text-xs md:text-sm text-gray-100">({currentWeather.description})</span>
          </div>
        </div>

        {/* Right Section: Stats & Coins */}
        <div className="flex items-center space-x-3 md:space-x-4 flex-shrink-0">
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-green-300" />
            <span className="text-sm md:text-base">{energy}</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-300" />
            <span className="text-sm md:text-base">{productivity}</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-300" />
            <span className="text-sm md:text-base">{burnout}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Coins className="w-4 h-4 md:w-5 md:h-5 text-yellow-300" />
            <span className="font-bold text-sm md:text-base">{shopeeCoins}</span>
          </div>
        </div>
      </CardContent>
      {/* EXP Bar */}
      <div className="w-full bg-gray-700 h-2">
        <div className="bg-yellow-400 h-full transition-all duration-300" style={{ width: `${expPercentage}%` }} />
      </div>
    </Card>
  )
}
