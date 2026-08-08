import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, { message: "Please enter a category name" }),
  slug: z
    .string()
    .min(1, { message: "Please enter a slug" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Must be a valid lowercase URL slug" }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
