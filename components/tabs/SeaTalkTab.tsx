"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Users, Clock } from "lucide-react"
import type { ChatMessage } from "../../types/game"

interface SeaTalkTabProps {
  chatMessages: ChatMessage[]
  newMessage: string
  isWorkingHours: boolean
  dayTransition: boolean
  onMessageChange: (message: string) => void
  onSendMessage: () => void
}

const SeaTalkTab: React.FC<SeaTalkTabProps> = ({
  chatMessages,
  newMessage,
  isWorkingHours,
  dayTransition,
  onMessageChange,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null) // Ref for auto-scrolling

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const getOnlineStatus = () => {
    if (!isWorkingHours || dayTransition) return "🔴 Offline"
    return "🟢 Online"
  }

  const getActiveUsers = () => {
    if (!isWorkingHours || dayTransition) return 0
    return Math.floor(Math.random() * 15) + 5 // 5-20 users online
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                SeaTalk - Office Chat
              </CardTitle>
              <CardDescription>Connect with your colleagues</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {getActiveUsers()} online
              </Badge>
              <Badge variant={isWorkingHours && !dayTransition ? "default" : "secondary"}>{getOnlineStatus()}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-4">
            {chatMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-lg p-4 transition-all hover:shadow-sm ${
                    msg.sender === "You" ? "bg-orange-50 ml-8 border-l-4 border-orange-500" : "bg-white mr-8 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        msg.sender === "You"
                          ? "bg-orange-500"
                          : msg.avatar === "HR"
                            ? "bg-blue-500"
                            : msg.avatar === "TL"
                              ? "bg-green-500"
                              : msg.avatar === "IT"
                                ? "bg-purple-500"
                                : msg.avatar === "MG"
                                  ? "bg-red-500"
                                  : msg.avatar === "CL"
                                    ? "bg-cyan-500"
                                    : msg.avatar === "PM"
                                      ? "bg-pink-500"
                                      : msg.avatar === "FN"
                                        ? "bg-yellow-500"
                                        : msg.avatar === "MK"
                                          ? "bg-indigo-500"
                                          : "bg-gray-500"
                      }`}
                    >
                      {msg.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{msg.sender}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {msg.time}
                        </div>
                      </div>
                      {msg.sender !== "You" && <p className="text-xs text-gray-500">{msg.department || "General"}</p>}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  {msg.reactions && (
                    <div className="flex gap-1 mt-2">
                      {msg.reactions.map((reaction, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {reaction}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} /> {/* Element to scroll to */}
          </div>

          <div className="border-t pt-4">
            {isWorkingHours && !dayTransition ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => onMessageChange(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Button
                    onClick={onSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    📤 Send
                  </Button>
                </div>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => onMessageChange("Great work")}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                  >
                    Great work
                  </button>
                  <button
                    onClick={() => onMessageChange("Coffee break")}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                  >
                    Coffee break
                  </button>
                  <button
                    onClick={() => onMessageChange("Offer help")}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                  >
                    Offer help
                  </button>
                  <button
                    onClick={() => onMessageChange("Lunch")}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                  >
                    Lunch
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 bg-gray-100 rounded-lg">
                <p className="text-gray-500 text-sm">Chat unavailable outside work hours</p>
                <p className="text-gray-400 text-xs mt-1">Come back during office hours to chat with colleagues</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SeaTalkTab
