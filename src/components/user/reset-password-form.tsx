"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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

// Validation Schema
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [isReset, setIsReset] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  function onSubmit(values: ResetPasswordFormValues) {
    console.log(values)
    setIsReset(true)
  }

  return (
    <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            {email ? (
              <>Choose a new password for <span className="font-medium">{email}</span></>
            ) : (
              "Choose a new password for your account"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isReset ? (
            <p className="text-sm text-center text-muted-foreground">
              Your password has been reset. You can now sign in with your new password.
            </p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

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
