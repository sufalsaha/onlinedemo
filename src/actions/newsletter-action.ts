"use server";

import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/schemas/newsletter";

type ActionResult<T> =
  | { error: string; data?: never }
  | { error?: never; data: T };

export async function subscribeNewsletter(
  email: string
): Promise<ActionResult<{ email: string }>> {
  const parsed = newsletterSchema.safeParse({ email });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }

  try {
    await prisma.newsletterSubscriber.create({
      data: { email: parsed.data.email },
    });
    return { data: { email: parsed.data.email } };
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code?: string }).code === "P2002"
    ) {
      return { error: "This email is already subscribed." };
    }
    return { error: "Failed to subscribe. Please try again." };
  }
}
