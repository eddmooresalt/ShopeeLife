"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GameState, ShopItem } from "@/types/game"

interface ShopTabProps {
  gameState: GameState
  onBuyItem: (itemId: string) => void
}

export function ShopTab({ gameState, onBuyItem }: ShopTabProps) {
  const { shopItems, shopeeCoins } = gameState

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Shopee Shop</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            {shopItems.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No items available in the shop.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopItems.map((item: ShopItem) => (
                  <Card
                    key={item.id}
                    className={`flex flex-col items-center text-center p-4 ${
                      item.isBought ? "opacity-60 border-green-500" : "" // Added green border for owned items
                    }`}
                  >
                    <span className="text-4xl mb-2">{item.emoji}</span>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.description}</p>
                    <p className="text-md font-bold mb-4">{item.price} SC</p>
                    <Button
                      onClick={() => onBuyItem(item.id)}
                      disabled={item.isBought || shopeeCoins < item.price}
                      className="w-full"
                    >
                      {item.isBought ? "Owned" : "Buy"}
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
