"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Award } from "lucide-react"
import type { GameState, Role, SelectedCharacterParts, OrgNode, CustomizationItem } from "../../types/game"
import { characterCustomizationOptions, organizationChart } from "../../data/gameData"

interface CharacterTabProps {
  gameState: GameState
  currentRole: Role
  selectedCharacterParts: SelectedCharacterParts
  onCharacterPartChange: (category: keyof SelectedCharacterParts, itemId: string) => void
}

const CharacterAvatar: React.FC<{ parts: SelectedCharacterParts }> = ({ parts }) => {
  const getPartStyle = (category: keyof typeof characterCustomizationOptions, partId: string) => {
    const item = characterCustomizationOptions[category].find((item) => item.id === partId)
    return item ? { backgroundColor: item.color } : {}
  }

  const getHairStyle = (hairId: string) => {
    const hair = characterCustomizationOptions.hairStyle.find((item) => item.id === hairId)
    if (!hair) return {}
    const baseStyle = {
      backgroundColor: hair.color,
      position: "absolute",
      top: "0%",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 2,
    }
    switch (hair.shape) {
      case "short":
        return { ...baseStyle, width: "80%", height: "40%", borderRadius: "50% 50% 0 0" }
      case "long":
        return { ...baseStyle, width: "90%", height: "60%", borderRadius: "50% 50% 20% 20%" }
      case "curly":
        return { ...baseStyle, width: "85%", height: "50%", borderRadius: "50%", boxShadow: "0 0 5px rgba(0,0,0,0.2)" }
      case "ponytail":
        return {
          ...baseStyle,
          width: "70%",
          height: "55%",
          borderRadius: "50% 50% 10% 10%",
          transform: "translateX(-50%) rotate(5deg)",
        }
      default:
        return {}
    }
  }

  const getAccessoryEmoji = (accessoryId: string) => {
    const accessory = characterCustomizationOptions.accessories.find((item) => item.id === accessoryId)
    return accessory?.emoji || null
  }

  return (
    <div className="relative w-32 h-32 mx-auto mb-4">
      {/* Base Head (Skin) */}
      <div
        className="absolute top-0 left-0 w-full h-full rounded-full z-0"
        style={getPartStyle("skinColor", parts.skinColor)}
      />

      {/* Hair */}
      <div style={getHairStyle(parts.hairStyle)} />

      {/* Body (simplified) */}
      <div
        className="absolute top-[45%] left-1/2 -translate-x-1/2 w-24 h-24 rounded-lg z-10"
        style={getPartStyle("tops", parts.top)}
      />
      <div
        className="absolute top-[70%] left-1/2 -translate-x-1/2 w-20 h-16 rounded-lg z-10"
        style={getPartStyle("bottoms", parts.bottom)}
      />
      {/* Shoes - very simplified */}
      <div
        className="absolute bottom-0 left-1/4 w-8 h-4 rounded-t-full z-10"
        style={getPartStyle("shoes", parts.shoes)}
      />
      <div
        className="absolute bottom-0 right-1/4 w-8 h-4 rounded-t-full z-10"
        style={getPartStyle("shoes", parts.shoes)}
      />

      {/* Accessories (e.g., glasses emoji) */}
      {parts.accessory !== "none" && getAccessoryEmoji(parts.accessory) && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-2xl z-30">
          {getAccessoryEmoji(parts.accessory)}
        </div>
      )}
    </div>
  )
}

