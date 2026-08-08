import { z } from "zod";

// Mirrors the PlatformName enum on the Prisma Business.platforms embedded type
export const platformNames = [
  "facebook",
  "youtube",
  "instagram",
  "twitter",
  "tiktok",
  "linkedin",
  "website",
] as const;

export type PlatformNameValue = (typeof platformNames)[number];

export const businessFormSchema = z.object({

  name: z.string().min(1, { message: "Please enter a business name" }),
 slug: z
    .string()
    .min(1, { message: "Please enter a slug" })
    .regex( /^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Must be a valid lowercase URL slug" }),
  categoryId: z.string().min(1, { message: "Please select a category" }),
  logo: z
    .string()
    .trim()
    .url({ message: "Must be a valid image URL" })
    .optional()
    .or(z.literal("")),
  about: z.string().min(1, { message: "Please enter an about description" }),
  subcategory: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().optional().or(z.literal("")),
  rating: z
    .number()
    .min(0, { message: "Cannot be negative" })
    .max(5, { message: "Cannot exceed 5" }),
  productTag: z.array(
    z.object({
      value: z.string().min(1, { message: "Tag cannot be empty" }),
    })
  ),
  platforms: z.array(
    z.object({
      name: z.enum(platformNames),
      url: z.string().url({ message: "Must be a valid URL" }),
    })
  ),
});

export type BusinessFormValues = z.infer<typeof businessFormSchema>;
