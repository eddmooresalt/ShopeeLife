"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GameState, LocationType } from "@/types/game"
import { ArrowLeft } from "lucide-react"
import { OfficeTab } from "./tabs/OfficeTab"
import { TasksTab } from "./tabs/TasksTab"
import { LunchTab } from "./tabs/LunchTab"
import { ShopTab } from "./tabs/ShopTab"
import { CharacterTab } from "./tabs/CharacterTab"
import { SeaTalkTab } from "./tabs/SeaTalkTab"
import { NavigateTab } from "./tabs/NavigateTab"
import { PortalTab } from "./tabs/PortalTab"
import { OfficeLocation } from "./locations/OfficeLocation"
import { RooftopGardenLocation } from "./locations/RooftopGardenLocation"
import { GymLocation } from "./locations/GymLocation"
import { PantryLocation } from "./locations/PantryLocation"
import { TabType } from "@/types/game"

interface LocationDetailProps {
  location: LocationType
  onBack: () => void
  gameState: GameState
  onWork: (taskId: string) => void
  onLunch: (locationId: string, itemId: string) => void
  onBuyItem: (itemId: string) => void
  onSendMessage: (message: string) => void
  onClaimQuestReward: (questId: string) => void
  onPortalAction: (portalId: string, actionType: string) => void
  onLocationAction: (locationId: string, actionId: string) => void
}

const LocationTabContent: Record<TabType, React.ComponentType<any>> = {
  [TabType.Office]: OfficeTab,
  [TabType.Tasks]: TasksTab,
  [TabType.Lunch]: LunchTab,
  [TabType.Shop]: ShopTab,
  [TabType.Character]: CharacterTab,
  [TabType.SeaTalk]: SeaTalkTab,
  [TabType.Navigate]: NavigateTab,
  [TabType.Portal]: PortalTab,
}

// Custom location components for specific locations
const CustomLocationComponents: Record<string, React.ComponentType<any>> = {
  office: OfficeLocation,
  "rooftop-garden": RooftopGardenLocation,
  gym: GymLocation,
  pantry: PantryLocation,
}

export function LocationDetail({
  location,
  onBack,
  gameState,
  onWork,
  onLunch,
  onBuyItem,
  onSendMessage,
  onClaimQuestReward,
  onPortalAction,
  onLocationAction,
}: LocationDetailProps) {
  // Check if this location has a custom component
  const CustomLocationComponent = CustomLocationComponents[location.id]
  const CurrentLocationTabComponent = LocationTabContent[location.tabType]

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <Card className="flex-none border-0 shadow-lg bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-white/50">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Navigation</span>
          </Button>
          <CardTitle className="text-xl font-bold flex items-center space-x-2">
            <span className="text-3xl">{location.emoji}</span>
            <span>{location.name}</span>
          </CardTitle>
          <div className="w-10" /> {/* Spacer to balance back button */}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center italic">{location.description}</p>
        </CardContent>
      </Card>

      <div className="flex-1 overflow-hidden">
        {CustomLocationComponent ? (
          <CustomLocationComponent
            gameState={gameState}
            onLocationAction={(actionId: string) => onLocationAction(location.id, actionId)}
          />
        ) : CurrentLocationTabComponent ? (
          <CurrentLocationTabComponent
            gameState={gameState}
            onWork={onWork}
            onLunch={onLunch}
            onBuyItem={onBuyItem}
            onSendMessage={onSendMessage}
            onClaimQuestReward={onClaimQuestReward}
            onPortalAction={onPortalAction}
            dailyQuests={gameState.dailyQuests}
            currentWeather={gameState.currentWeather}
          />
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">{location.emoji}</div>
              <h2 className="text-2xl font-bold mb-2">{location.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                This location is under development. Check back soon for exciting activities!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
