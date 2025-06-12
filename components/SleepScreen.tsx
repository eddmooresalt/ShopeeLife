import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface SleepScreenProps {
  countdown: number // Keep countdown for visual effect, even if time isn't paused
}

export function SleepScreen({ countdown }: SleepScreenProps) {
  const progress = (countdown / 30) * 100 // 30 seconds total

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 z-[1000] flex items-center justify-center p-4 text-white">
      <Card className="w-full max-w-md text-center bg-white/10 backdrop-blur-sm border-blue-700 text-white">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-blue-200">Zzz... Time to Rest 😴</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-xl text-blue-100">Recharging for a new day...</p>
          <Progress value={progress} className="w-full h-4 bg-blue-800 [&>*]:bg-blue-400" />
          <p className="text-lg text-blue-100">{Math.ceil(countdown)} seconds remaining</p>
          <p className="text-blue-300 text-sm italic">(The game will automatically advance to 9:30 AM tomorrow)</p>
        </CardContent>
      </Card>
    </div>
  )
}
