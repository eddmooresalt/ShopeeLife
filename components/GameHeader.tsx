"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Clock, Zap, Brain, AlertTriangle } from "lucide-react"
import type { GameState, Role, GameTime } from "../types/game"
import { getEnergyColor, getProductivityColor, getBurnoutColor, formatGameTime } from "../utils/gameUtils"

interface GameHeaderProps {
  gameState: GameState
  currentRole: Role
  nextRole: Role
  canLevelUp: boolean
  gameTime: GameTime
  isWorkingHours: boolean
  dayTransition: boolean
  onLevelUp: () => void
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  gameState,
  currentRole,
  nextRole,
  canLevelUp,
  gameTime,
  isWorkingHours,
  dayTransition,
  onLevelUp,
}) => {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-xl px-2 py-1">
      <div className="max-w-6xl mx-auto px-2 py-1">
        {/* Top Row - Title and Money */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="text-xl">🏢</div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-800">Shopee Office Simulator</h1>
              <p className="text-gray-600 text-xs hidden md:block">
                Climb the corporate ladder while managing work-life balance
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white rounded-lg px-2 py-1 shadow-md">
              <div className="text-lg">💵</div>
              <div>
                <p className="text-xs text-orange-100">Balance</p>
                <p className="text-sm font-bold">{gameState.money.toLocaleString()} SC</p>
              </div>
            </div>
          </div>
        </div>
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
          {/* Role & Level */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 shadow-sm text-white">
            <div className="flex items-center gap-0.5 mb-0.5">
              <Award className="w-2.5 h-2.5 text-orange-500" />
              <span className="text-xs text-orange-100 font-medium">Role</span>
            </div>
            <p className="font-semibold text-sm text-white truncate">{currentRole.title}</p>
            <p className="text-xs text-orange-200">Level {gameState.level + 1}</p>
          </div>
          {/* Energy */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 shadow-sm text-white">
            <div className="flex items-center gap-0.5 mb-0.5">
              <Zap className="w-2.5 h-2.5 text-green-500" />
              <span className="text-xs text-orange-100 font-medium">Energy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex-1 bg-white/30 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getEnergyColor(gameState.energy)}`}
                  style={{ width: `${gameState.energy}%` }}
                />
              </div>
              <span className="text-xs font-medium text-white">{gameState.energy}</span>
            </div>
          </div>
          {/* Productivity */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 shadow-sm text-white">
            <div className="flex items-center gap-0.5 mb-0.5">
              <Brain className="w-2.5 h-2.5 text-blue-500" />
              <span className="text-xs text-orange-100 font-medium">Productivity</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex-1 bg-white/30 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getProductivityColor(gameState.productivity)}`}
                  style={{ width: `${gameState.productivity}%` }}
                />
              </div>
              <span className="text-xs font-medium text-white">{gameState.productivity}</span>
            </div>
          </div>
          {/* Burnout */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 shadow-sm text-white">
            <div className="flex items-center gap-0.5 mb-0.5">
              <AlertTriangle className="w-2.5 h-2.5 text-red-500" />
              <span className="text-xs text-orange-100 font-medium">Burnout</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex-1 bg-white/30 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getBurnoutColor(gameState.burnout)}`}
                  style={{ width: `${gameState.burnout}%` }}
                />
              </div>
              <span className="text-xs font-medium text-white">{gameState.burnout}</span>
            </div>
          </div>
          {/* Time & Day with Game Clock */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 shadow-sm text-white col-span-2 md:col-span-1">
            <div className="flex items-center gap-0.5 mb-0.5">
              <Clock className="w-2.5 h-2.5 text-purple-500" />
              <span className="text-xs text-orange-100 font-medium">Game Time</span>
            </div>
            <p className="font-semibold text-sm text-white">Day {gameState.day}</p>
            <div className="flex items-center gap-1">
              <p className="text-xs font-mono text-white">{formatGameTime(gameTime)}</p>
              <Badge
                variant="secondary"
                className={`text-xs px-1 py-0 ${
                  isWorkingHours && !dayTransition
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-red-100 text-red-700 border-red-300"
                }`}
              >
                {isWorkingHours && !dayTransition ? "💼 Work" : "🏠 Off"}
              </Badge>
            </div>
            {dayTransition && <p className="text-xs text-amber-600 animate-pulse font-medium">Day ending...</p>}
          </div>
        </div>
        {/* Experience Progress Bar (only show if not max level) */}
        {gameState.level < 7 && (
          <div className="mt-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 shadow-sm text-white">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs text-white font-medium">Progress to {nextRole.title}</span>
              <span className="text-xs text-orange-200">
                {gameState.experience}/{nextRole.experienceRequired} XP
              </span>
            </div>
            <div className="bg-white/30 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, (gameState.experience / nextRole.experienceRequired) * 100)}%` }}
              />
            </div>
            {canLevelUp && (
              <div className="mt-0.5 text-center">
                <Button
                  onClick={onLevelUp}
                  size="xs"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold animate-pulse shadow-md"
                >
                  Promote to {nextRole.title}!
                </Button>
              </div>
            )}
          </div>
        )}
        {/* Burnout Warning */}
        {gameState.burnout > 70 && (
          <div className="mt-1 bg-red-700/30 border-2 border-red-500 rounded-lg p-1 shadow-sm text-white">
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-300 animate-pulse" />
              <div>
                <p className="text-red-700 font-medium text-xs">High Burnout Warning!</p>
                <p className="text-red-600 text-xs">Take a break to avoid productivity loss</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
