"use client"

import type React from "react"
import { Building2, CheckSquare, MessageCircle, Map, Coffee, User, ShoppingCart, Globe } from "lucide-react"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  disabled: boolean // New prop
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange, disabled }) => {
  const tabs = [
    { id: "office", icon: Building2, label: "Office" },
    { id: "tasks", icon: CheckSquare, label: "Tasks" },
    { id: "seatalk", icon: MessageCircle, label: "SeaTalk" },
    { id: "navigate", icon: Map, label: "Navigate" },
    { id: "lunch", icon: Coffee, label: "Lunch" },
    { id: "character", icon: User, label: "Character" },
    { id: "shop", icon: ShoppingCart, label: "Shop" },
    { id: "portal", icon: Globe, label: "Portal" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTab === tab.id ? "text-orange-500 bg-orange-50" : "text-gray-500"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} // Apply disabled style
            disabled={disabled} // Disable button
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
