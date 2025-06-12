"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { LocationType, GameState } from "@/types/game"
import { useState } from "react"
import { MapPin, Clock, Users, Zap } from "lucide-react"

interface NavigateTabProps {
  onNavigate: (location: LocationType) => void
  locations: LocationType[]
  gameState: GameState
}

export function NavigateTab({ onNavigate, locations, gameState }: NavigateTabProps) {
  const [selectedFloor, setSelectedFloor] = useState<number>(1)

  // Organize locations by floor
  const locationsByFloor = {
    1: locations.filter((loc) => ["office", "meeting-room", "pantry"].includes(loc.id)),
    2: locations.filter((loc) => ["hr-portal", "it-helpdesk"].includes(loc.id)),
    3: locations.filter((loc) => ["gym", "rooftop-garden"].includes(loc.id)),
  }

  const currentHour = Math.floor(gameState.gameTime / 60) % 24

  // Check if location is available based on time
  const isLocationAvailable = (locationId: string) => {
    switch (locationId) {
      case "gym":
        return currentHour >= 6 && currentHour <= 22 // 6 AM - 10 PM
      case "rooftop-garden":
        return currentHour >= 7 && currentHour <= 19 // 7 AM - 7 PM
      case "meeting-room":
        return currentHour >= 8 && currentHour <= 18 // 8 AM - 6 PM
      default:
        return true
    }
  }

  const getLocationStats = (locationId: string) => {
    switch (locationId) {
      case "office":
        return { icon: Zap, stat: "Productivity", color: "text-blue-500" }
      case "gym":
        return { icon: Zap, stat: "Energy", color: "text-red-500" }
      case "rooftop-garden":
        return { icon: Users, stat: "Wellness", color: "text-green-500" }
      case "meeting-room":
        return { icon: Users, stat: "Social", color: "text-purple-500" }
      case "pantry":
        return { icon: Zap, stat: "Energy", color: "text-orange-500" }
      default:
        return { icon: MapPin, stat: "Explore", color: "text-gray-500" }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <MapPin className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Office Navigation</h1>
            <p className="text-slate-300">Choose your destination in the Shopee building</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Floor Selector */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <span className="text-2xl">🏢</span>
              <span>Select Floor</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((floor) => (
                <Button
                  key={floor}
                  variant={selectedFloor === floor ? "default" : "outline"}
                  onClick={() => setSelectedFloor(floor)}
                  className={`h-16 text-lg font-semibold transition-all duration-200 ${
                    selectedFloor === floor
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg scale-105"
                      : "hover:scale-105 hover:shadow-md"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{floor === 1 ? "🏢" : floor === 2 ? "💼" : "🌟"}</div>
                    <div>Floor {floor}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locationsByFloor[selectedFloor as keyof typeof locationsByFloor]?.map((location) => {
            const available = isLocationAvailable(location.id)
            const stats = getLocationStats(location.id)
            const StatIcon = stats.icon

            return (
              <Card
                key={location.id}
                className={`group cursor-pointer transition-all duration-300 border-0 shadow-lg hover:shadow-xl ${
                  available
                    ? "hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
                    : "opacity-60 bg-gray-100 dark:bg-gray-800"
                }`}
                onClick={() => available && onNavigate(location)}
              >
                <CardContent className="p-6">
                  {/* Location Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                        {location.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{location.name}</h3>
                        <div className="flex items-center space-x-1 text-sm">
                          <StatIcon className={`w-4 h-4 ${stats.color}`} />
                          <span className={`font-medium ${stats.color}`}>{stats.stat}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {location.description}
                  </p>

                  {/* Status and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {available ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Open
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Closed
                        </Badge>
                      )}
                    </div>

                    <Button
                      size="sm"
                      disabled={!available}
                      className={`transition-all duration-200 ${
                        available
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg"
                          : ""
                      }`}
                    >
                      {available ? "Enter" : "Closed"}
                    </Button>
                  </div>

                  {/* Activity Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {location.id === "office" && "📊 Productivity activities available"}
                      {location.id === "gym" && "💪 Fitness & wellness activities"}
                      {location.id === "rooftop-garden" && "🧘 Relaxation & mindfulness"}
                      {location.id === "meeting-room" && "🤝 Team collaboration activities"}
                      {location.id === "pantry" && "☕ Social & refreshment activities"}
                      {location.id === "hr-portal" && "📋 HR services & support"}
                      {location.id === "it-helpdesk" && "💻 Technical support & training"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Floor Info */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-4">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Floor {selectedFloor} Info:</span>{" "}
              {selectedFloor === 1 && "Main workspace and collaboration areas"}
              {selectedFloor === 2 && "Administrative and support services"}
              {selectedFloor === 3 && "Wellness and recreational facilities"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
