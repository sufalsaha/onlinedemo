"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react"
import { RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { resendVerificationOtp, verifyEmailOtp } from "@/actions/user-actions"
import {
  OTP_LENGTH,
  verifyOtpSchema,
  type VerifyOtpFormValues,
} from "@/lib/schemas/auth"
import { RESEND_COOLDOWN_MS } from "@/lib/auth/otp"

export function VerifyForm({ email }: { email: string }) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const [error, setError] = useState<string | undefined>()
  const [notice, setNotice] = useState<string | undefined>()
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { code: "" },
  })

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [cooldown])

  function updateDigits(next: string[]) {
    setDigits(next)
    setValue("code", next.join(""))
  }

  function handleDigitChange(index: number, rawValue: string) {
    const value = rawValue.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[index] = value
    updateDigits(next)

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH)
    if (!pasted) return
    event.preventDefault()

    const next = Array(OTP_LENGTH).fill("")
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    updateDigits(next)

    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  async function onSubmit(values: VerifyOtpFormValues) {
    setError(undefined)
    setNotice(undefined)

    try {
      const result = await verifyEmailOtp(values)
      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      )
    }
  }

  async function handleResend() {
    setError(undefined)
    setNotice(undefined)
    setIsResending(true)

    try {
      const result = await resendVerificationOtp()
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setNotice(result.success)
        updateDigits(Array(OTP_LENGTH).fill(""))
        inputRefs.current[0]?.focus()
      }
      setCooldown(Math.ceil(RESEND_COOLDOWN_MS / 1000))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center">
            Enter the {OTP_LENGTH}-digit code sent to{" "}
            <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

            {/* Code Field */}
            <Field>
              <FieldLabel>Verification Code</FieldLabel>
              <FieldContent>
                <div className="flex justify-between gap-2">
                  {digits.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      onFocus={(e) => e.target.select()}
                      aria-label={`Digit ${index + 1}`}
                      aria-invalid={!!errors.code}
                      className="h-12 min-w-0 flex-1 rounded-lg text-center text-lg font-semibold"
                    />
                  ))}
                </div>
              </FieldContent>
              {errors.code && <FieldError>{errors.code.message}</FieldError>}
            </Field>

            {/* Server Error / Notice */}
            {error && (
              <div className="text-sm font-medium p-3 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}
            {notice && (
              <div className="text-sm font-medium p-3 bg-[#00C085]/10 text-[#00806a] dark:text-[#00C085] rounded-md">
                {notice}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Didn&apos;t get a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || cooldown > 0}
              className="font-medium text-blue-600 hover:underline disabled:no-underline disabled:opacity-60 dark:text-blue-400"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : isResending ? "Sending..." : "Resend"}
            </button>
          </div>
          <div className="mt-1 text-center text-sm">
            <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
