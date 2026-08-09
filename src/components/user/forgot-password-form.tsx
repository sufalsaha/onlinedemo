"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useState } from "react"
import { RotateCw } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { sendPasswordResetOtp } from "@/actions/user-actions"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/schemas/auth"

export function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | undefined>()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordFormValues) {
    setError(undefined)

    try {
      const result = await sendPasswordResetOtp(values)
      if (result?.error) {
        setError(result.error)
        return
      }
      setSubmittedEmail(values.email)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      )
    }
  }

  return (
    <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and we&apos;ll send you a code to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submittedEmail ? (
            <div className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">
                If an account exists for <span className="font-medium">{submittedEmail}</span>,
                we&apos;ve sent a reset code. Check your inbox.
              </p>
              <Link
                href={`/user/reset-password?email=${encodeURIComponent(submittedEmail)}`}
                className={cn(buttonVariants({}), "w-full")}
              >
                Enter reset code
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

              {/* Email Field */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                </FieldContent>
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              {/* Server Error Message */}
              {error && (
                <div className="text-sm font-medium p-3 bg-destructive/10 text-destructive rounded-md">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </Button>
            </form>
          )}

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/user/login" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
