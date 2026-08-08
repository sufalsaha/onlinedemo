"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/actions/admin-actions";
import { PasswordInput } from "../ui/password-input";

// Validation Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
  setError(undefined);
  
  try {
    const errorResult = await login(values.email, values.password);
    
   
    if (errorResult) {
      setError(errorResult);
    }
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong. Please try again."
    );
  }
}

  return (
    <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 ">
      <Card className="w-full max-w-md shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
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

            {/* Password Field */}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  href="/user/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Forgot password?
                </Link>
              </div>
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
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/user/register" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}