"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { GameState, SeaTalkMessage } from "@/types/game"
import { Send, MessageSquare, User, Bot } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { formatGameTime } from "@/utils/gameUtils"

interface SeaTalkTabProps {
  gameState: GameState
  onSendMessage: (message: string) => void
}

export function SeaTalkTab({ gameState, onSendMessage }: SeaTalkTabProps) {
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput)
      setMessageInput("")
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [gameState.seaTalkMessages])

  const getSenderIcon = (sender: string) => {
    if (sender === "user") {
      return <User className="w-4 h-4 text-blue-500" />
    } else if (sender.includes("Bot")) {
      return <Bot className="w-4 h-4 text-purple-500" />
    } else {
      return <MessageSquare className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <Card className="flex-1 flex flex-col shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg flex-shrink-0">
          <CardTitle className="flex items-center space-x-2 text-xl md:text-2xl">
            <span className="text-2xl">💬</span>
            <span>SeaTalk Chat</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {gameState.seaTalkMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">👋</div>
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                gameState.seaTalkMessages.map((message: SeaTalkMessage) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender !== "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm">
                        {getSenderIcon(message.sender)}
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none"
                      }`}
                    >
                      <div className="font-semibold text-sm mb-1 flex items-center gap-1">
                        {message.sender === "user" ? (
                          <>
                            <span>You</span>
                            {getSenderIcon(message.sender)}
                          </>
                        ) : (
                          <>
                            {getSenderIcon(message.sender)}
                            <span>{message.sender}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {formatGameTime(message.timestamp)}
                      </p>
                    </div>
                    {message.sender === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm">
                        {getSenderIcon(message.sender)}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 flex-shrink-0">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend()
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!messageInput.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
