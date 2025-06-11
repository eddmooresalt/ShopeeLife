"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import type { GameState, ShopProduct } from "../../types/game"

interface ShopTabProps {
  gameState: GameState
  activeShopCategory: string
  inventory: any[]
  shopProducts: Record<string, ShopProduct[]>
  onCategoryChange: (category: string) => void
  onSelectProduct: (product: ShopProduct) => void
}

export const ShopTab: React.FC<ShopTabProps> = ({
  gameState,
  activeShopCategory,
  inventory,
  shopProducts,
  onCategoryChange,
  onSelectProduct,
}) => {
  const getProductEffects = (product: ShopProduct) => {
    const effects = []
    // Use optional chaining to safely access properties of product.effects
    if (product.effects?.productivity)
      effects.push(`🧠 ${product.effects.productivity > 0 ? "+" : ""}${product.effects.productivity} Prod`)
    if (product.effects?.energy)
      effects.push(`⚡ ${product.effects.energy > 0 ? "+" : ""}${product.effects.energy} Energy`)
    if (product.effects?.burnout)
      effects.push(`😰 ${product.effects.burnout > 0 ? "+" : ""}${product.effects.burnout} Burnout`)
    if (product.effects?.experience)
      effects.push(`🏆 ${product.effects.experience > 0 ? "+" : ""}${product.effects.experience} XP`)
    if (product.effects?.money) effects.push(`💵 ${product.effects.money > 0 ? "+" : ""}${product.effects.money} SC`)
    return effects
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Shopee Office Store
              </CardTitle>
              <CardDescription>Upgrade your workspace and boost your performance</CardDescription>
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-2 bg-orange-100 px-3 py-2 rounded-lg">
              <div className="text-xl">💵</div>
              <div>
                <p className="text-xs text-orange-800">Your Balance</p>
                <p className="text-lg font-bold text-orange-700">{gameState.money.toLocaleString()} SC</p>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Category Navigation */}
        <div className="px-6 border-b">
          <div className="flex overflow-x-auto space-x-4 py-2">
            {[
              { id: "productivity", label: "Productivity" },
              { id: "wellness", label: "Wellness" },
              { id: "consumables", label: "Consumables" },
              { id: "premium", label: "Premium" },
              { id: "inventory", label: "My Items" },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-4 py-2 whitespace-nowrap rounded-lg transition-colors ${
                  activeShopCategory === category.id ? "bg-orange-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <CardContent className="pt-6">
          {/* Inventory View */}
          {activeShopCategory === "inventory" ? (
            <div>
              <h3 className="text-lg font-medium mb-4">Your Purchased Items</h3>
              {inventory.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">You haven't purchased any items yet.</p>
                  <p className="text-gray-400 text-sm mt-1">Browse the store to upgrade your workspace!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventory.map((item, index) => {
                    const effects = getProductEffects(item)
                    return (
                      <Card key={`${item.id}-${index}`} className="overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{item.emoji}</span>
                              <h4 className="font-medium">{item.name}</h4>
                            </div>
                            {item.premium && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">Premium</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {item.duration === "permanent" ? "Permanent Item" : `Duration: ${item.duration}`}
                          </p>
                        </div>
                        <CardContent className="p-3">
                          <p className="text-sm mb-2">{item.description}</p>
                          {effects.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {effects.map((effect, effectIndex) => (
                                <Badge key={effectIndex} variant="outline" className="text-xs">
                                  {effect}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Product Category View */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopProducts[activeShopCategory]?.map((product) => {
                  const isAffordable = gameState.money >= product.price
                  const isLevelLocked = product.requiresLevel && gameState.level < product.requiresLevel
                  const isDisabled = product.owned || !isAffordable || isLevelLocked
                  const effects = getProductEffects(product)

                  return (
                    <Card
                      key={product.id}
                      className={`overflow-hidden transition-all ${isDisabled ? "opacity-70" : "hover:shadow-lg"}`}
                    >
                      <div
                        className={`h-3 ${product.premium ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-orange-500"}`}
                      />
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{product.emoji}</span>
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-gray-600">{product.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge variant={product.premium ? "outline" : "secondary"} className="mb-1">
                              {product.price} SC
                            </Badge>
                            {product.duration !== "permanent" && (
                              <span className="text-xs text-gray-500">{product.duration}</span>
                            )}
                          </div>
                        </div>

                        {effects.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {effects.map((effect, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {effect}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto">
                          {product.owned ? (
                            <Button disabled className="w-full bg-green-500">
                              Owned
                            </Button>
                          ) : isLevelLocked ? (
                            <Button disabled className="w-full">
                              Requires Level {product.requiresLevel}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => onSelectProduct(product)}
                              disabled={!isAffordable}
                              className={`w-full ${
                                isAffordable
                                  ? product.premium
                                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                                    : "bg-orange-500 hover:bg-orange-600"
                                  : "bg-gray-300"
                              }`}
                            >
                              {isAffordable ? "Purchase" : "Not Enough ShopeeCoins"}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
