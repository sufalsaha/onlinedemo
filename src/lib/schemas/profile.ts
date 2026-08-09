import { z } from "zod";

import { email, fullName, password } from "./auth";

/** Cloudinary is the store; this cap keeps uploads well under the 10mb server-action body limit. */
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

/**
 * A trimmed, optional text field. Empty is normalised to undefined so that
 * clearing a field writes null to the column rather than "".
 *
 * Note this can't be expressed as `.optional().or(z.literal(""))` — "" satisfies
 * `.max()`, so the first branch would win and the "" branch would never run.
 */
const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, { message })
    .transform((value) => (value === "" ? undefined : value))
    .optional();

/**
 * Deliberately permissive — this is a directory used across regions, so no
 * locale-specific format is enforced.
 */
const phone = optionalText(20, "Phone number is too long").refine(
  (value) => value === undefined || /^[+]?[\d\s()-]+$/.test(value),
  { message: "Enter a valid phone number" },
);

const jobTitle = optionalText(100, "Job title is too long");

const bio = optionalText(500, "Bio must be 500 characters or fewer");

export const profileSchema = z.object({
  fullName,
  email,
  phone,
  jobTitle,
  bio,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Enter your current password" }),
    newPassword: password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from your current one",
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
