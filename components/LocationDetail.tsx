"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import type { GameState } from "../types/game"
import { ProgressDetail } from "./ProgressDetail"

interface LocationDetailProps {
  location: string
  gameState: GameState
  isWorkingHours: boolean
  dayTransition: boolean
  onBack: () => void
  onUpdateStats: (stats: Partial<GameState>) => void
}

interface LocationAction {
  name: string
  duration: number
  effects: {
    energy?: number
    productivity?: number
    burnout?: number
    experience?: number
    money?: number
  }
  requirements: {
    level?: number
    money?: number
    energy?: number
  }
  buttonClass: string
  icon: string
}

export const LocationDetail: React.FC<LocationDetailProps> = ({
  location,
  gameState,
  isWorkingHours,
  dayTransition,
  onBack,
  onUpdateStats,
}) => {
  const [actionInProgress, setActionInProgress] = useState(false)
  const [currentAction, setCurrentAction] = useState<string | null>(null)
  const [actionProgress, setActionProgress] = useState(0)
  const [actionDuration, setActionDuration] = useState(0)
  const [actionResult, setActionResult] = useState<{
    message: string
    effects: { type: string; value: number }[]
  } | null>(null)
  const [pendingEffects, setPendingEffects] = useState<null | {
    energy?: number
    productivity?: number
    burnout?: number
    experience?: number
    money?: number
  }>(null)

  // Reset action result when changing locations
  useEffect(() => {
    setActionResult(null)
  }, [location])

  // Handle applying effects after action completes
  useEffect(() => {
    if (pendingEffects && !actionInProgress) {
      onUpdateStats({
        energy: Math.max(0, Math.min(100, gameState.energy + (pendingEffects.energy || 0))),
        productivity: Math.max(0, Math.min(100, gameState.productivity + (pendingEffects.productivity || 0))),
        burnout: Math.max(0, Math.min(100, gameState.burnout + (pendingEffects.burnout || 0))),
        experience: gameState.experience + (pendingEffects.experience || 0),
        money: Math.max(0, gameState.money + (pendingEffects.money || 0)),
      })
      setPendingEffects(null)
    }
  }, [pendingEffects, actionInProgress, gameState, onUpdateStats])

  const executeAction = useCallback(
    (
      actionName: string,
      duration: number,
      effects: { energy?: number; productivity?: number; burnout?: number; experience?: number; money?: number },
    ) => {
      if (actionInProgress || !isWorkingHours || dayTransition) return

      setActionInProgress(true)
      setCurrentAction(actionName)
      setActionProgress(0)
      setActionDuration(duration)
      setActionResult(null)

      // Duration is in seconds
      const totalTime = duration * 1000
      const updateInterval = 50 // Update every 50ms for smooth progress

      const interval = setInterval(() => {
        setActionProgress((prev) => {
          const increment = (updateInterval / totalTime) * 100
          const newProgress = prev + increment

          if (newProgress >= 100) {
            clearInterval(interval)

            // Set pending effects to be applied in the useEffect
            setPendingEffects(effects)

            // Show result
            setActionResult({
              message: `${actionName} completed!`,
              effects: [
                ...(effects.energy ? [{ type: "Energy", value: effects.energy }] : []),
                ...(effects.productivity ? [{ type: "Productivity", value: effects.productivity }] : []),
                ...(effects.burnout ? [{ type: "Burnout", value: effects.burnout }] : []),
                ...(effects.experience ? [{ type: "Experience", value: effects.experience }] : []),
                ...(effects.money ? [{ type: "ShopeeCoins", value: effects.money }] : []),
              ],
            })

            setActionInProgress(false)
            setCurrentAction(null)
            return 0
          }
          return newProgress
        })
      }, updateInterval)
    },
    [actionInProgress, isWorkingHours, dayTransition],
  )

  const canExecuteAction = (action: LocationAction) => {
    if (actionInProgress || !isWorkingHours || dayTransition) return false
    if (action.requirements.level && gameState.level < action.requirements.level) return false
    if (action.requirements.money && gameState.money < action.requirements.money) return false
    if (action.requirements.energy && gameState.energy < action.requirements.energy) return false
    return true
  }

  const getActionRequirements = (action: LocationAction) => {
    const requirements = []
    if (action.requirements.level) requirements.push(`Level ${action.requirements.level + 1}+`)
    if (action.requirements.money) requirements.push(`${action.requirements.money} SC`)
    if (action.requirements.energy) requirements.push(`${action.requirements.energy} Energy`)
    return requirements
  }

  const getActionRewards = (action: LocationAction) => {
    const rewards = []
    if (action.effects.energy && action.effects.energy > 0) rewards.push(`+${action.effects.energy} Energy`)
    if (action.effects.productivity && action.effects.productivity > 0)
      rewards.push(`+${action.effects.productivity} Productivity`)
    if (action.effects.burnout && action.effects.burnout < 0) rewards.push(`${action.effects.burnout} Burnout`)
    if (action.effects.experience && action.effects.experience > 0) rewards.push(`+${action.effects.experience} XP`)
    if (action.effects.money && action.effects.money > 0) rewards.push(`+${action.effects.money} SC`)
    return rewards
  }

  const ActionCard: React.FC<{ action: LocationAction }> = ({ action }) => {
    const canExecute = canExecuteAction(action)
    const requirements = getActionRequirements(action)
    const rewards = getActionRewards(action)

    return (
      <Card
        className={`transition-all h-full flex flex-col ${
          !canExecute ? "opacity-50 border-gray-300" : "hover:shadow-md border-orange-300"
        }`}
      >
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{action.icon}</span>
              <h3 className="font-medium text-lg">{action.name}</h3>
              <Badge variant="outline" className="text-xs bg-white/20">
                {action.duration}s
              </Badge>
            </div>

            {/* Prerequisites */}
            {requirements.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-medium text-gray-700 mb-1">📋 Prerequisites:</p>
                <div className="flex flex-wrap gap-1">
                  {requirements.map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards */}
            {rewards.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">🎁 Rewards:</p>
                <div className="flex flex-wrap gap-1">
                  {rewards.map((reward, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-green-50 text-green-700 border-green-200"
                    >
                      {reward}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={() => executeAction(action.name, action.duration, action.effects)}
            disabled={!canExecute}
            className={`w-full mt-auto ${action.buttonClass} ${!canExecute ? "opacity-50 cursor-not-allowed" : ""}`}
            size="sm"
          >
            {canExecute ? "Perform Action" : "Unavailable"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const renderLocationContent = () => {
    switch (location) {
      case "desk":
        const deskActions: LocationAction[] = [
          {
            name: "Organize Desk",
            duration: 9, // Increased duration
            effects: { productivity: 5, energy: -2, burnout: -3 },
            requirements: {},
            buttonClass: "bg-blue-500 hover:bg-blue-600",
            icon: "🗂️",
          },
          {
            name: "Check Emails",
            duration: 12, // Increased duration
            effects: { productivity: 8, energy: -5, experience: 2 },
            requirements: {},
            buttonClass: "bg-green-500 hover:bg-green-600",
            icon: "📧",
          },
          {
            name: "Personal Development",
            duration: 18, // Increased duration
            effects: { productivity: -2, energy: -8, experience: 10 },
            requirements: {},
            buttonClass: "bg-purple-500 hover:bg-purple-600",
            icon: "📚",
          },
          {
            name: "Power Nap",
            duration: 15, // Increased duration
            effects: { energy: 15, productivity: -5, burnout: -10 },
            requirements: {},
            buttonClass: "bg-indigo-500 hover:bg-indigo-600",
            icon: "😴",
          },
        ]

        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-medium mb-2">My Desk</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your personal workspace where you handle most of your daily tasks.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deskActions.map((action, index) => (
                  <ActionCard key={index} action={action} />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Desk Setup</h3>
              <p className="text-sm text-gray-700">
                Your desk has a computer, notebook, and some personal items. The more you upgrade your workspace through
                the Shop, the more productive you'll be here.
              </p>
            </div>
          </div>
        )

      case "meeting":
        const meetingActions: LocationAction[] = [
          {
            name: "Team Meeting",
            duration: 24, // Increased duration
            effects: { productivity: 12, energy: -10, burnout: 8, experience: 15 },
            requirements: {},
            buttonClass: "bg-blue-500 hover:bg-blue-600",
            icon: "👥",
          },
          {
            name: "Give Presentation",
            duration: 30, // Increased duration
            effects: { productivity: 15, energy: -15, burnout: 12, experience: 25, money: 100 },
            requirements: { level: 2 },
            buttonClass: "bg-green-500 hover:bg-green-600",
            icon: "📊",
          },
          {
            name: "Brainstorming Session",
            duration: 18, // Increased duration
            effects: { productivity: 10, energy: -8, experience: 12 },
            requirements: {},
            buttonClass: "bg-purple-500 hover:bg-purple-600",
            icon: "🧠",
          },
          {
            name: "Network with Colleagues",
            duration: 15, // Increased duration
            effects: { energy: -5, burnout: -8, experience: 8 },
            requirements: {},
            buttonClass: "bg-indigo-500 hover:bg-indigo-600",
            icon: "🤝",
          },
        ]

        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium mb-2">Meeting Room</h3>
              <p className="text-sm text-gray-600 mb-4">Conference area for team discussions and presentations.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meetingActions.map((action, index) => (
                  <ActionCard key={index} action={action} />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Meeting Room Facilities</h3>
              <p className="text-sm text-gray-700">
                The meeting room is equipped with a projector, whiteboard, and video conferencing system. Higher-level
                employees can lead meetings for greater rewards.
              </p>
            </div>
          </div>
        )

      case "pantry":
        const pantryActions: LocationAction[] = [
          {
            name: "Coffee Break",
            duration: 9, // Increased duration
            effects: { energy: 20, burnout: -10, money: -5 },
            requirements: { money: 5 },
            buttonClass: "bg-amber-500 hover:bg-amber-600",
            icon: "☕",
          },
          {
            name: "Grab a Snack",
            duration: 6, // Increased duration
            effects: { energy: 15, burnout: -5, money: -10 },
            requirements: { money: 10 },
            buttonClass: "bg-green-500 hover:bg-green-600",
            icon: "🍪",
          },
          {
            name: "Water Break",
            duration: 3, // Increased duration
            effects: { energy: 8, burnout: -3 },
            requirements: {},
            buttonClass: "bg-blue-500 hover:bg-blue-600",
            icon: "💧",
          },
          {
            name: "Chat with Colleagues",
            duration: 12, // Increased duration
            effects: { energy: 10, burnout: -15, productivity: -5 },
            requirements: {},
            buttonClass: "bg-indigo-500 hover:bg-indigo-600",
            icon: "💬",
          },
        ]

        return (
          <div className="space-y-6">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-medium mb-2">Pantry</h3>
              <p className="text-sm text-gray-600 mb-4">Break area with refreshments and snacks.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pantryActions.map((action, index) => (
                  <ActionCard key={index} action={action} />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Pantry Facilities</h3>
              <p className="text-sm text-gray-700">
                The pantry has a coffee machine, microwave, refrigerator, and various snacks. Taking breaks here helps
                reduce burnout and restore energy.
              </p>
            </div>
          </div>
        )

      case "gameroom":
        const gameroomActions: LocationAction[] = [
          {
            name: "Play Table Tennis",
            duration: 15, // Increased duration
            effects: { energy: 25, burnout: -20, productivity: -10 },
            requirements: {},
            buttonClass: "bg-purple-500 hover:bg-purple-600",
            icon: "🏓",
          },
          {
            name: "Play Video Games",
            duration: 18, // Increased duration
            effects: { energy: 30, burnout: -25, productivity: -15 },
            requirements: {},
            buttonClass: "bg-indigo-500 hover:bg-indigo-600",
            icon: "🎮",
          },
          {
            name: "Play Board Games",
            duration: 21, // Increased duration
            effects: { energy: 20, burnout: -30, experience: 5 },
            requirements: {},
            buttonClass: "bg-blue-500 hover:bg-blue-600",
            icon: "🎲",
          },
          {
            name: "Team Building",
            duration: 24, // Increased duration
            effects: { energy: 15, burnout: -35, experience: 15, productivity: 5 },
            requirements: {},
            buttonClass: "bg-green-500 hover:bg-green-600",
            icon: "🤝",
          },
        ]

        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-medium mb-2">Game Room</h3>
              <p className="text-sm text-gray-600 mb-4">Recreation zone to unwind and recharge.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameroomActions.map((action, index) => (
                  <ActionCard key={index} action={action} />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Game Room Facilities</h3>
              <p className="text-sm text-gray-700">
                The game room features table tennis, video game consoles, board games, and comfortable seating. Great
                for reducing burnout but may temporarily affect productivity.
              </p>
            </div>
          </div>
        )

      case "phonebooth":
        const phoneboothActions: LocationAction[] = [
          {
            name: "Client Call",
            duration: 18, // Increased duration
            effects: { productivity: 15, energy: -10, experience: 12, money: 50 },
            requirements: { level: 1 },
            buttonClass: "bg-green-500 hover:bg-green-600",
            icon: "📱",
          },
          {
            name: "Focus Work",
            duration: 21, // Increased duration
            effects: { productivity: 25, energy: -15, burnout: 10 },
            requirements: {},
            buttonClass: "bg-blue-500 hover:bg-blue-600",
            icon: "🧠",
          },
          {
            name: "Personal Call",
            duration: 12, // Increased duration
            effects: { energy: 10, burnout: -15, productivity: -5 },
            requirements: {},
            buttonClass: "bg-indigo-500 hover:bg-indigo-600",
            icon: "📞",
          },
          {
            name: "Meditation",
            duration: 15, // Increased duration
            effects: { energy: 15, burnout: -25, productivity: 5 },
            requirements: {},
            buttonClass: "bg-purple-500 hover:bg-purple-600",
            icon: "🧘",
          },
        ]

        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium mb-2">Phone Booth</h3>
              <p className="text-sm text-gray-600 mb-4">Private area for calls and focused work.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phoneboothActions.map((action, index) => (
                  <ActionCard key={index} action={action} />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Phone Booth Features</h3>
              <p className="text-sm text-gray-700">
                Soundproof booths for private calls and focused work. Great for productivity and client interactions.
              </p>
            </div>
          </div>
        )

      case "itroom":
        const itroomActions: LocationAction[] = [
          {
            name: "Tech Support",
            duration: 12, // Increased duration
            effects: { productivity: 15, energy: -5 },
            requirements: {},
            buttonClass: "bg-gray-500 hover:bg-gray-600",
            icon: "🔧",
          },
          {
            name: "Software Update",
            duration: 15, // Increased duration
            effects: { productivity: 20, energy: -8, experience: 5 },
            requirements: {},
            buttonClass: "bg-blue-500 hover:bg-blue-600",
            icon: "💿",
          },
          {
            name: "Learn New Tool",
            duration: 24, // Increased duration
            effects: { productivity: 10, energy: -12, experience: 15 },
            requirements: {},
            buttonClass: "bg-purple-500 hover:bg-purple-600",
            icon: "📚",
          },
          {
            name: "Hardware Upgrade",
            duration: 18, // Increased duration
            effects: { productivity: 25, energy: -10, money: -100 },
            requirements: { money: 100 },
            buttonClass: "bg-green-500 hover:bg-green-600",
            icon: "🖥️",
          },
        ]

        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">IT Room</h3>
              <p className="text-sm text-gray-600 mb-4">Tech support and equipment area.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itroomActions.map((action, index) => (
                  <ActionCard key={index} action={action} />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-100 to-slate-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">IT Room Equipment</h3>
              <p className="text-sm text-gray-700">
                The IT room has computers, servers, and technical staff to help with any technology issues. Upgrading
                your equipment here can boost productivity.
              </p>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Location details not available</p>
          </div>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Navigation
            </Button>
            <CardTitle>
              {location === "desk" && "My Desk"}
              {location === "meeting" && "Meeting Room"}
              {location === "pantry" && "Pantry"}
              {location === "gameroom" && "Game Room"}
              {location === "phonebooth" && "Phone Booth"}
              {location === "itroom" && "IT Room"}
            </CardTitle>
            <CardDescription>
              {!isWorkingHours && "Office is closed. Come back during working hours."}
              {dayTransition && "Day is ending. Please wait..."}
              {isWorkingHours && !dayTransition && "Choose an action to perform at this location"}
            </CardDescription>
          </div>
          <Badge variant={isWorkingHours && !dayTransition ? "default" : "secondary"}>
            {isWorkingHours && !dayTransition ? "🟢 Available" : "🔴 Unavailable"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Action in Progress */}
        {actionInProgress && currentAction && (
          <ProgressDetail
            taskName={currentAction}
            progress={actionProgress}
            duration={actionDuration}
            taskType="location"
            location={location}
          />
        )}

        {/* Action Result */}
        {actionResult && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">✅ {actionResult.message}</h3>
            <div className="grid grid-cols-2 gap-2">
              {actionResult.effects.map((effect, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className={`text-sm ${effect.value > 0 ? "text-green-600" : "text-red-600"}`}>
                    {effect.type}: {effect.value > 0 ? "+" : ""}
                    {effect.value}
                    {effect.type === "ShopeeCoins" && " SC"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {renderLocationContent()}
      </CardContent>
    </Card>
  )
}
