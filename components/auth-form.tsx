"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AuthFormProps {
  type: "login" | "signup"
  action: (prevState: any, formData: FormData) => Promise<{ success: boolean; message: string }>
}

export function AuthForm({ type, action }: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="your@email.com" required disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Your password"
            required
            disabled={isPending}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {type === "login" ? "Logging in..." : "Creating account..."}
            </div>
          ) : type === "login" ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      {state?.message && (
        <div
          className={`p-3 rounded-md text-sm text-center ${
            state.success
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {state.message}
        </div>
      )}
    </div>
  )
}
