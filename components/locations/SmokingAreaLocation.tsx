"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress" // Import Progress component
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { GameState, ShopItem } from "@/types/game"
import { Cigarette } from "lucide-react"
import { useState, useEffect } from "react"

interface SmokingAreaLocationProps {
  gameState: GameState
  shopItems: ShopItem[] // Pass shopItems to get effect details
  onLocationAction: (actionId: string, effect?: any) => void // Modified to pass effect
  onProgressComplete: (internalThought: string) => void // New prop for internal thought
  onActionStart: () => void // New prop to signal action start
}

export function SmokingAreaLocation({
  gameState,
  shopItems,
  onLocationAction,
  onProgressComplete,
  onActionStart, // Destructure new prop
}: SmokingAreaLocationProps) {
  const CIGARETTE_ITEM_ID = "marlboro-cigarettes"
  const SMOKING_DURATION_SECONDS = 10

  const cigaretteInInventory = gameState.consumablesInventory.find((item) => item.itemId === CIGARETTE_ITEM_ID)
  const cigaretteCount = cigaretteInInventory ? cigaretteInInventory.quantity : 0
  const cigaretteShopItem = shopItems.find((item) => item.id === CIGARETTE_ITEM_ID)

  const [smokingProgress, setSmokingProgress] = useState(0)
  const [isSmoking, setIsSmoking] = useState(false)
  const [internalThought, setInternalThought] = useState<string | null>(null)

  // New useEffect to ensure game is unpaused when entering this location
  useEffect(() => {
    // When this component mounts, ensure the game is unpaused
    // This handles cases where isGamePaused might be true from a previous state
    // (e.g., a modal closed right before navigating here, or a lingering pause)
    onProgressComplete("You entered the Smoking Area.") // Use this to unpause and set a thought
    // Note: onProgressComplete also sets isGamePaused(false)

    // No cleanup needed here, as onProgressComplete is called on mount
    // and the smoking action itself will manage pause/unpause.
  }, [onProgressComplete]) // Depend on onProgressComplete to avoid stale closures

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isSmoking && smokingProgress < 100) {
      timer = setInterval(() => {
        setSmokingProgress((prev) => {
          const newProgress = prev + 100 / (SMOKING_DURATION_SECONDS * 10) // Update every 100ms
          if (newProgress >= 100) {
            clearInterval(timer)
            setIsSmoking(false)
            setSmokingProgress(0) // Reset progress bar
            // Trigger the actual action and get internal thought
            onLocationAction("smoke-cigarettes", cigaretteShopItem?.effect)
            onProgressComplete("You finished your cigarette. Feeling a bit more relaxed.")
            return 100
          }
          return newProgress
        })
      }, 100)
    } else if (!isSmoking && smokingProgress === 100) {
      // Reset progress bar after completion if not already reset
      setSmokingProgress(0)
    }

    return () => clearInterval(timer)
  }, [isSmoking, smokingProgress, onLocationAction, onProgressComplete, cigaretteShopItem])

  const handleSmoke = () => {
    if (cigaretteCount > 0 && !isSmoking) {
      onActionStart() // Signal to parent that an action is starting (to pause game)
      setIsSmoking(true)
      setSmokingProgress(0)
      setInternalThought("You light up a cigarette...")
    }
  }

  const smokeAction = {
    id: "smoke-cigarettes",
    name: "Smoke Cigarettes",
    emoji: "🚬",
    description: "Take a deep drag. Reduces stress, but might affect long-term productivity.",
    effect: cigaretteShopItem?.effect || { burnout: -20, energy: 5, productivity: -5 },
  }

  const canSmoke = cigaretteCount > 0 && !isSmoking

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-24">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-xl md:text-2xl">
                <Cigarette className="w-6 h-6" />
                <span>Smoking Area</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                A quiet corner for those who need a quick smoke break.
              </p>

              <div className="mb-4 text-center text-lg font-semibold">Cigarettes: {cigaretteCount}</div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      className={`transition-all duration-200 ${
                        !canSmoke ? "opacity-50 cursor-not-allowed" : "hover:shadow-md hover:scale-[1.02]"
                      }`}
                    >
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <span className="text-4xl mb-2">{smokeAction.emoji}</span>
                        <h3 className="font-semibold text-lg mb-1">{smokeAction.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-1">
                          {smokeAction.description}
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                          {smokeAction.effect.burnout && (
                            <span>
                              😌 Burnout: {smokeAction.effect.burnout > 0 ? "+" : ""}
                              {smokeAction.effect.burnout}
                            </span>
                          )}
                          {smokeAction.effect.energy && (
                            <span className="ml-2">
                              ⚡ Energy: {smokeAction.effect.energy > 0 ? "+" : ""}
                              {smokeAction.effect.energy}
                            </span>
                          )}
                          {smokeAction.effect.productivity && (
                            <span className="ml-2">
                              📈 Prod: {smokeAction.effect.productivity > 0 ? "+" : ""}
                              {smokeAction.effect.productivity}
                            </span>
                          )}
                        </div>
                        <Button
                          onClick={handleSmoke}
                          disabled={!canSmoke}
                          size="sm"
                          className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                        >
                          {isSmoking ? "Smoking..." : cigaretteCount === 0 ? "No Cigarettes" : "Smoke Cigarettes"}
                        </Button>
                        {isSmoking && <Progress value={smokingProgress} className="w-full mt-3 h-2" />}
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  {!canSmoke && cigaretteCount === 0 && (
                    <TooltipContent className="bg-red-600 text-white">
                      <p>You need Marlboro Cigarettes to perform this action.</p>
                      <p>Visit the Shop to purchase them!</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              {internalThought && (
                <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">{internalThought}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
