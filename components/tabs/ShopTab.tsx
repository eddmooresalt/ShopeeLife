"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { GameState, ShopItem } from "@/types/game"
import { Star, Zap, TrendingUp, Heart, Shield } from "lucide-react"

interface ShopTabProps {
  gameState: GameState
  onBuyItem: (itemId: string) => void
}

export function ShopTab({ gameState, onBuyItem }: ShopTabProps) {
  const { shopItems, shopeeCoins } = gameState

  const getItemRarity = (price: number) => {
    if (price >= 200) return { label: "Legendary", color: "bg-purple-500", icon: "✨" }
    if (price >= 100) return { label: "Epic", color: "bg-blue-500", icon: "💎" }
    if (price >= 50) return { label: "Rare", color: "bg-green-500", icon: "🌟" }
    return { label: "Common", color: "bg-gray-500", icon: "⚪" }
  }

  const getEffectIcon = (effect: any) => {
    if (effect?.energy) return <Zap className="w-4 h-4 text-yellow-500" />
    if (effect?.productivity) return <TrendingUp className="w-4 h-4 text-blue-500" />
    if (effect?.burnout && effect.burnout < 0) return <Heart className="w-4 h-4 text-red-500" />
    if (effect?.workEfficiency) return <Shield className="w-4 h-4 text-purple-500" />
    return <Star className="w-4 h-4 text-gray-500" />
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col p-4">
      <Card className="flex-1 min-h-0">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🛒</span>
              <span>Shopee Premium Store</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
              <span className="text-lg">🧡</span>
              <span className="font-bold">{shopeeCoins} SC</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full p-0">
          <ScrollArea className="h-full p-4 pb-24">
            {shopItems.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-500 dark:text-gray-400">No items available in the shop.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopItems.map((item: ShopItem) => {
                  const rarity = getItemRarity(item.price)
                  return (
                    <Card
                      key={item.id}
                      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                        item.isBought
                          ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300"
                          : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:from-purple-50 hover:to-pink-50"
                      }`}
                    >
                      {/* Rarity Badge */}
                      <div
                        className={`absolute top-2 right-2 ${rarity.color} text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1`}
                      >
                        <span>{rarity.icon}</span>
                        <span>{rarity.label}</span>
                      </div>

                      {/* Owned Badge */}
                      {item.isBought && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                          <span>✅</span>
                          <span>Owned</span>
                        </div>
                      )}

                      <CardContent className="p-6 text-center">
                        <div className="text-6xl mb-4">{item.emoji}</div>
                        <h3 className="font-bold text-xl mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Effects Display */}
                        {item.effect && (
                          <div className="mb-4 space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Effects:</h4>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {Object.entries(item.effect).map(([stat, value]) => (
                                <div
                                  key={stat}
                                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                                    value > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {getEffectIcon(item.effect)}
                                  <span>
                                    {value > 0 ? "+" : ""}
                                    {value}
                                    {stat === "workEfficiency" ? "% efficiency" : ` ${stat}`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Price and Buy Button */}
                        <div className="space-y-3">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{item.price} SC</div>
                          <Button
                            onClick={() => onBuyItem(item.id)}
                            disabled={item.isBought || shopeeCoins < item.price}
                            className={`w-full text-lg font-semibold py-3 ${
                              item.isBought
                                ? "bg-green-500 hover:bg-green-600"
                                : shopeeCoins < item.price
                                  ? "bg-gray-400"
                                  : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                            }`}
                          >
                            {item.isBought ? (
                              <div className="flex items-center space-x-2">
                                <span>✅</span>
                                <span>Owned</span>
                              </div>
                            ) : shopeeCoins < item.price ? (
                              <div className="flex items-center space-x-2">
                                <span>💸</span>
                                <span>Not Enough SC</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span>🛒</span>
                                <span>Buy Now</span>
                              </div>
                            )}
                          </Button>
                        </div>

                        {/* Item Type Badge */}
                        <div className="mt-3">
                          <Badge variant="outline" className="text-xs">
                            {item.type === "consumable" && "🍃 Consumable"}
                            {item.type === "equipment" && "⚙️ Equipment"}
                            {item.type === "wardrobe" && "👕 Wardrobe"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
