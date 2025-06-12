import type React from "react"
import { Zap, Brain, Users } from "react-feather"

interface CharacterTabProps {
  energy: number
  focus: number
  social: number
}

const CharacterTab: React.FC<CharacterTabProps> = ({ energy, focus, social }) => {
  return (
    <div>
      {/* Stats Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Stats:</h3>
        <div className="space-y-4">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-orange-500 mr-2" />
                <span className="font-medium">Energy</span>
              </div>
              <span className="font-medium">{energy}/100</span>
            </div>
            <div className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${energy}%` }}
              >
                {energy > 15 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {energy}%
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Energy is consumed when working on tasks and replenished by eating lunch or using items.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Brain className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-medium">Focus</span>
              </div>
              <span className="font-medium">{focus}/100</span>
            </div>
            <div className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${focus}%` }}
              >
                {focus > 15 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {focus}%
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Focus affects your work efficiency. Boost it with coffee and other items.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-medium">Social</span>
              </div>
              <span className="font-medium">{social}/100</span>
            </div>
            <div className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
                style={{ width: `${social}%` }}
              >
                {social > 15 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {social}%
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Social represents your interactions with colleagues. Improve it by using SeaTalk and attending events.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterTab
