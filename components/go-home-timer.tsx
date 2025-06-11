"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function GoHomeTimer() {
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20) // 20 seconds
  const [progressValue, setProgressValue] = useState(0) // For the progress bar

  const handleGoHome = useCallback(() => {
    if (!isCountingDown) {
      setIsCountingDown(true)
      setTimeLeft(20)
      setProgressValue(0)
    }
  }, [isCountingDown])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (isCountingDown && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1
          setProgressValue(((20 - newTime) / 20) * 100) // Update progress bar
          return newTime
        })
      }, 1000)
    } else if (timeLeft === 0) {
      setIsCountingDown(false)
      setProgressValue(100) // Ensure it reaches 100%
      if (timer) clearInterval(timer)
      // Here you would trigger the "next day" logic in your game
      console.log("New day has begun! (Game actions re-enabled)")
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isCountingDown, timeLeft])

  return (
    <div className="space-y-3">
      <Button
        onClick={handleGoHome}
        disabled={isCountingDown}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        Go Home (Progress to Next Day)
      </Button>
      {isCountingDown && (
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-red-600">Waiting for next day: {timeLeft} seconds remaining...</p>
          <Progress value={progressValue} className="w-full h-2 bg-gray-200 rounded-full" />
          <p className="text-sm text-gray-500">Actions are temporarily disabled.</p>
        </div>
      )}
    </div>
  )
}
