"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { internalThoughts } from "../data/gameData"
import type { InternalThought } from "../types/game"

interface NavigationOverlayProps {
  targetLocationName: string
  progress: number
}

export const NavigationOverlay: React.FC<NavigationOverlayProps> = ({ targetLocationName, progress }) => {
  const [currentThought, setCurrentThought] = useState<InternalThought | null>(null)
  const thoughtIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear any existing interval
    if (thoughtIntervalRef.current) {
      clearInterval(thoughtIntervalRef.current)
    }

    // Set initial thought
    setCurrentThought(internalThoughts[Math.floor(Math.random() * internalThoughts.length)])

    // Cycle through thoughts every 2 seconds
    thoughtIntervalRef.current = setInterval(() => {
      setCurrentThought(internalThoughts[Math.floor(Math.random() * internalThoughts.length)])
    }, 2000)

    return () => {
      if (thoughtIntervalRef.current) {
        clearInterval(thoughtIntervalRef.current)
      }
    }
  }, [])

  const travelEmojis = ["🚶", "💨", "🏢", "➡️", "🗺️", "📍"]
  const currentEmoji = travelEmojis[Math.floor((progress / 100) * travelEmojis.length)]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4 animate-pulse">{currentEmoji}</div>
          <h3 className="text-2xl font-bold mb-3 text-orange-600">Navigating to {targetLocationName}...</h3>
          <p className="text-gray-700 mb-6">Please wait while you travel through the office.</p>

          <Progress value={progress} className="h-3 mb-4 bg-orange-200" indicatorClassName="bg-orange-500" />

          {currentThought && (
            <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 text-left">
              <p className="text-sm text-gray-800 flex items-center gap-2">
                <span className="text-lg">{currentThought.emoji}</span>
                {currentThought.text}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
