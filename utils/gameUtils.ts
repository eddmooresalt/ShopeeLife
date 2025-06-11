import type { GameTime } from "../types/game"

export const getEnergyColor = (energy: number) => {
  if (energy > 60) return "bg-green-500"
  if (energy > 30) return "bg-yellow-500"
  return "bg-red-500"
}

export const getProductivityColor = (productivity: number) => {
  if (productivity > 70) return "bg-blue-500"
  if (productivity > 40) return "bg-cyan-500"
  return "bg-gray-500"
}

export const getBurnoutColor = (burnout: number) => {
  if (burnout > 70) return "bg-red-500"
  if (burnout > 40) return "bg-orange-500"
  return "bg-green-500"
}

export const formatGameTime = (time: GameTime) => {
  const hour12 = time.hour === 0 ? 12 : time.hour > 12 ? time.hour - 12 : time.hour
  const ampm = time.hour >= 12 ? "PM" : "AM"
  return `${hour12}:${time.minute.toString().padStart(2, "0")} ${ampm}`
}
