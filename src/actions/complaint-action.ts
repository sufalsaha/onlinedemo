"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin, getCurrentUser } from "@/lib/auth/user-auth";
import {
  complaintFormSchema,
  complaintUpdateSchema,
  type ComplaintFormValues,
  type ComplaintUpdateValues,
} from "@/lib/schemas/complaint";

type ActionResult<T> = { error: string } | { data: T };

/**
 * Create a new complaint (public submission)
 */
export async function createComplaint(
  values: ComplaintFormValues & { screenshot?: string }
): Promise<ActionResult<{ id: string }>> {
  const parsed = complaintFormSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  // Get current user if logged in (optional)
  const user = await getCurrentUser();

  try {
    const complaint = await prisma.complaint.create({
      data: {
        fullName: parsed.data.fullName,
        mobile: parsed.data.mobile,
        businessId: parsed.data.pageName,
        subject: `Complaint regarding ${parsed.data.pageName}`,
        message: parsed.data.message,
        screenshot: values.screenshot || null,
        userId: user?.id || null,
        email: user?.email || null,
        status: "pending",
        priority: "medium",
      },
    });

    revalidatePath("/dashboard/complaint");
    return { data: { id: complaint.id } };
  } catch (error) {
    console.error("Failed to create complaint:", error);
    return { error: "Failed to submit complaint. Please try again." };
  }
}

/**
 * Get all complaints (admin only)
 */
export async function getComplaints(opts?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  priority?: string;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }

  const page = Math.max(opts?.page ?? 1, 1);
  const pageSize = opts?.pageSize ?? 12;
  const search = opts?.search?.trim().toLowerCase();

  const where: any = {};
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { mobile: { contains: search } },
      { subject: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
    ];
  }
  if (opts?.status && opts.status !== "all") {
    where.status = opts.status;
  }
  if (opts?.priority && opts.priority !== "all") {
    where.priority = opts.priority;
  }

  const [data, total] = await Promise.all([
    prisma.complaint.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        business: { select: { name: true } },
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
            image: true
          }
        },
      },
    }),
    prisma.complaint.count({ where }),
  ]);

  return { data, total, page, pageSize };
}

/**
 * Get complaint by ID (admin only)
 */
export async function getComplaintById(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }

  return await prisma.complaint.findUnique({
    where: { id },
    include: {
      business: { select: { name: true, logo: true } },
      user: {
        select: {
          fullName: true,
          email: true,
          phone: true,
          image: true
        }
      },
    },
  });
}

/**
 * Update complaint status/priority (admin only)
 */
export async function updateComplaint(
  id: string,
  values: ComplaintUpdateValues
): Promise<ActionResult<{ id: string }>> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized" };
  }

  const parsed = complaintUpdateSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const complaint = await prisma.complaint.update({
      where: { id },
      data: {
        ...(parsed.data.status && { status: parsed.data.status }),
        ...(parsed.data.priority && { priority: parsed.data.priority }),
      },
    });

    revalidatePath("/dashboard/complaint");
    return { data: { id: complaint.id } };
  } catch {
    return { error: "Failed to update complaint" };
  }
}

/**
 * Delete complaint (admin only)
 */
export async function deleteComplaint(id: string): Promise<ActionResult<{ id: string }>> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.complaint.delete({ where: { id } });
    revalidatePath("/dashboard/complaint");
    return { data: { id } };
  } catch {
    return { error: "Failed to delete complaint" };
  }
}
