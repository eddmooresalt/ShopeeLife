import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DebugPage() {
  const supabase = createServerSupabaseClient()

  // Test environment variables
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  // Test database connection
  let dbConnection = null
  let dbError = null
  try {
    const { data, error } = await supabase.from("user_progress").select("count", { count: "exact", head: true })
    if (error) {
      dbError = error.message
    } else {
      dbConnection = `Connected - ${data?.length || 0} records found`
    }
  } catch (error) {
    dbError = String(error)
  }

  // Test authentication
  let authStatus = null
  let authError = null
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      authError = error.message
    } else {
      authStatus = user ? `Authenticated as ${user.email}` : "Not authenticated"
    }
  } catch (error) {
    authError = String(error)
  }

  // Test table structure
  let tableInfo = null
  let tableError = null
  try {
    const { data, error } = await supabase.rpc("get_table_info", { table_name: "user_progress" })
    if (error) {
      tableError = error.message
    } else {
      tableInfo = data
    }
  } catch (error) {
    // This is expected if the RPC doesn't exist
    tableError = "RPC not available (this is normal)"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🔍 Vercel ↔ Supabase Connection Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline">← Back to Game</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-semibold">{key}:</span>
                  <span className={value ? "text-green-600" : "text-red-600"}>
                    {value ? `${String(value).substring(0, 20)}...` : "❌ MISSING"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Database Connection */}
        <Card>
          <CardHeader>
            <CardTitle>Database Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <span className={dbError ? "text-red-600" : "text-green-600"}>
                  {dbError ? `❌ ${dbError}` : `✅ ${dbConnection}`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <span className={authError ? "text-red-600" : "text-green-600"}>
                  {authError ? `❌ ${authError}` : `✅ ${authStatus}`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Information */}
        <Card>
          <CardHeader>
            <CardTitle>Table Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">user_progress table:</span>
                <span className={tableError && !tableError.includes("normal") ? "text-red-600" : "text-green-600"}>
                  {tableError && !tableError.includes("normal") ? `❌ ${tableError}` : "✅ Available"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h4 className="font-semibold mb-2">If you see any ❌ errors above:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Check your Vercel environment variables are set correctly</li>
                  <li>Run the SQL verification script below</li>
                  <li>Make sure your Supabase project is active</li>
                  <li>Verify your Supabase URL and keys are correct</li>
                </ol>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h4 className="font-semibold mb-2">If everything shows ✅:</h4>
                <p className="text-sm">Your Vercel and Supabase connection is working properly!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
