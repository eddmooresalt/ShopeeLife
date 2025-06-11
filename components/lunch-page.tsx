import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function LunchPage() {
  return (
    <Card className="w-full bg-gradient-to-br from-pink-50 to-orange-50 shadow-xl border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-500">
          Lunch Break!
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center justify-center gap-8 p-6">
        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <Image src="/placeholder.svg?height=256&width=256" alt="Delicious Lunch" fill className="object-cover" />
        </div>
        <div className="text-center md:text-left space-y-4">
          <p className="text-lg text-gray-700 font-medium">Time to recharge and refuel! What's on your menu today?</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Grab a quick bite at the cafeteria.</li>
            <li>Enjoy a homemade meal.</li>
            <li>Explore new food trucks nearby!</li>
          </ul>
          <p className="text-sm text-gray-500 italic">A well-fed employee is a happy and productive employee!</p>
        </div>
      </CardContent>
    </Card>
  )
}
