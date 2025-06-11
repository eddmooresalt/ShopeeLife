export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_progress: {
        Row: {
          id: string
          user_id: string
          shopee_coins: number
          level: number
          xp: number
          last_played: string
          game_state: Json
        }
        Insert: {
          id?: string
          user_id: string
          shopee_coins?: number
          level?: number
          xp?: number
          last_played?: string
          game_state?: Json
        }
        Update: {
          id?: string
          user_id?: string
          shopee_coins?: number
          level?: number
          xp?: number
          last_played?: string
          game_state?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