const CharacterTab: React.FC<CharacterTabProps> = ({
  gameState,
  currentRole,
  selectedCharacterParts,
  onCharacterPartChange,
}) => {
  // Calculate performance grade
  const calculatePerformanceGrade = (state: GameState): string => {
    const { productivity, burnout, experience, level } = state
    let score = 0

    // Productivity contributes positively
    score += productivity * 0.4 // 40% weight
    // Burnout contributes negatively
    score -= burnout * 0.3 // 30% weight
    // Experience and level contribute positively
    score += (experience / 10) * 0.2 // 20% weight, scale XP down
    score += level * 5 // 10% weight for level

    // Normalize score to a 0-100 scale (rough estimation)
    // Max possible score: 100 (prod) - 0 (burnout) + 800 (xp/10) + 35 (level 7*5) = ~935
    // Min possible score: 0 (prod) - 100 (burnout) + 0 (xp) + 0 (level) = -100
    const normalizedScore = Math.max(0, Math.min(100, (score + 100) / 10)) // Adjust divisor and offset as needed

    if (normalizedScore >= 90) return "A+"
    if (normalizedScore >= 80) return "A"
    if (normalizedScore >= 70) return "B+"
    if (normalizedScore >= 60) return "B"
    if (normalizedScore >= 50) return "C+"
    if (normalizedScore >= 40) return "C"
    if (normalizedScore >= 30) return "D"
    return "F"
  }

  const performanceGrade = calculatePerformanceGrade(gameState)

  // Build organization chart display
  const buildOrgChart = (nodes: OrgNode[], parentId: string | undefined, level = 0) => {
    const children = nodes.filter((node) => node.reportsTo === parentId)
    if (children.length === 0) return null

    return (
      <ul className={`ml-${level * 4} mt-2`}>
        {children.map((node) => (
          <li key={node.id} className="mb-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{node.emoji}</span>
              <div>
                <p className="font-medium text-sm">
                  {node.name} <Badge variant="secondary">{node.title}</Badge>
                </p>
              </div>
            </div>
            {buildOrgChart(nodes, node.id, level + 1)}
          </li>
        ))}
      </ul>
    )
  }

  const playerOrgNode = organizationChart.find((node) => node.id === "you")
  if (playerOrgNode) {
    playerOrgNode.title = currentRole.title // Update player's title dynamically
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Character Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              {/* Character Avatar */}
              <CharacterAvatar parts={selectedCharacterParts} />

              <h2 className="text-xl font-bold">{currentRole.title}</h2>
              <p className="text-gray-600">{currentRole.description}</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>🎯 Level:</span>
                <Badge>{gameState.level + 1}</Badge>
              </div>
              <div className="flex justify-between">
                <span>🏆 Experience:</span>
                <span className="font-medium">{gameState.experience} XP</span>
              </div>
              <div className="flex justify-between">
                <span>💰 Salary:</span>
                <span className="font-medium">${currentRole.salary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>💵 Total Earnings:</span>
                <span className="font-medium">${gameState.money.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>📅 Days Worked:</span>
                <span className="font-medium">{gameState.day}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>📈 Performance Grade:</span>
                <Badge
                  className={`text-lg font-bold ${
                    performanceGrade.startsWith("A")
                      ? "bg-green-500 text-white"
                      : performanceGrade.startsWith("B")
                        ? "bg-blue-500 text-white"
                        : performanceGrade.startsWith("C")
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                  }`}
                >
                  {performanceGrade}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customize Appearance</CardTitle>
            <CardDescription>Personalize your character</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(characterCustomizationOptions).map(([category, items]) => (
                <div key={category}>
                  <h3 className="font-medium mb-2 capitalize">{category.replace(/([A-Z])/g, " $1").trim()}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {items.map((item: CustomizationItem) => (
                      <Button
                        key={item.id}
                        variant={selectedCharacterParts[category] === item.id ? "default" : "outline"}
                        size="sm"
                        className="text-xs p-2 h-auto"
                        onClick={() => {
                          if (item.unlocked) {
                            onCharacterPartChange(category as keyof SelectedCharacterParts, item.id)
                          }
                        }}
                        disabled={!item.unlocked}
                      >
                        <div className="text-center">
                          <p className="font-medium">
                            {item.emoji && <span className="mr-1 text-base">{item.emoji}</span>}
                            {item.name}
                          </p>
                          {!item.unlocked && <p className="text-xs text-gray-500">${item.price}</p>}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600">Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Organization Chart
            </CardTitle>
            <CardDescription>Understand your place in the company hierarchy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              {buildOrgChart(organizationChart, undefined)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CharacterTab
