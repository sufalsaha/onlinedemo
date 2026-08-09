"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { resetPassword } from "@/actions/user-actions"
import {
  OTP_LENGTH,
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/schemas/auth"

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const [error, setError] = useState<string | undefined>()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, code: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(values: ResetPasswordFormValues) {
    setError(undefined)

    try {
      const result = await resetPassword(values)
      if (result?.error) {
        setError(result.error)
      }
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
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter the code we emailed you and choose a new password
            {email ? (
              <> for <span className="font-medium">{email}</span></>
            ) : null}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

            {/* Carried over from the forgot-password step. When it's missing
                (direct link, retyped URL) the user types it in below instead —
                registering both would put two refs on one field. */}
            {email ? (
              <input type="hidden" {...register("email")} />
            ) : (
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
            )}

            {/* Reset Code Field */}
            <Field>
              <FieldLabel htmlFor="code">Reset Code</FieldLabel>
              <FieldContent>
                <Input
                  id="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={OTP_LENGTH}
                  placeholder={"0".repeat(OTP_LENGTH)}
                  aria-invalid={!!errors.code}
                  className="tracking-[0.4em] text-center font-semibold"
                  {...register("code")}
                />
              </FieldContent>
              {errors.code && <FieldError>{errors.code.message}</FieldError>}
            </Field>

            {/* New Password Field */}
            <Field>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <FieldContent>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
              </FieldContent>
              {errors.password && <FieldError>{errors.password.message}</FieldError>}
            </Field>

            {/* Confirm Password Field */}
            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <FieldContent>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="••••••••"
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
              </FieldContent>
              {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
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
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

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
