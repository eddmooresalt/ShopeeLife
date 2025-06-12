/**
 * Determines the player's level rank based on their current level.
 * @param level Player's current level
 * @returns A string representing the player's rank.
 */
export function getLevelRank(level: number): string {
  if (level < 5) return "Associate"
  if (level < 10) return "Junior Specialist"
  if (level < 15) return "Specialist"
  if (level < 20) return "Senior Specialist"
  if (level < 25) return "Team Lead"
  if (level < 30) return "Assistant Manager"
  if (level < 35) return "Manager"
  if (level < 40) return "Senior Manager"
  if (level < 45) return "Associate Director"
  if (level < 50) return "Director"
  if (level < 60) return "Senior Director"
  if (level < 70) return "Vice President"
  if (level < 80) return "Senior Vice President"
  if (level < 90) return "Executive Vice President"
  if (level < 100) return "Chief Officer"
  return "Legend" // For level 100 and above
}
