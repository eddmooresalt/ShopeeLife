"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface OvertimePromptModalProps {
  onDecision: (overtime: boolean) => void
}

export function OvertimePromptModal({ onDecision }: OvertimePromptModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl text-gray-900">Overtime Opportunity! ⏰</CardTitle>
          <CardDescription className="text-gray-700">It's 6:30 PM. Do you want to work overtime?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-800 text-lg">
            Each 3 minutes of overtime earns you <span className="font-bold text-orange-500">1 ShopeeCoin</span>.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => onDecision(true)}
              className="bg-green-500 hover:bg-green-600 text-white text-lg px-6 py-3"
            >
              Work Overtime!
            </Button>
            <Button
              onClick={() => onDecision(false)}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 text-lg px-6 py-3"
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
