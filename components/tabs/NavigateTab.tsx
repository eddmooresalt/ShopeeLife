"use client"

import type React from "react"

import { useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Map } from "lucide-react" // Removed unused Lucide icons
import { LocationDetail } from "../LocationDetail"
import type { GameState } from "../../types/game"

interface NavigateTabProps {
  gameState: GameState
  currentLocation: string
  isWorkingHours: boolean
  dayTransition: boolean
  isNavigatingLocation: boolean
  onVisitLocation: (location: string) => void
  onUpdateStats: (stats: Partial<GameState>) => void
  onBackToNavigationGrid: () => void // New prop for going back to grid
}

const NavigateTab: React.FC<NavigateTabProps> = ({
  gameState,
  currentLocation,
  isWorkingHours,
  dayTransition,
  isNavigatingLocation,
  onVisitLocation,
  onUpdateStats,
  onBackToNavigationGrid, // Destructure new prop
}) => {
  const handleUpdateStats = useCallback(
    (stats: Partial<GameState>) => {
      onUpdateStats(stats)
    },
    [onUpdateStats],
  )

  const locations = [
    { id: "desk", name: "My Desk", emoji: "🏢", description: "Your workspace" },
    { id: "meeting", name: "Meeting Room", emoji: "👥", description: "Conference area" },
    { id: "pantry", name: "Pantry", emoji: "☕", description: "Break area (+Energy)" },
    {
      id: "gameroom",
      name: "Game Room",
      emoji: "🎮",
      description: "Recreation zone (+Energy, -Burnout)",
    },
    {
      id: "phonebooth",
      name: "Phone Booth",
      emoji: "📞",
      description: "Private calls (+Productivity)",
    },
    {
      id: "itroom",
      name: "IT Room",
      emoji: "⚙️",
      description: "Tech support (+Productivity)",
    },
  ]

  // If currentLocation is not "office" (or default grid state), show its detail view
  if (currentLocation !== "office") {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <LocationDetail
          location={currentLocation} // Use currentLocation directly
          gameState={gameState}
          isWorkingHours={isWorkingHours}
          dayTransition={dayTransition}
          onBack={onBackToNavigationGrid} // Use the new prop for going back
          onUpdateStats={handleUpdateStats}
        />
      </div>
    )
  }

  // Otherwise show the navigation grid
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            Office Navigation
          </CardTitle>
          <CardDescription>
            Current Location: <Badge variant="outline">{currentLocation}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {locations.map((location) => (
              <Card
                key={location.id}
                className={`cursor-pointer hover:shadow-md transition-all ${
                  currentLocation === location.id ? "ring-2 ring-orange-500 bg-orange-50" : ""
                } ${!isWorkingHours || dayTransition || isNavigatingLocation ? "opacity-50" : ""}`}
                onClick={() => {
                  if (isWorkingHours && !dayTransition && !isNavigatingLocation) {
                    onVisitLocation(location.id)
                  }
                }}
              >
                <CardContent className="p-4 text-center">
                  <span className="text-4xl mb-2 block">{location.emoji}</span> {/* Display emoji */}
                  <h3 className="font-medium">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.description}</p>
                  {currentLocation === location.id && (
                    <Badge className="mt-2" variant="secondary">
                      Current
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {!isWorkingHours && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-700 font-medium">Office is closed</p>
              <p className="text-red-600 text-sm">Come back during working hours (9:30 AM - 6:30 PM)</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default NavigateTab
