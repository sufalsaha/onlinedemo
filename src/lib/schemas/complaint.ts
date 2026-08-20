import { z } from "zod";

export const complaintStatusValues = ["pending", "in_progress", "resolved", "rejected"] as const;
export const complaintPriorityValues = ["low", "medium", "high", "urgent"] as const;

export const complaintStatusEnum = z.enum(complaintStatusValues);
export const complaintPriorityEnum = z.enum(complaintPriorityValues);

// Public complaint form schema
export const complaintFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  pageName: z.string().min(1, "Please select a business"),
  date: z.string().min(1, "Date is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  screenshot: z.string().optional().or(z.literal("")),
});

export type ComplaintFormValues = z.infer<typeof complaintFormSchema>;

// Admin update schema
export const complaintUpdateSchema = z.object({
  status: complaintStatusEnum.optional(),
  priority: complaintPriorityEnum.optional(),
});

export type ComplaintUpdateValues = z.infer<typeof complaintUpdateSchema>;
