"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coffee, ArrowLeft } from "lucide-react"
import type { GameState, LunchOption, GameTime } from "../../types/game"
import { lunchOptions, lunchLocations } from "../../data/gameData"
import { formatGameTime } from "../../utils/gameUtils"
import { ProgressDetail } from "../ProgressDetail" // Import ProgressDetail

interface LunchTabProps {
  gameState: GameState
  gameTime: GameTime
  onOrderLunch: (lunch: LunchOption) => void
  isLunchInProgress: boolean // New prop
  lunchProgress: number // New prop
  selectedLunchEmoji: string | null // New prop for selected lunch emoji
}

const LunchTab: React.FC<LunchTabProps> = ({
  gameState,
  gameTime,
  onOrderLunch,
  isLunchInProgress,
  lunchProgress,
  selectedLunchEmoji,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const isLunchTime = gameTime.hour >= 12 && gameTime.hour <= 14

  // Reset selected location on new day
  useEffect(() => {
    setSelectedLocationId(null)
  }, [gameState.day])

  const handleOrderLunch = (lunch: LunchOption) => {
    // Check if lunch has already been eaten today by checking if isLunchInProgress is false and current hour is past lunch time
    const hasEatenLunchToday = gameState.day === localStorage.getItem("lastLunchDay") && gameTime.hour > 14

    if (isLunchTime && gameState.money >= lunch.price && !hasEatenLunchToday && !isLunchInProgress) {
      onOrderLunch(lunch)
      localStorage.setItem("lastLunchDay", gameState.day.toString()) // Mark that lunch has been eaten for this day
    }
  }

  const currentLunchOptions = selectedLocationId ? lunchOptions[selectedLocationId] : []
  const currentLunchLocation = selectedLocationId ? lunchLocations.find((loc) => loc.id === selectedLocationId) : null

  // Determine if lunch has been eaten today for disabling buttons
  const hasEatenLunchToday = gameState.day === Number.parseInt(localStorage.getItem("lastLunchDay") || "0")

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              {selectedLocationId && !isLunchInProgress && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedLocationId(null)} className="mb-2">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Locations
                </Button>
              )}
              <CardTitle className="flex items-center gap-2">
                <Coffee className="w-5 h-5" />
                {selectedLocationId ? currentLunchLocation?.name : "Lunch Menu - One North"}
              </CardTitle>
              <CardDescription>
                {isLunchTime
                  ? hasEatenLunchToday
                    ? "You've already had lunch today!"
                    : isLunchInProgress
                      ? "Enjoying your meal..."
                      : selectedLocationId
                        ? currentLunchLocation?.description
                        : "Lunch time! Choose your dining location."
                  : "Lunch available from 12:00 PM - 2:00 PM"}
              </CardDescription>
            </div>
            {!selectedLocationId && (
              <Badge variant={isLunchTime ? "default" : "secondary"}>
                {isLunchTime ? "🟢 Lunch Hours" : "🔴 Off Hours"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLunchInProgress && (
            <ProgressDetail
              taskName={`Lunch at ${currentLunchLocation?.name || "a place"}`}
              progress={lunchProgress}
              duration={10} // Fixed duration for lunch, adjust as needed
              taskType="lunch"
              emoji={selectedLunchEmoji} // Pass the selected lunch emoji
            />
          )}

          {!selectedLocationId ? (
            // Display lunch locations
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lunchLocations.map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer hover:shadow-md transition-all ${
                    !isLunchTime || isLunchInProgress || hasEatenLunchToday ? "opacity-50 grayscale" : ""
                  }`}
                  onClick={() =>
                    isLunchTime && !isLunchInProgress && !hasEatenLunchToday && setSelectedLocationId(location.id)
                  }
                >
                  <CardContent className="p-4 text-center">
                    <span className="text-4xl mb-2 block">{location.emoji}</span>
                    <h3 className="font-medium text-lg">{location.name}</h3>
                    <p className="text-sm text-gray-600">{location.description}</p>
                    {(!isLunchTime || isLunchInProgress || hasEatenLunchToday) && (
                      <Badge className="mt-2" variant="secondary">
                        {isLunchInProgress
                          ? "Lunch in Progress"
                          : hasEatenLunchToday
                            ? "Lunch Eaten"
                            : "Not Lunch Time"}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Display lunch options for selected location
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {currentLunchOptions.map((lunch) => (
                <Card
                  key={lunch.id}
                  className={`cursor-pointer hover:shadow-md transition-all ${
                    !isLunchTime || hasEatenLunchToday || isLunchInProgress ? "opacity-50 grayscale" : ""
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{lunch.emoji}</span>
                        <h3 className="font-medium text-sm">{lunch.name}</h3>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {lunch.price} SC
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-green-600">⚡ +{lunch.energy} Energy</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500"
                      onClick={() => handleOrderLunch(lunch)}
                      disabled={
                        !isLunchTime || gameState.money < lunch.price || hasEatenLunchToday || isLunchInProgress
                      }
                    >
                      {!isLunchTime
                        ? "⏰ Not Lunch Time"
                        : hasEatenLunchToday
                          ? "✅ Lunch Eaten"
                          : isLunchInProgress
                            ? "⏳ In Progress"
                            : gameState.money < lunch.price
                              ? "💸 Can't Afford"
                              : "🛒 Order"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLunchTime && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
              <Coffee className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-orange-700 font-medium">Lunch service available from 12:00 PM - 2:00 PM</p>
              <p className="text-orange-600 text-sm mt-1">🕐 Current time: {formatGameTime(gameTime)}</p>
              <p className="text-orange-500 text-xs mt-1">Browse the menu above to plan your lunch!</p>
            </div>
          )}
          {isLunchTime && hasEatenLunchToday && !isLunchInProgress && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-700 font-medium">You've enjoyed your lunch for today!</p>
              <p className="text-green-600 text-sm mt-1">Come back tomorrow for more delicious options.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LunchTab
