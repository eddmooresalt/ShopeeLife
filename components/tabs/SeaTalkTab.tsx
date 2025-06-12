"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GameState, SeaTalkMessage } from "@/types/game"
import { formatGameTime } from "@/utils/gameUtils"
import { Send } from "lucide-react"

interface SeaTalkTabProps {
  gameState: GameState
  onSendMessage: (message: string) => void
}

export function SeaTalkTab({ gameState, onSendMessage }: SeaTalkTabProps) {
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim())
      setMessageInput("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [gameState.seaTalkMessages])

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col p-4">
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">💬</span>
            <span>SeaTalk Chat</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3 min-h-[400px]">
              {gameState.seaTalkMessages.length === 0 ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <p className="text-gray-500 dark:text-gray-400">No messages yet. Start a conversation!</p>
                  </div>
                </div>
              ) : (
                gameState.seaTalkMessages.map((message: SeaTalkMessage) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-none"
                          : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-bl-none border border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <div className="font-semibold text-sm mb-1 flex items-center space-x-2">
                        <span>{message.sender === "user" ? "You" : message.sender}</span>
                        <span className="text-lg">
                          {message.sender === "user"
                            ? "👤"
                            : message.sender.includes("HR")
                              ? "🤖"
                              : message.sender.includes("TeamLead")
                                ? "👨‍💼"
                                : message.sender.includes("Dev")
                                  ? "👩‍💻"
                                  : message.sender.includes("Marketing")
                                    ? "📈"
                                    : message.sender.includes("Intern")
                                      ? "🎓"
                                      : "👥"}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className="text-xs text-right mt-2 opacity-75">
                        {formatGameTime(message.timestamp, true)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!messageInput.trim()}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                <Send className="w-5 h-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
