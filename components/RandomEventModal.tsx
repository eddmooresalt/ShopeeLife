"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { RandomEvent } from "@/types/game"

interface RandomEventModalProps {
  event: RandomEvent
  onChoice: (choiceId: string) => void
}

export function RandomEventModal({ event, onChoice }: RandomEventModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{event.title}</CardTitle>
          <CardDescription>{event.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {event.choices.map((choice) => (
            <Button key={choice.id} onClick={() => onChoice(choice.id)} className="w-full">
              {choice.text}
            </Button>
          ))}
        </CardContent>
        <CardFooter className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Choose wisely, your actions have consequences!
        </CardFooter>
      </Card>
    </div>
  )
}
