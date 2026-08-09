import { z } from "zod";

export const OTP_LENGTH = 6;

// Exported so profile.ts reuses the exact same rules — one definition of what a
// valid email or password is, everywhere.
export const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ message: "Invalid email address" }));

export const password = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .max(72, { message: "Password is too long" });

export const fullName = z
  .string()
  .trim()
  .min(2, { message: "Name is required" })
  .max(100, { message: "Name is too long" });

const otpCode = z
  .string()
  .trim()
  .length(OTP_LENGTH, { message: `Enter the ${OTP_LENGTH}-digit code` })
  .regex(/^\d+$/, { message: "Code must contain only numbers" });

export const registerSchema = z
  .object({
    fullName,
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email,
  password,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const verifyOtpSchema = z.object({
  code: otpCode,
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

export const forgotPasswordSchema = z.object({
  email,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email,
    code: otpCode,
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
