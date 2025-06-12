"use client"

import { Button } from "@/components/ui/button"
import { Coins } from "lucide-react"

interface OvertimeControlsProps {
  overtimeCoins: number
  onGoToNextDay: () => void
}

export function OvertimeControls({ overtimeCoins, onGoToNextDay }: OvertimeControlsProps) {
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end space-y-2">
      <div className="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-pulse">
        <Coins className="w-5 h-5" />
        <span className="font-bold text-lg">+{overtimeCoins} SC (Overtime)</span>
      </div>
      <Button
        onClick={onGoToNextDay}
        className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-6 py-3 rounded-full shadow-lg animate-bounce"
      >
        Go To Next Day
      </Button>
    </div>
  )
}
