"use client"

import { Button } from "@/components/ui/button"
import type { TabType, BottomNavigationTab } from "@/types/game"

interface BottomNavigationProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  tabs: BottomNavigationTab[]
  // Removed: disabled: boolean // New prop to disable navigation
}

export function BottomNavigation({ activeTab, setActiveTab, tabs }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around p-2 shadow-lg z-[100] overflow-hidden">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          className={`flex flex-col items-center text-xs px-2 py-1 h-auto flex-1 min-w-0 ${
            activeTab === tab.id ? "text-orange-500 dark:text-orange-400" : "text-gray-600 dark:text-gray-300"
          }`}
          onClick={() => setActiveTab(tab.id)}
          // Removed: disabled={disabled} // Apply disabled prop
        >
          <span className="text-xl mb-1">{tab.icon}</span>
          <span className="truncate">{tab.name}</span>
        </Button>
      ))}
    </div>
  )
}
