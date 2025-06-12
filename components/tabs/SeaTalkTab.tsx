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
    <div className="p-4 space-y-4 h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>SeaTalk Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-4 pt-0">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {gameState.seaTalkMessages.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No messages yet. Start a conversation!</p>
              ) : (
                gameState.seaTalkMessages.map((message: SeaTalkMessage) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-orange-500 text-white rounded-br-none"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-bl-none"
                      }`}
                    >
                      <div className="font-semibold text-sm mb-1">
                        {message.sender === "user" ? "You 👤" : message.sender}
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <div className="text-xs text-right mt-1 opacity-75">
                        {formatGameTime(message.timestamp, true)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <div className="flex mt-4 space-x-2">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!messageInput.trim()}>
              <Send className="w-5 h-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
