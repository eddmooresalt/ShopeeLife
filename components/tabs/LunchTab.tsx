"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { GameState, LunchLocation, LunchItem } from "@/types/game"
import { useState } from "react"
import { Clock, MapPin, Utensils, Coins } from "lucide-react"
import { formatGameTime } from "@/utils/gameUtils"

interface LunchTabProps {
  gameState: GameState
  onLunch: (locationId: string, itemId: string) => void
}

export function LunchTab({ gameState, onLunch }: LunchTabProps) {
  const { lunchLocations, lunchItems, hasEatenLunch, lunchItemEatenId, gameTime, shopeeCoins } = gameState
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // Check if it's lunch time (12:00 PM - 2:00 PM)
  const currentHour = Math.floor(gameTime / 60) % 24
  const isLunchTime = currentHour >= 12 && currentHour < 14

  const currentLunchItem = lunchItems.find((item) => item.id === lunchItemEatenId)
  const selectedLocationData = lunchLocations.find((loc) => loc.id === selectedLocation)
  const selectedItemData = lunchItems.find((item) => item.id === selectedItem)

  const handleEatLunch = () => {
    if (selectedLocation && selectedItem && isLunchTime && !hasEatenLunch) {
      onLunch(selectedLocation, selectedItem)
    }
  }

  // Filter items by location type for more realistic choices
  const getItemsForLocation = (locationId: string) => {
    switch (locationId) {
      case "canteen":
        return lunchItems.filter((item) => ["chicken-rice", "nasi-lemak", "laksa", "sandwich"].includes(item.id))
      case "kopitiam":
        return lunchItems.filter((item) => ["chicken-rice", "nasi-lemak", "laksa", "dim-sum"].includes(item.id))
      case "cafe":
        return lunchItems.filter((item) => ["sandwich", "salad", "pasta", "burger"].includes(item.id))
      case "food-court":
        return lunchItems.filter((item) => ["ramen", "pad-thai", "bibimbap", "pho", "dim-sum"].includes(item.id))
      case "restaurant":
        return lunchItems.filter((item) => ["sushi", "pasta", "pizza", "fish-chips", "burger"].includes(item.id))
      case "delivery":
        return lunchItems // All items available for delivery
      default:
        return lunchItems
    }
  }

  const availableItems = selectedLocation ? getItemsForLocation(selectedLocation) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-400 to-amber-500 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Utensils className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Lunch Time!</h1>
              <p className="text-orange-100">Fuel up for the afternoon</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              <span>{formatGameTime(gameTime)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-orange-100">
              <Coins className="w-4 h-4" />
              <span>{shopeeCoins} SC available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Lunch Time Status */}
        <Card
          className={`border-2 ${isLunchTime ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-red-500 bg-red-50 dark:bg-red-900/20"}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className={`w-6 h-6 ${isLunchTime ? "text-green-600" : "text-red-600"}`} />
                <div>
                  <h3
                    className={`font-semibold ${isLunchTime ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}
                  >
                    {isLunchTime ? "Lunch Time is Open!" : "Lunch Time is Closed"}
                  </h3>
                  <p
                    className={`text-sm ${isLunchTime ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-300"}`}
                  >
                    {isLunchTime ? "Available from 12:00 PM - 2:00 PM" : "Come back between 12:00 PM - 2:00 PM"}
                  </p>
                </div>
              </div>
              <Badge variant={isLunchTime ? "default" : "destructive"} className="text-sm px-3 py-1">
                {isLunchTime ? "OPEN" : "CLOSED"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {hasEatenLunch ? (
          /* Already Eaten Section */
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-8xl mb-4">{currentLunchItem?.emoji || "🍽️"}</div>
              <div>
                <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-200 mb-2">Lunch Complete!</h2>
                <p className="text-lg text-orange-600 dark:text-orange-300 mb-4">
                  You enjoyed {currentLunchItem?.name || "a delicious meal"}
                </p>
                <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md">
                  <span className="text-green-600 font-semibold">+{currentLunchItem?.energyGain || 0} Energy</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Come back tomorrow for more delicious options!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Selection */}
            <Card className="h-fit">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Choose Your Dining Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="grid grid-cols-1 gap-3">
                    {lunchLocations.map((location: LunchLocation) => (
                      <Button
                        key={location.id}
                        variant={selectedLocation === location.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedLocation(location.id)
                          setSelectedItem(null) // Reset item selection when location changes
                        }}
                        className={`flex items-center justify-start h-auto py-4 px-4 ${
                          !isLunchTime ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={!isLunchTime || hasEatenLunch}
                      >
                        <span className="text-3xl mr-3">{location.emoji}</span>
                        <div className="text-left">
                          <div className="font-semibold">{location.name}</div>
                          <div className="text-xs opacity-75">
                            {getItemsForLocation(location.id).length} items available
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Menu Selection */}
            <Card className="h-fit">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Utensils className="w-5 h-5" />
                  <span>{selectedLocationData ? `${selectedLocationData.name} Menu` : "Select a Location First"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {selectedLocation ? (
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="grid grid-cols-1 gap-3">
                      {availableItems.map((item: LunchItem) => (
                        <Button
                          key={item.id}
                          variant={selectedItem === item.id ? "default" : "outline"}
                          onClick={() => setSelectedItem(item.id)}
                          className={`flex items-center justify-between h-auto py-4 px-4 ${
                            !isLunchTime || shopeeCoins < item.price ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={!isLunchTime || hasEatenLunch || shopeeCoins < item.price}
                        >
                          <div className="flex items-center">
                            <span className="text-3xl mr-3">{item.emoji}</span>
                            <div className="text-left">
                              <div className="font-semibold">{item.name}</div>
                              <div className="text-xs text-green-600">+{item.energyGain} Energy</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-orange-600">{item.price} SC</div>
                            {shopeeCoins < item.price && <div className="text-xs text-red-500">Not enough SC</div>}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Please select a dining location to view the menu</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Order Summary & Action */}
        {!hasEatenLunch && selectedLocation && selectedItem && (
          <Card className="border-2 border-orange-300 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-orange-800 dark:text-orange-200">Order Summary</h3>
                <Badge variant="secondary" className="text-sm">
                  {isLunchTime ? "Ready to Order" : "Lunch Closed"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <span className="text-2xl">{selectedLocationData?.emoji}</span>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLocationData?.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <span className="text-2xl">{selectedItemData?.emoji}</span>
                  <div>
                    <p className="font-semibold">{selectedItemData?.name}</p>
                    <p className="text-sm text-green-600">+{selectedItemData?.energyGain} Energy</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                  Total: {selectedItemData?.price} SC
                </div>
                <Button
                  onClick={handleEatLunch}
                  disabled={
                    !isLunchTime ||
                    hasEatenLunch ||
                    !selectedLocation ||
                    !selectedItem ||
                    (selectedItemData && shopeeCoins < selectedItemData.price)
                  }
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                  size="lg"
                >
                  {!isLunchTime ? "Lunch Closed" : hasEatenLunch ? "Already Eaten" : "Enjoy Your Meal! 🍽️"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
