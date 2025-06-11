import { createBrowserClient, type SupabaseClient } from "@supabase/ssr"
import type { Database } from "./types" // Assuming you have this types file

// Declare a global variable to hold the client instance.
// We use `any` here to avoid TypeScript errors with globalThis.
declare global {
  var supabaseBrowserClient: SupabaseClient<Database> | undefined
}

let clientInstance: SupabaseClient<Database> | undefined

export function createClient(): SupabaseClient<Database> {
  if (typeof window === "undefined") {
    // This function should not be called on the server.
    // For server-side, use createServerSupabaseClient.
    // However, to prevent errors if it's accidentally imported,
    // we can return a temporary client or throw an error.
    // For simplicity here, we'll log a warning and return a basic client.
    console.warn("createClient (browser client) was called on the server. This is not recommended.")
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  // Try to get the client from globalThis first (helps with HMR)
  if (globalThis.supabaseBrowserClient) {
    return globalThis.supabaseBrowserClient
  }

  // Fallback to module-level singleton
  if (clientInstance) {
    return clientInstance
  }

  // Create a new client instance
  clientInstance = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  // Store it on globalThis for HMR robustness
  globalThis.supabaseBrowserClient = clientInstance

  return clientInstance
}
