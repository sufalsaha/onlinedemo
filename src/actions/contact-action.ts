"use server";

import { prisma } from "@/lib/prisma";
import {
  contactFormSchema,
  type ContactFormValues,
  appointmentFollowUpSchema,
  type AppointmentFollowUpValues,
} from "@/lib/schemas/contact";

type ActionResult<T> =
  | { error: string; data?: never }
  | { error?: never; data: T };

export async function createContactInquiry(
  values: ContactFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const inquiry = await prisma.contactInquiry.create({
      data: { ...parsed.data, bookingRequested: true },
    });
    return { data: { id: inquiry.id } };
  } catch {
    return { error: "Failed to save your details. Please try again." };
  }
}

export async function updateContactInquiryAppointment(
  id: string,
  values: AppointmentFollowUpValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = appointmentFollowUpSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const inquiry = await prisma.contactInquiry.update({
      where: { id },
      data: {
        appointmentDate: new Date(parsed.data.appointmentDate),
        appointmentTime: parsed.data.appointmentTime,
      },
    });
    return { data: { id: inquiry.id } };
  } catch {
    return { error: "Failed to save your appointment time." };
  }
}
