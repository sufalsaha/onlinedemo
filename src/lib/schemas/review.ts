import { z } from "zod";

export const reviewStatusValues = ["pending", "approved", "rejected"] as const;
export const reviewStatusEnum = z.enum(reviewStatusValues);

// Admin create/edit form (dashboard)
export const reviewFormSchema = z.object({
  businessId: z.string().min(1, { message: "Please select a business" }),
  reviewerName: z
    .string()
    .min(1, { message: "Please enter the reviewer's name" }),
  authorLocation: z.string().optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .email({ message: "Must be a valid email address" })
    .optional()
    .or(z.literal("")),
  title: z.string().trim().max(150).optional().or(z.literal("")),
  logo: z
    .string()
    .trim()
    .url({ message: "Must be a valid image URL" })
    .optional()
    .or(z.literal("")),
  rating: z
    .number()
    .min(0, { message: "Cannot be negative" })
    .max(5, { message: "Cannot exceed 5" }),
  message: z.string().min(1, { message: "Please enter the review message" }),
  status: reviewStatusEnum.optional(),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

// Public "Write a Review" flow (Business Details page)
export const publicReviewSchema = z.object({
  businessId: z.string().min(1, { message: "Missing business" }),
  rating: z
    .number()
    .min(1, { message: "Please select a rating" })
    .max(5, { message: "Cannot exceed 5" }),
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name" })
    .max(100, { message: "Name is too long" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" }),
  title: z.string().trim().max(150).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, { message: "Please write at least 10 characters" })
    .max(2000, { message: "Message is too long" }),
});

export type PublicReviewFormValues = z.infer<typeof publicReviewSchema>;
