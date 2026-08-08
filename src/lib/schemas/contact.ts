import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  mobileOrWhatsapp: z.string().min(1, "Mobile or WhatsApp number is required"),
  message: z.string().min(1, "Message is required"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const appointmentFollowUpSchema = z.object({
  appointmentDate: z.string().min(1, "Please enter the date"),
  appointmentTime: z.string().min(1, "Please enter the time"),
});

export type AppointmentFollowUpValues = z.infer<typeof appointmentFollowUpSchema>;
