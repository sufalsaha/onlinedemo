"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react"
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

const CODE_LENGTH = 6

// Validation Schema
const verifySchema = z.object({
  code: z
    .string()
    .length(CODE_LENGTH, { message: "Enter the 6-digit code" })
    .regex(/^\d+$/, { message: "Code must contain only numbers" }),
})

type VerifyFormValues = z.infer<typeof verifySchema>;

export function VerifyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""))
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  })

  function updateDigits(next: string[]) {
    setDigits(next)
    setValue("code", next.join(""))
  }

  function handleDigitChange(index: number, rawValue: string) {
    const value = rawValue.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[index] = value
    updateDigits(next)

    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH)
    if (!pasted) return
    event.preventDefault()

    const next = Array(CODE_LENGTH).fill("")
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    updateDigits(next)

    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus()
  }

  function onSubmit(values: VerifyFormValues) {
    console.log(values)
    router.push(`/dashboard/reset-password${email ? `?email=${encodeURIComponent(email)}` : ""}`)
  }

  return (
    <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Verify Code
          </CardTitle>
          <CardDescription className="text-center">
            {email ? (
              <>Enter the 6-digit code sent to <span className="font-medium">{email}</span></>
            ) : (
              "Enter the 6-digit code sent to your email"
            )}
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
            Didn&apos;t get a code? Resend
          </div>
          <div className="mt-1 text-center text-sm">
            <Link href="/user/forgot-password" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">
              Back to Forgot Password
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
