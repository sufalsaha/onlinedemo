import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
