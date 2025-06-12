import { Card } from "@/components/ui/card"

interface InternalThoughtPopupProps {
  message: string
}

export function InternalThoughtPopup({ message }: InternalThoughtPopupProps) {
  return (
    <Card className="fixed bottom-20 left-1/2 -translate-x-1/2 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50 animate-fade-in-out">
      {message}
    </Card>
  )
}
