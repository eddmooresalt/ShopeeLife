"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GameState } from "@/types/game"
import { useState } from "react"
import { Clock, Users, FileText, Award, Coffee, MessageCircle } from "lucide-react"

interface HRPortalLocationProps {
  gameState: GameState
  onLocationAction: (actionId: string) => void
}

export function HRPortalLocation({ gameState, onLocationAction }: HRPortalLocationProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const currentHour = Math.floor(gameState.gameTime / 60) % 24
  const isOfficeHours = currentHour >= 9 && currentHour <= 17

  const hrServices = [
    {
      id: "performance-review",
      name: "Performance Review",
      emoji: "📊",
      description: "Schedule your quarterly performance review with Sarah from HR",
      duration: "30 mins",
      available: isOfficeHours,
      reward: { exp: 25, coins: 15 },
    },
    {
      id: "benefits-consultation",
      name: "Benefits Consultation",
      emoji: "🏥",
      description: "Learn about your health insurance and retirement benefits",
      duration: "20 mins",
      available: isOfficeHours,
      reward: { exp: 15, coins: 10 },
    },
    {
      id: "team-building",
      name: "Team Building Event",
      emoji: "🎯",
      description: "Join the monthly team building activity in the conference room",
      duration: "45 mins",
      available: currentHour >= 14 && currentHour <= 16,
      reward: { exp: 30, coins: 20, energy: 15 },
    },
    {
      id: "complaint-box",
      name: "Anonymous Feedback",
      emoji: "📝",
      description: "Submit anonymous feedback about workplace improvements",
      duration: "5 mins",
      available: true,
      reward: { exp: 10, coins: 5 },
    },
  ]

  const hrStaff = [
    {
      name: "Sarah Chen",
      role: "HR Manager",
      emoji: "👩‍💼",
      status: isOfficeHours ? "Available" : "Away",
      mood: "Professional",
    },
    {
      name: "Mike Rodriguez",
      role: "Recruiter",
      emoji: "👨‍💼",
      status: currentHour >= 10 && currentHour <= 16 ? "Available" : "Away",
      mood: "Friendly",
    },
  ]

  const handleServiceAction = async (serviceId: string) => {
    setIsProcessing(true)
    setSelectedService(serviceId)

    // Simulate processing time
    setTimeout(() => {
      onLocationAction(serviceId)
      setIsProcessing(false)
      setSelectedService(null)
    }, 2000)
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6 pb-32">
          {/* Room Header */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">👥</div>
                  <div>
                    <h2 className="text-2xl font-bold">Human Resources Office</h2>
                    <p className="text-blue-100">Your people-focused support center</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-blue-100">
                    <Clock className="w-4 h-4" />
                    <span>{isOfficeHours ? "Open" : "Closed"}</span>
                  </div>
                  <div className="text-sm text-blue-200">Office Hours: 9 AM - 5 PM</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HR Staff */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>HR Team</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hrStaff.map((staff) => (
                  <div
                    key={staff.name}
                    className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="text-3xl">{staff.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">{staff.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{staff.role}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={staff.status === "Available" ? "default" : "secondary"}
                          className={staff.status === "Available" ? "bg-green-100 text-green-700" : ""}
                        >
                          {staff.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{staff.mood}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* HR Services */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Available Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hrServices.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      service.available
                        ? "hover:shadow-md hover:scale-105 bg-white dark:bg-gray-800"
                        : "opacity-60 bg-gray-100 dark:bg-gray-700"
                    } ${selectedService === service.id ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{service.emoji}</div>
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{service.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{service.duration}</span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={service.available ? "default" : "secondary"}
                          className={service.available ? "bg-green-100 text-green-700" : ""}
                        >
                          {service.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="flex items-center space-x-1">
                            <Award className="w-3 h-3 text-yellow-500" />
                            <span>{service.reward.exp} EXP</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-orange-500">🪙</span>
                            <span>{service.reward.coins}</span>
                          </div>
                          {service.reward.energy && (
                            <div className="flex items-center space-x-1">
                              <span className="text-green-500">⚡</span>
                              <span>+{service.reward.energy}</span>
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          disabled={!service.available || isProcessing}
                          onClick={() => handleServiceAction(service.id)}
                          className={service.available ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          {isProcessing && selectedService === service.id ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            "Start"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Office Atmosphere */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Coffee className="w-8 h-8 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">Office Atmosphere</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    The HR office has a warm, welcoming atmosphere with comfortable seating and motivational posters.
                    Fresh coffee is always brewing, and there's a suggestion box by the door.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center space-y-1"
                  onClick={() => onLocationAction("check-payslip")}
                >
                  <span className="text-2xl">💰</span>
                  <span className="text-sm">Check Payslip</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center space-y-1"
                  onClick={() => onLocationAction("book-leave")}
                >
                  <span className="text-2xl">🏖️</span>
                  <span className="text-sm">Book Leave</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center space-y-1"
                  onClick={() => onLocationAction("employee-handbook")}
                >
                  <span className="text-2xl">📚</span>
                  <span className="text-sm">Handbook</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center space-y-1"
                  onClick={() => onLocationAction("wellness-program")}
                >
                  <span className="text-2xl">🧘</span>
                  <span className="text-sm">Wellness</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
