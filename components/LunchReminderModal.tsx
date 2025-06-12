"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface LunchReminderModalProps {
  onGoToLunch: () => void
  onClose: () => void
}

export function LunchReminderModal({ onGoToLunch, onClose }: LunchReminderModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">It's Lunch Time! 🍔</CardTitle>
          <CardDescription>Time to refuel and take a break from work.</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-lg font-semibold">Don't miss out on a delicious meal!</CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={onGoToLunch} className="bg-orange-500 hover:bg-orange-600 text-white">
            Go to Lunch
          </Button>
          <Button variant="outline" onClick={onClose}>
            Later
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
