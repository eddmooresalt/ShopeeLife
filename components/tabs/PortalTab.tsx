"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import type { GameState } from "@/types/game"
import { useState } from "react"
import {
  FileText,
  Computer,
  Newspaper,
  BookOpen,
  MessageSquare,
  Heart,
  Clock,
  Award,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

interface PortalTabProps {
  gameState: GameState
  onPortalAction: (portalId: string, actionType: string) => void
}

export function PortalTab({ gameState, onPortalAction }: PortalTabProps) {
  const { toast } = useToast()
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null)
  const [lastUsed, setLastUsed] = useState<Record<string, number>>({})

  // Check if portal can be used (cooldown system)
  const canUsePortal = (portalId: string, cooldownMinutes = 60) => {
    const lastUsedTime = lastUsed[portalId] || 0
    const currentTime = gameState.gameTime
    return currentTime - lastUsedTime >= cooldownMinutes
  }

  const getTimeUntilAvailable = (portalId: string, cooldownMinutes = 60) => {
    const lastUsedTime = lastUsed[portalId] || 0
    const currentTime = gameState.gameTime
    const timeLeft = cooldownMinutes - (currentTime - lastUsedTime)
    return Math.max(0, timeLeft)
  }

  const handlePortalAction = (portalId: string, actionType: string, cooldownMinutes = 60) => {
    if (!canUsePortal(portalId, cooldownMinutes)) {
      const timeLeft = getTimeUntilAvailable(portalId, cooldownMinutes)
      toast({
        title: "Portal Cooldown",
        description: `Please wait ${timeLeft} more minutes before using this portal again.`,
        variant: "destructive",
      })
      return
    }

    setLastUsed((prev) => ({ ...prev, [portalId]: gameState.gameTime }))
    onPortalAction(portalId, actionType)
  }

  const portals = [
    {
      id: "hr-portal",
      name: "HR Portal",
      emoji: "📄",
      icon: FileText,
      description: "Access HR services and employee benefits.",
      cooldown: 120, // 2 hours
      actions: [
        {
          id: "submit-leave",
          name: "Submit Leave Request",
          description: "Request time off (reduces burnout)",
          effect: { burnout: -10, exp: 5 },
          cost: 0,
        },
        {
          id: "check-benefits",
          name: "Check Benefits",
          description: "Review your employee benefits",
          effect: { exp: 10, shopeeCoins: 20 },
          cost: 0,
        },
        {
          id: "performance-review",
          name: "Schedule Performance Review",
          description: "Book your quarterly review",
          effect: { exp: 25, productivity: 5 },
          cost: 0,
        },
      ],
    },
    {
      id: "it-helpdesk",
      name: "IT Helpdesk",
      emoji: "💻",
      icon: Computer,
      description: "Get technical support and IT services.",
      cooldown: 90, // 1.5 hours
      actions: [
        {
          id: "software-update",
          name: "Request Software Update",
          description: "Update your work tools (boosts productivity)",
          effect: { productivity: 15, exp: 10 },
          cost: 0,
        },
        {
          id: "hardware-repair",
          name: "Hardware Repair Request",
          description: "Fix technical issues",
          effect: { productivity: 10, burnout: -5 },
          cost: 0,
        },
        {
          id: "security-training",
          name: "Security Training",
          description: "Complete cybersecurity training",
          effect: { exp: 30, shopeeCoins: 25 },
          cost: 0,
        },
      ],
    },
    {
      id: "company-news",
      name: "Company News",
      emoji: "📰",
      icon: Newspaper,
      description: "Stay updated with company announcements.",
      cooldown: 60, // 1 hour
      actions: [
        {
          id: "read-newsletter",
          name: "Read Weekly Newsletter",
          description: "Stay informed about company updates",
          effect: { exp: 15, social: 5 },
          cost: 0,
        },
        {
          id: "quarterly-results",
          name: "View Quarterly Results",
          description: "Check company performance",
          effect: { exp: 20, shopeeCoins: 15 },
          cost: 0,
        },
        {
          id: "upcoming-events",
          name: "Check Upcoming Events",
          description: "See what's happening this month",
          effect: { social: 10, exp: 10 },
          cost: 0,
        },
      ],
    },
    {
      id: "learning-hub",
      name: "Learning Hub",
      emoji: "📚",
      icon: BookOpen,
      description: "Enhance your skills with training courses.",
      cooldown: 180, // 3 hours
      actions: [
        {
          id: "technical-course",
          name: "Technical Skills Course",
          description: "Improve your technical abilities",
          effect: { exp: 50, productivity: 20 },
          cost: 30,
        },
        {
          id: "leadership-workshop",
          name: "Leadership Workshop",
          description: "Develop leadership skills",
          effect: { exp: 40, social: 15, productivity: 10 },
          cost: 25,
        },
        {
          id: "certification-exam",
          name: "Professional Certification",
          description: "Earn industry certification",
          effect: { exp: 100, shopeeCoins: 50, productivity: 25 },
          cost: 50,
        },
      ],
    },
    {
      id: "feedback-form",
      name: "Feedback System",
      emoji: "📝",
      icon: MessageSquare,
      description: "Share feedback and suggestions.",
      cooldown: 240, // 4 hours
      actions: [
        {
          id: "submit-feedback",
          name: "Submit Feedback",
          description: "Share your thoughts on workplace improvements",
          effect: { exp: 20, social: 10 },
          cost: 0,
        },
        {
          id: "suggestion-box",
          name: "Innovation Suggestion",
          description: "Propose new ideas for the company",
          effect: { exp: 35, shopeeCoins: 30, social: 15 },
          cost: 0,
        },
        {
          id: "anonymous-survey",
          name: "Complete Survey",
          description: "Participate in company survey",
          effect: { exp: 15, shopeeCoins: 10 },
          cost: 0,
        },
      ],
    },
    {
      id: "wellness-corner",
      name: "Wellness Corner",
      emoji: "🧘",
      icon: Heart,
      description: "Focus on your mental and physical well-being.",
      cooldown: 45, // 45 minutes
      actions: [
        {
          id: "meditation-session",
          name: "Guided Meditation",
          description: "10-minute mindfulness session",
          effect: { burnout: -15, energy: 10 },
          cost: 0,
        },
        {
          id: "fitness-challenge",
          name: "Daily Fitness Challenge",
          description: "Complete today's exercise routine",
          effect: { energy: 20, burnout: -10, exp: 15 },
          cost: 0,
        },
        {
          id: "wellness-workshop",
          name: "Wellness Workshop",
          description: "Learn stress management techniques",
          effect: { burnout: -20, productivity: 10, exp: 25 },
          cost: 15,
        },
      ],
    },
  ]

  const selectedPortalData = portals.find((p) => p.id === selectedPortal)

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Computer className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Office Portals</h1>
            <p className="text-blue-100">Access company services and resources</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 pb-24">
          {!selectedPortal ? (
            /* Portal Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portals.map((portal) => {
                const Icon = portal.icon
                const isAvailable = canUsePortal(portal.id, portal.cooldown)
                const timeLeft = getTimeUntilAvailable(portal.id, portal.cooldown)

                return (
                  <Card
                    key={portal.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isAvailable ? "hover:scale-105" : "opacity-75"
                    }`}
                    onClick={() => isAvailable && setSelectedPortal(portal.id)}
                  >
                    <CardHeader className="text-center pb-2">
                      <div className="flex justify-center mb-3">
                        <div
                          className={`p-4 rounded-full ${
                            isAvailable ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          <Icon
                            className={`w-8 h-8 ${isAvailable ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}
                          />
                        </div>
                      </div>
                      <CardTitle className="flex items-center justify-center space-x-2">
                        <span className="text-2xl">{portal.emoji}</span>
                        <span>{portal.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{portal.description}</p>

                      {isAvailable ? (
                        <Badge variant="default" className="bg-green-500">
                          <Clock className="w-3 h-3 mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <div className="space-y-2">
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            Cooldown: {timeLeft}m
                          </Badge>
                          <Progress value={((portal.cooldown - timeLeft) / portal.cooldown) * 100} className="h-2" />
                        </div>
                      )}

                      <div className="mt-3 text-xs text-gray-500">{portal.actions.length} services available</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            /* Portal Detail View */
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" onClick={() => setSelectedPortal(null)} className="mr-3">
                        ← Back
                      </Button>
                      <span className="text-3xl">{selectedPortalData?.emoji}</span>
                      <div>
                        <CardTitle>{selectedPortalData?.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPortalData?.description}</p>
                      </div>
                    </div>
                    <Badge
                      variant={canUsePortal(selectedPortal, selectedPortalData?.cooldown) ? "default" : "secondary"}
                    >
                      {canUsePortal(selectedPortal, selectedPortalData?.cooldown) ? "Available" : "On Cooldown"}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedPortalData?.actions.map((action) => (
                  <Card key={action.id} className="h-full">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{action.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{action.description}</p>

                      {/* Effects Display */}
                      <div className="space-y-2 mb-4">
                        {action.effect.exp && (
                          <div className="flex items-center text-sm">
                            <Award className="w-4 h-4 mr-2 text-yellow-500" />
                            <span>+{action.effect.exp} EXP</span>
                          </div>
                        )}
                        {action.effect.shopeeCoins && (
                          <div className="flex items-center text-sm">
                            <span className="w-4 h-4 mr-2 text-orange-500">🧡</span>
                            <span>+{action.effect.shopeeCoins} SC</span>
                          </div>
                        )}
                        {action.effect.energy && (
                          <div className="flex items-center text-sm">
                            <Zap className="w-4 h-4 mr-2 text-green-500" />
                            <span>+{action.effect.energy} Energy</span>
                          </div>
                        )}
                        {action.effect.productivity && (
                          <div className="flex items-center text-sm">
                            <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                            <span>+{action.effect.productivity} Productivity</span>
                          </div>
                        )}
                        {action.effect.social && (
                          <div className="flex items-center text-sm">
                            <Users className="w-4 h-4 mr-2 text-purple-500" />
                            <span>+{action.effect.social} Social</span>
                          </div>
                        )}
                        {action.effect.burnout && action.effect.burnout < 0 && (
                          <div className="flex items-center text-sm">
                            <Heart className="w-4 h-4 mr-2 text-red-500" />
                            <span>{action.effect.burnout} Burnout</span>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => handlePortalAction(selectedPortal, action.id, selectedPortalData?.cooldown)}
                        disabled={
                          !canUsePortal(selectedPortal, selectedPortalData?.cooldown) ||
                          (action.cost > 0 && gameState.shopeeCoins < action.cost)
                        }
                        className="w-full"
                      >
                        {action.cost > 0 ? `Use (${action.cost} SC)` : "Use Service"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
