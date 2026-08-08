import { z } from "zod";

export const blogStatusValues = ["draft", "published"] as const;
export const blogStatusEnum = z.enum(blogStatusValues);

export const blogFormSchema = z.object({
  title: z.string().min(1, { message: "Please enter a title" }),
  slug: z
    .string()
    .min(1, { message: "Please enter a slug" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Must be a valid lowercase URL slug",
    }),
  excerpt: z
    .string()
    .min(1, { message: "Please enter a short excerpt" })
    .max(300, { message: "Keep the excerpt under 300 characters" }),
  content: z.string().min(1, { message: "Please enter the post content" }),
  category: z.string().min(1, { message: "Please enter a category" }),
  tags: z.array(
    z.object({
      value: z.string().min(1, { message: "Tag cannot be empty" }),
    })
  ),
  authorName: z.string().min(1, { message: "Please enter the author's name" }),
  authorAvatar: z
    .string()
    .trim()
    .url({ message: "Must be a valid image URL" })
    .optional()
    .or(z.literal("")),
  readingTime: z
    .number()
    .min(1, { message: "Must be at least 1 minute" })
    .max(120, { message: "Cannot exceed 120 minutes" }),
  featured: z.boolean(),
  status: blogStatusEnum,
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
