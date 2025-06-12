"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress" // Import Progress component
import type { GameState, PortalAction, PortalCategory } from "@/types/game"
import {
  Briefcase,
  Lightbulb,
  Megaphone,
  Heart,
  Laptop,
  FileText,
  Timer,
  Sparkles,
  Coins,
  Zap,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

interface PortalTabProps {
  gameState: GameState
  onPortalAction: (portalId: string, actionId: string) => void
}

const portalCategories: PortalCategory[] = [
  {
    id: "hr-portal",
    name: "HR Portal",
    emoji: "📄",
    icon: Briefcase,
    description: "Manage your leave, benefits, and performance reviews.",
    cooldown: 60, // 1 hour
    actions: [
      {
        id: "submit-leave",
        name: "Submit Leave Request",
        description: "Request time off for vacation or personal matters.",
        effect: { burnout: -10, exp: 5 },
        cost: 0,
        duration: 8,
      },
      {
        id: "check-benefits",
        name: "Check Benefits",
        description: "Review your employee benefits and perks.",
        effect: { exp: 10, shopeeCoins: 20 },
        cost: 0,
        duration: 10,
      },
      {
        id: "performance-review",
        name: "Schedule Performance Review",
        description: "Set up a meeting to discuss your performance and career growth.",
        effect: { exp: 25, productivity: 5 },
        cost: 0,
        duration: 12,
      },
    ],
  },
  {
    id: "it-helpdesk",
    name: "IT Helpdesk",
    emoji: "💻",
    icon: Laptop,
    description: "Get technical support and IT services.",
    cooldown: 60,
    actions: [
      {
        id: "software-update",
        name: "Request Software Update",
        description: "Get the latest software versions for improved efficiency.",
        effect: { productivity: 15, exp: 10 },
        cost: 0,
        duration: 10,
      },
      {
        id: "hardware-repair",
        name: "Submit Hardware Repair",
        description: "Request repair or replacement for faulty equipment.",
        effect: { productivity: 10, burnout: -5 },
        cost: 0,
        duration: 15,
      },
      {
        id: "security-training",
        name: "Complete Security Training",
        description: "Enhance your cybersecurity knowledge and earn a bonus.",
        effect: { exp: 30, shopeeCoins: 25 },
        cost: 0,
        duration: 12,
      },
    ],
  },
  {
    id: "company-news",
    name: "Company News",
    emoji: "📰",
    icon: Megaphone,
    description: "Stay updated with company announcements.",
    cooldown: 30,
    actions: [
      {
        id: "read-newsletter",
        name: "Read Latest Newsletter",
        description: "Catch up on recent company updates and events.",
        effect: { exp: 15, burnout: -5 },
        cost: 0,
        duration: 8,
      },
      {
        id: "quarterly-results",
        name: "Review Quarterly Results",
        description: "Analyze the company's financial performance.",
        effect: { exp: 20, shopeeCoins: 15 },
        cost: 0,
        duration: 10,
      },
      {
        id: "upcoming-events",
        name: "Check Upcoming Events",
        description: "See what social and professional events are planned.",
        effect: { burnout: -10, exp: 10 },
        cost: 0,
        duration: 8,
      },
    ],
  },
  {
    id: "learning-hub",
    name: "Learning Hub",
    emoji: "📚",
    icon: Lightbulb,
    description: "Enhance your skills with training courses.",
    cooldown: 120,
    actions: [
      {
        id: "technical-course",
        name: "Enroll in Technical Course",
        description: "Improve your coding or technical skills.",
        effect: { exp: 50, productivity: 20 },
        cost: 30,
        duration: 15,
      },
      {
        id: "leadership-workshop",
        name: "Attend Leadership Workshop",
        description: "Develop your leadership and management abilities.",
        effect: { exp: 40, burnout: -15, productivity: 10 },
        cost: 25,
        duration: 12,
      },
      {
        id: "certification-exam",
        name: "Take Certification Exam",
        description: "Earn a professional certification to boost your career.",
        effect: { exp: 100, shopeeCoins: 50, productivity: 25 },
        cost: 50,
        duration: 15,
      },
    ],
  },
  {
    id: "feedback-form",
    name: "Feedback System",
    emoji: "📝",
    icon: FileText,
    description: "Share feedback and suggestions.",
    cooldown: 90,
    actions: [
      {
        id: "submit-feedback",
        name: "Submit General Feedback",
        description: "Provide anonymous feedback on any aspect of office life.",
        effect: { exp: 20, burnout: -10 },
        cost: 0,
        duration: 10,
      },
      {
        id: "suggestion-box",
        name: "Drop a Suggestion",
        description: "Propose new ideas for company improvements.",
        effect: { exp: 35, shopeeCoins: 30, burnout: -15 },
        cost: 0,
        duration: 12,
      },
      {
        id: "anonymous-survey",
        name: "Participate in Survey",
        description: "Contribute to company-wide surveys.",
        effect: { exp: 15, shopeeCoins: 10 },
        cost: 0,
        duration: 8,
      },
    ],
  },
  {
    id: "wellness-corner",
    name: "Wellness Corner",
    emoji: "🧘",
    icon: Heart,
    description: "Focus on your mental and physical well-being.",
    cooldown: 45,
    actions: [
      {
        id: "meditation-session",
        name: "Guided Meditation",
        description: "Relax your mind and reduce stress.",
        effect: { burnout: -15, energy: 10 },
        cost: 0,
        duration: 8,
      },
      {
        id: "fitness-challenge",
        name: "Join Fitness Challenge",
        description: "Participate in a company-wide fitness initiative.",
        effect: { energy: 20, burnout: -10, exp: 15 },
        cost: 0,
        duration: 12,
      },
      {
        id: "wellness-workshop",
        name: "Attend Wellness Workshop",
        description: "Learn techniques for better work-life balance.",
        effect: { burnout: -20, productivity: 10, exp: 25 },
        cost: 15,
        duration: 15,
      },
    ],
  },
]

export function PortalTab({ gameState, onPortalAction }: PortalTabProps) {
  const { toast } = useToast()
  const [activeAction, setActiveAction] = useState<{
    portalId: string
    actionId: string
    progress: number
    duration: number
    startTime: number
  } | null>(null)
  const actionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (activeAction) {
      actionIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - activeAction.startTime) / 1000
        const newProgress = Math.min(100, (elapsed / activeAction.duration) * 100)
        setActiveAction((prev) => (prev ? { ...prev, progress: newProgress } : null))

        if (newProgress >= 100) {
          clearInterval(actionIntervalRef.current!)
          onPortalAction(activeAction.portalId, activeAction.actionId)
          setActiveAction(null)
        }
      }, 100) // Update every 100ms
    } else {
      if (actionIntervalRef.current) {
        clearInterval(actionIntervalRef.current)
      }
    }
    return () => {
      if (actionIntervalRef.current) {
        clearInterval(actionIntervalRef.current)
      }
    }
  }, [activeAction, onPortalAction])

  const handleActionClick = (portalId: string, action: PortalAction) => {
    if (activeAction) {
      toast({
        title: "Action in Progress",
        description: "Please wait for the current action to complete.",
        variant: "destructive",
      })
      return
    }

    if (gameState.shopeeCoins < action.cost) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${action.cost} SC to use this service.`,
        variant: "destructive",
      })
      return
    }

    setActiveAction({
      portalId,
      actionId: action.id,
      progress: 0,
      duration: action.duration,
      startTime: Date.now(),
    })
  }

  const getEffectIcon = (effect: any) => {
    if (effect?.exp) return <Sparkles className="w-3 h-3 text-yellow-500" />
    if (effect?.energy) return <Zap className="w-3 h-3 text-green-500" />
    if (effect?.productivity) return <TrendingUp className="w-3 h-3 text-blue-500" />
    if (effect?.burnout && effect.burnout < 0) return <Heart className="w-3 h-3 text-red-500" /> // Lower burnout is better
    if (effect?.burnout && effect.burnout > 0) return <AlertTriangle className="w-3 h-3 text-orange-500" /> // Indicate increase in burnout
    if (effect?.shopeeCoins) return <Coins className="w-3 h-3 text-orange-500" />
    return null
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6 pb-24">
          {portalCategories.map((category) => (
            <Card key={category.id} className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-xl md:text-2xl">
                  <category.icon className="w-6 h-6" />
                  <span>{category.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.actions.map((action) => {
                    const isActionActive =
                      activeAction?.portalId === category.id && activeAction?.actionId === action.id
                    return (
                      <Card
                        key={action.id}
                        className={`transition-all duration-200 ${
                          isActionActive ? "border-2 border-blue-500 shadow-lg" : "hover:shadow-md hover:scale-[1.02]"
                        } ${activeAction ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <CardContent className="p-4 flex flex-col h-full">
                          <h3 className="font-semibold text-base mb-2">{action.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex-1">{action.description}</p>
                          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                            {action.effect &&
                              Object.entries(action.effect).map(([stat, value]) => (
                                <span key={stat} className="flex items-center">
                                  {getEffectIcon({ [stat]: value })}
                                  {value > 0 ? "+" : ""}
                                  {value} {stat.charAt(0).toUpperCase() + stat.slice(1)}
                                </span>
                              ))}
                            {action.cost > 0 && (
                              <span className="flex items-center">
                                <Coins className="w-3 h-3 text-orange-500 mr-1" />
                                Cost: {action.cost} SC
                              </span>
                            )}
                          </div>
                          {isActionActive ? (
                            <div className="w-full">
                              <Progress value={activeAction.progress} className="w-full h-2 [&>*]:bg-blue-500" />
                              <p className="text-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                                {Math.round(activeAction.progress)}% Complete
                              </p>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleActionClick(category.id, action)}
                              disabled={activeAction !== null || gameState.shopeeCoins < action.cost}
                              size="sm"
                              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                            >
                              <Timer className="w-3 h-3 mr-1" />
                              {action.cost > 0 ? "Pay & Start" : "Start Action"}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
