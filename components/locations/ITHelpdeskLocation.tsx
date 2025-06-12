"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import type { GameState } from "@/types/game"
import { useState } from "react"
import { Monitor, HardDrive, Smartphone, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react"

interface ITHelpdeskLocationProps {
  gameState: GameState
  onLocationAction: (actionId: string) => void
}

export function ITHelpdeskLocation({ gameState, onLocationAction }: ITHelpdeskLocationProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const currentHour = Math.floor(gameState.gameTime / 60) % 24
  const isOfficeHours = currentHour >= 8 && currentHour <= 18

  const itServices = [
    {
      id: "password-reset",
      name: "Password Reset",
      emoji: "🔐",
      description: "Reset your forgotten password for company systems",
      priority: "High",
      duration: "5 mins",
      available: true,
      reward: { exp: 10, coins: 5 },
    },
    {
      id: "software-install",
      name: "Software Installation",
      emoji: "💿",
      description: "Install approved software on your work computer",
      priority: "Medium",
      duration: "15 mins",
      available: isOfficeHours,
      reward: { exp: 20, coins: 10 },
    },
    {
      id: "hardware-repair",
      name: "Hardware Repair",
      emoji: "🔧",
      description: "Fix issues with your keyboard, mouse, or monitor",
      priority: "High",
      duration: "30 mins",
      available: isOfficeHours,
      reward: { exp: 35, coins: 20 },
    },
    {
      id: "network-troubleshoot",
      name: "Network Issues",
      emoji: "🌐",
      description: "Resolve WiFi connectivity and network access problems",
      priority: "Critical",
      duration: "20 mins",
      available: isOfficeHours,
      reward: { exp: 25, coins: 15 },
    },
  ]

  const itStaff = [
    {
      name: "Alex Kumar",
      role: "Senior IT Technician",
      emoji: "👨‍💻",
      status: isOfficeHours ? "Available" : "On Call",
      speciality: "Hardware & Networks",
      mood: "Focused",
    },
    {
      name: "Jenny Liu",
      role: "Software Support",
      emoji: "👩‍💻",
      status: currentHour >= 9 && currentHour <= 17 ? "Available" : "Away",
      speciality: "Applications & Security",
      mood: "Helpful",
    },
  ]

  const systemStatus = [
    { name: "Email Server", status: "Operational", uptime: 99.9 },
    { name: "File Server", status: "Operational", uptime: 98.5 },
    { name: "WiFi Network", status: "Maintenance", uptime: 95.2 },
    { name: "Printer Network", status: "Issues", uptime: 87.3 },
  ]

  const handleServiceAction = async (serviceId: string) => {
    setIsProcessing(true)
    setSelectedTicket(serviceId)

    // Simulate processing time
    setTimeout(() => {
      onLocationAction(serviceId)
      setIsProcessing(false)
      setSelectedTicket(null)
    }, 2000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-700 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operational":
        return "text-green-600"
      case "Maintenance":
        return "text-yellow-600"
      case "Issues":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-800">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6 pb-32">
          {/* Room Header */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-slate-700 to-gray-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">🖥️</div>
                  <div>
                    <h2 className="text-2xl font-bold">IT Helpdesk</h2>
                    <p className="text-slate-300">Technical support and system maintenance</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Clock className="w-4 h-4" />
                    <span>{isOfficeHours ? "Open" : "Emergency Only"}</span>
                  </div>
                  <div className="text-sm text-slate-400">Support: 8 AM - 6 PM</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-slate-600" />
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemStatus.map((system) => (
                  <div
                    key={system.name}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          system.status === "Operational"
                            ? "bg-green-500"
                            : system.status === "Maintenance"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{system.name}</h4>
                        <p className={`text-sm ${getStatusColor(system.status)}`}>{system.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {system.uptime}% uptime
                      </div>
                      <Progress value={system.uptime} className="w-16 h-2 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* IT Staff */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-slate-600" />
                <span>IT Support Team</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itStaff.map((staff) => (
                  <div
                    key={staff.name}
                    className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="text-3xl">{staff.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">{staff.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{staff.role}</p>
                      <p className="text-xs text-gray-500">{staff.speciality}</p>
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

          {/* IT Services */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardDrive className="w-5 h-5 text-slate-600" />
                <span>Support Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itServices.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      service.available
                        ? "hover:shadow-md hover:scale-105 bg-white dark:bg-gray-800"
                        : "opacity-60 bg-gray-100 dark:bg-gray-700"
                    } ${selectedTicket === service.id ? "ring-2 ring-slate-500" : ""}`}
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
                        <div className="flex flex-col space-y-1">
                          <Badge className={getPriorityColor(service.priority)}>{service.priority}</Badge>
                          <Badge
                            variant={service.available ? "default" : "secondary"}
                            className={service.available ? "bg-green-100 text-green-700" : ""}
                          >
                            {service.available ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>{service.reward.exp} EXP</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-orange-500">🪙</span>
                            <span>{service.reward.coins}</span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          disabled={!service.available || isProcessing}
                          onClick={() => handleServiceAction(service.id)}
                          className={service.available ? "bg-slate-600 hover:bg-slate-700" : ""}
                        >
                          {isProcessing && selectedTicket === service.id ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            "Submit Ticket"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Tools */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-slate-600" />
                <span>Self-Service Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center space-y-1"
                  onClick={() => onLocationAction("speed-test")}
                >
                  <span className="text-2xl">📶</span>
                  <span className="text-sm">Speed Test</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center space-y-1"
                  onClick={() => onLocationAction("printer-setup")}
                >
                  <span className="text-2xl">🖨️</span>
                  <span className="text-sm">Printer Setup</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center space-y-1"
                  onClick={() => onLocationAction("vpn-guide")}
                >
                  <span className="text-2xl">🔒</span>
                  <span className="text-sm">VPN Guide</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center space-y-1"
                  onClick={() => onLocationAction("knowledge-base")}
                >
                  <span className="text-2xl">📖</span>
                  <span className="text-sm">Help Docs</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Office Environment */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="w-8 h-8 text-slate-600" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">IT Helpdesk Environment</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    The IT helpdesk is filled with multiple monitors, server racks humming quietly, and cables organized
                    with precision. There's a whiteboard with network diagrams and a coffee machine that's surprisingly
                    well-maintained.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
