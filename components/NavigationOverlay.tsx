import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NavigationOverlayProps {
  progress: number
  locationName: string
}

export function NavigationOverlay({ progress, locationName }: NavigationOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl text-white">Navigating...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white text-lg">Heading to: {locationName}</p>
          <Progress value={progress} className="w-full h-4 bg-gray-600 [&>*]:bg-orange-500" />
          <p className="text-white text-sm">{Math.round(progress)}%</p>
        </CardContent>
      </Card>
    </div>
  )
}
