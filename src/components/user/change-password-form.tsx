"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
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
import { changePassword } from "@/actions/user-actions";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/lib/schemas/profile";
import { EN } from "@/lib/lang";

export function ChangePasswordForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ChangePasswordFormValues) {
    setError(undefined);
    setSuccess(undefined);

    try {
      const result = await changePassword(values);

      if (result.error) {
        setError(result.error);
        return;
      }

      // Don't leave the old password sitting in the DOM once it's been used.
      reset();
      setSuccess(result.success);
    } catch (err) {
      setError(err instanceof Error ? err.message : EN.somethingWentWrong);
    }
  }

  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold tracking-tight">
          Change password
        </CardTitle>
        <CardDescription>
          You&apos;ll stay signed in here. Any other device is signed out.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <Field>
            <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
            <FieldContent>
              <PasswordInput
                id="currentPassword"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!errors.currentPassword}
                {...register("currentPassword")}
              />
            </FieldContent>
            {errors.currentPassword && (
              <FieldError>{errors.currentPassword.message}</FieldError>
            )}
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <FieldContent>
                <PasswordInput
                  id="newPassword"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.newPassword}
                  {...register("newPassword")}
                />
              </FieldContent>
              {errors.newPassword && (
                <FieldError>{errors.newPassword.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm New Password
              </FieldLabel>
              <FieldContent>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
              </FieldContent>
              {errors.confirmPassword && (
                <FieldError>{errors.confirmPassword.message}</FieldError>
              )}
            </Field>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md bg-emerald-500/10 p-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              {success}
            </div>
          )}

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
