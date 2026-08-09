"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { updateProfile } from "@/actions/user-actions";
import { profileSchema, type ProfileFormValues } from "@/lib/schemas/profile";
import { EN } from "@/lib/lang";

import { AvatarUpload } from "./avatar-upload";

export type ProfileUser = {
  fullName: string;
  email: string;
  image: string | null;
  phone: string | null;
  jobTitle: string | null;
  bio: string | null;
};

export function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // The columns are nullable but the schema deals in strings, so null has to
    // become "" or the inputs would go uncontrolled.
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone ?? "",
      jobTitle: user.jobTitle ?? "",
      bio: user.bio ?? "",
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setError(undefined);
    setSuccess(undefined);

    try {
      const result = await updateProfile(values);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.emailChanged) {
        // The new address is unproven until the code is entered, so send the
        // user straight to the screen that asks for it.
        router.push("/user/verify");
        return;
      }

      // Re-seed the form from what was actually saved (trimmed, lowercased)
      // so the fields match the database rather than the raw keystrokes.
      reset(values);
      setSuccess(result.success);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : EN.somethingWentWrong);
    }
  }

  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold tracking-tight">
          Profile details
        </CardTitle>
        <CardDescription>
          Update your personal information and profile picture.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <AvatarUpload fullName={user.fullName} image={user.image} />

        <div className="border-t border-slate-100 dark:border-slate-800" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <FieldContent>
                <Input
                  id="fullName"
                  placeholder="e.g., Rahim Uddin"
                  aria-invalid={!!errors.fullName}
                  {...register("fullName")}
                />
              </FieldContent>
              {errors.fullName && (
                <FieldError>{errors.fullName.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </FieldContent>
              {errors.email ? (
                <FieldError>{errors.email.message}</FieldError>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Change this and you&apos;ll need to verify the new address
                  before you can post reviews again.
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <FieldContent>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +880 1700 000000"
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
              </FieldContent>
              {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="jobTitle">Job Title</FieldLabel>
              <FieldContent>
                <Input
                  id="jobTitle"
                  placeholder="e.g., Product Manager"
                  aria-invalid={!!errors.jobTitle}
                  {...register("jobTitle")}
                />
              </FieldContent>
              {errors.jobTitle && (
                <FieldError>{errors.jobTitle.message}</FieldError>
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="bio">About You</FieldLabel>
            <FieldContent>
              <Textarea
                id="bio"
                placeholder="A short introduction shown alongside your reviews..."
                className="min-h-24 resize-y leading-relaxed"
                aria-invalid={!!errors.bio}
                {...register("bio")}
              />
            </FieldContent>
            {errors.bio ? (
              <FieldError>{errors.bio.message}</FieldError>
            ) : (
              <p className="text-xs text-muted-foreground">
                Up to 500 characters.
              </p>
            )}
          </Field>

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
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
