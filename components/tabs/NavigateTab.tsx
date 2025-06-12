"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" // Import Tooltip components
import type { LocationType, GameState } from "@/types/game"
import { useState } from "react"
import { MapPin, Clock } from "lucide-react"

interface NavigateTabProps {
  onNavigate: (location: LocationType) => void
  locations: LocationType[]
  gameState: GameState
}

export function NavigateTab({ onNavigate, locations, gameState }: NavigateTabProps) {
  const [selectedFloor, setSelectedFloor] = useState<number>(1)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

  // Organize locations by floor
  const locationsByFloor = {
    1: locations.filter((loc) => ["office", "meeting-room", "pantry", "toilet", "smoking-area"].includes(loc.id)), // Added toilet and smoking-area
    2: locations.filter((loc) =>
      ["hr-portal", "it-helpdesk", "company-news", "learning-hub", "feedback-form", "wellness-corner"].includes(loc.id),
    ), // Added new portal locations
    3: locations.filter((loc) => ["gym", "rooftop-garden"].includes(loc.id)),
  }

  const currentHour = Math.floor(gameState.gameTime / 60) % 24

  // Check if location is available based on time and inventory for smoking area
  const isLocationAvailable = (locationId: string) => {
    switch (locationId) {
      case "gym":
        return currentHour >= 6 && currentHour <= 22 // 6 AM - 10 PM
      case "rooftop-garden":
        return currentHour >= 7 && currentHour <= 19 // 7 AM - 7 PM
      case "meeting-room":
        return currentHour >= 8 && currentHour <= 18 // 8 AM - 6 PM
      case "smoking-area":
        const cigarettes = gameState.consumablesInventory.find((item) => item.itemId === "marlboro-cigarettes")
        return cigarettes ? cigarettes.quantity > 0 : false
      default:
        return true
    }
  }

  const getLocationIcon = (locationId: string) => {
    switch (locationId) {
      case "office":
        return <span className="text-3xl">💼</span>
      case "gym":
        return <span className="text-3xl">🏋️</span>
      case "rooftop-garden":
        return <span className="text-3xl">🌿</span>
      case "meeting-room":
        return <span className="text-3xl">👥</span>
      case "pantry":
        return <span className="text-3xl">☕</span>
      case "hr-portal":
        return <span className="text-3xl">📋</span>
      case "it-helpdesk":
        return <span className="text-3xl">💻</span>
      case "toilet":
        return <span className="text-3xl">🚽</span>
      case "smoking-area":
        return <span className="text-3xl">🚬</span>
      case "company-news":
        return <span className="text-3xl">📰</span>
      case "learning-hub":
        return <span className="text-3xl">📚</span>
      case "feedback-form":
        return <span className="text-3xl">📝</span>
      case "wellness-corner":
        return <span className="text-3xl">🧘</span>
      default:
        return <span className="text-3xl">📍</span>
    }
  }

  const getLocationStats = (locationId: string) => {
    switch (locationId) {
      case "office":
        return { emoji: "⚡", stat: "Productivity", color: "text-blue-500" }
      case "gym":
        return { emoji: "💪", stat: "Energy", color: "text-red-500" }
      case "rooftop-garden":
        return { emoji: "🧘", stat: "Wellness", color: "text-green-500" }
      case "meeting-room":
        return { emoji: "🤝", stat: "Collaboration", color: "text-purple-500" }
      case "pantry":
        return { emoji: "🍽️", stat: "Energy", color: "text-orange-500" }
      case "hr-portal":
        return { emoji: "👔", stat: "Support", color: "text-indigo-500" }
      case "it-helpdesk":
        return { emoji: "🔧", stat: "Tech", color: "text-yellow-500" }
      case "toilet":
        return { emoji: "😌", stat: "Burnout", color: "text-red-500" }
      case "smoking-area":
        return { emoji: "🚬", stat: "Burnout", color: "text-red-500" }
      case "company-news":
        return { emoji: "📢", stat: "Awareness", color: "text-cyan-500" }
      case "learning-hub":
        return { emoji: "🧠", stat: "Knowledge", color: "text-lime-500" }
      case "feedback-form":
        return { emoji: "🗣️", stat: "Influence", color: "text-pink-500" }
      case "wellness-corner":
        return { emoji: "💖", stat: "Well-being", color: "text-teal-500" }
      default:
        return { emoji: "🗺️", stat: "Explore", color: "text-gray-500" }
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 md:p-6 shadow-xl flex-shrink-0">
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 md:w-8 md:h-8" />
          <div>
            <h1 className="text-xl font-bold md:text-2xl">Office Navigation</h1>
            <p className="text-slate-300 text-sm md:text-base">Choose your destination in the Shopee building</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-24">
          {/* Floor Selector */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="flex items-center space-x-2 text-slate-800 text-lg md:text-xl">
                <span className="text-2xl">🏢</span>
                <span>Select Floor</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {[1, 2, 3].map((floor) => (
                  <Button
                    key={floor}
                    variant={selectedFloor === floor ? "default" : "outline"}
                    onClick={() => setSelectedFloor(floor)}
                    className={`h-14 md:h-16 text-base md:text-lg font-semibold transition-all duration-200 ${
                      selectedFloor === floor
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg scale-105"
                        : "hover:scale-105 hover:shadow-md"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xl md:text-2xl mb-1">{floor === 1 ? "🏢" : floor === 2 ? "💼" : "🌟"}</div>
                      <div>Floor {floor}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Locations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {locationsByFloor[selectedFloor as keyof typeof locationsByFloor]?.map((location) => {
              const available = isLocationAvailable(location.id)
              const stats = getLocationStats(location.id)
              const isHovered = hoveredLocation === location.id

              return (
                <TooltipProvider key={location.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card
                        className={`group cursor-pointer transition-all duration-300 border-0 shadow-lg hover:shadow-xl ${
                          available
                            ? "hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
                            : "opacity-60 bg-gray-100 dark:bg-gray-800"
                        }`}
                        onClick={() => available && onNavigate(location)}
                        onMouseEnter={() => setHoveredLocation(location.id)}
                        onMouseLeave={() => setHoveredLocation(null)}
                      >
                        <CardContent className="p-4 md:p-6">
                          {/* Location Header */}
                          <div className="flex items-center justify-between mb-3 md:mb-4">
                            <div className="flex items-center space-x-2 md:space-x-3">
                              <div
                                className={`text-3xl md:text-4xl transition-all duration-300 ${
                                  isHovered ? "scale-125" : ""
                                }`}
                              >
                                {location.emoji}
                              </div>
                              <div>
                                <h3 className="font-bold text-base md:text-lg text-gray-800 dark:text-gray-200">
                                  {location.name}
                                </h3>
                                <div className="flex items-center space-x-1 text-xs md:text-sm">
                                  <span className="text-base md:text-lg">{stats.emoji}</span>
                                  <span className={`font-medium ${stats.color}`}>{stats.stat}</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 md:p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:scale-110 transition-transform duration-200">
                              {getLocationIcon(location.id)}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4 leading-relaxed">
                            {location.description}
                          </p>

                          {/* Status and Action */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {available ? (
                                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Open
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Closed
                                </Badge>
                              )}
                            </div>

                            <Button
                              size="sm"
                              disabled={!available}
                              className={`transition-all duration-200 text-xs md:text-sm ${
                                available
                                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg"
                                  : ""
                              }`}
                            >
                              {available ? "Enter" : "Closed"}
                            </Button>
                          </div>

                          {/* Activity Preview */}
                          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-600">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {location.id === "office" && "📊 Productivity & work activities"}
                              {location.id === "gym" && "🏃‍♂️ Fitness & wellness activities"}
                              {location.id === "rooftop-garden" && "🌱 Relaxation & mindfulness"}
                              {location.id === "meeting-room" && "💼 Team collaboration activities"}
                              {location.id === "pantry" && "🥪 Social & refreshment activities"}
                              {location.id === "hr-portal" && "📝 HR services & support"}
                              {location.id === "it-helpdesk" && "🖥️ Technical support & training"}
                              {location.id === "toilet" && "🚽 Personal care & quick breaks"}
                              {location.id === "smoking-area" && "🚬 Stress relief (requires cigarettes)"}
                              {location.id === "company-news" && "📰 Stay informed about company updates"}
                              {location.id === "learning-hub" && "📚 Skill development & career growth"}
                              {location.id === "feedback-form" && "📝 Share your thoughts & suggestions"}
                              {location.id === "wellness-corner" && "🧘‍♂️ Mind & body rejuvenation"}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    {location.id === "smoking-area" && !available && (
                      <TooltipContent className="bg-red-600 text-white">
                        <p>You need Marlboro Cigarettes in your inventory to access the Smoking Area.</p>
                        <p>Visit the Shop to purchase them!</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>

          {/* Floor Info */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-3 md:p-4">
              <div className="text-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Floor {selectedFloor} Info:</span>{" "}
                {selectedFloor === 1 && "Main workspace, social areas, and essential facilities."}
                {selectedFloor === 2 && "Administrative, support services, and development opportunities."}
                {selectedFloor === 3 && "Wellness and recreational facilities for mind and body."}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
