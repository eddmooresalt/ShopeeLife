"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { doWorkAction } from "@/actions/game-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GoHomeTimer } from "./go-home-timer"

export function GameActions() {
  const [state, formAction, isPending] = useActionState(doWorkAction, null)

  return (
    <Card className="p-4 bg-gradient-to-l from-yellow-50 to-orange-50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-2">Game Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <form action={formAction}>
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isPending}>
            {isPending ? "Working..." : "Do Work"}
          </Button>
        </form>
        <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white" disabled={isPending}>
          Attend Meeting
        </Button>
        <GoHomeTimer />
        {state?.message && (
          <p className={`text-sm text-center mt-2 ${state.success ? "text-green-700" : "text-red-700"}`}>
            {state.message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
