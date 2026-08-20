"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { Prisma } from "../../generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin, getCurrentUser } from "@/lib/auth/user-auth";
import { EN } from "@/lib/lang";
import {
  reviewFormSchema,
  publicReviewSchema,
  type ReviewFormValues,
  type PublicReviewFormValues,
} from "@/lib/schemas/review";

type ActionResult<T> =
  | { error: string; data?: never }
  | { error?: never; data: T };

// ============================================================================
// REVIEW RESTRICTION HELPERS
// ============================================================================

/**
 * Check if a user has already reviewed a specific business.
 * Ignores deleted reviews.
 * @returns true if user has already reviewed this business
 */
export async function hasUserReviewedBusiness(
  userId: string,
  businessId: string
): Promise<boolean> {
  const review = await prisma.review.findFirst({
    where: {
      userId,
      businessId,
      deleted: false,
    },
    select: { id: true },
  });
  return !!review;
}

/**
 * Get a user's review for a specific business (if exists).
 * @returns Full review object or null
 */
export async function getUserReviewForBusiness(
  userId: string,
  businessId: string
) {
  return await prisma.review.findFirst({
    where: {
      userId,
      businessId,
      deleted: false,
    },
  });
}

// ============================================================================
// READ (admin — paginated, searchable, filterable)
export async function getReviews(opts?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "pending" | "approved" | "rejected" | "all";
  includeDeleted?: boolean;
}) {
  const page = Math.max(opts?.page ?? 1, 1);
  const pageSize = opts?.pageSize ?? 12;
  const search = opts?.search?.trim();

  const where: Prisma.ReviewWhereInput = {
    ...(opts?.includeDeleted ? {} : { deleted: false }),
    ...(opts?.status && opts.status !== "all" ? { status: opts.status } : {}),
    ...(search
      ? {
          OR: [
            { reviewerName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { title: { contains: search, mode: "insensitive" } },
            { message: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { business: { select: { name: true } } },
    }),
    prisma.review.count({ where }),
  ]);

  return { data, total, page, pageSize };
}

export async function getReviewById(id: string) {
  return prisma.review.findUnique({ where: { id } });
}

// Recomputes and persists the denormalized Business.rating / reviewCount
// fields from approved, non-deleted reviews only. Called after every write
// that can affect what's publicly visible (create/update/approve/reject/delete).
async function syncBusinessAggregates(businessId: string) {
  const aggregate = await prisma.review.aggregate({
    where: { businessId, status: "approved", deleted: false },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.business.update({
    where: { id: businessId },
    data: {
      rating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count,
    },
  });
}

function revalidateReviewPaths(businessId: string) {
  revalidatePath("/dashboard/review");
  revalidatePath("/dashboard/business");
  revalidatePath(`/businesses/${businessId}`);
}

// CREATE (admin) — manually entered reviews are pre-vetted, so they go live immediately.
export async function createReview(
  values: ReviewFormValues,
  image: string
): Promise<ActionResult<{ id: string; businessId: string }>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Unauthorized" };

  const parsed = reviewFormSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const { businessId, reviewerName, authorLocation, email, title, rating, message } =
      parsed.data;
    const review = await prisma.review.create({
      data: {
        businessId,
        reviewerName,
        authorLocation,
        email: email ?? "",
        title,
        rating,
        message,
        image,
        status: "approved",
        deleted: false,
      },
    });
    await syncBusinessAggregates(review.businessId);

    revalidateReviewPaths(review.businessId);
    return { data: { id: review.id, businessId: review.businessId } };
  } catch {
    return { error: "Failed to create review" };
  }
}

// UPDATE (admin)
export async function updateReview(
  id: string,
  values: ReviewFormValues,
  image: string
): Promise<ActionResult<{ id: string; businessId: string }>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Unauthorized" };

  const parsed = reviewFormSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const {
      businessId,
      reviewerName,
      authorLocation,
      email,
      title,
      status,
      rating,
      message,
    } = parsed.data;
    const previous = await prisma.review.findUnique({ where: { id } });
    const review = await prisma.review.update({
      where: { id },
      data: {
        businessId,
        reviewerName,
        authorLocation,
        email,
        title,
        status,
        rating,
        message,
        image,
      },
    });

    // If the review was reassigned to a different business, both the old
    // and new business's aggregates need to be recomputed.
    if (previous && previous.businessId !== review.businessId) {
      await syncBusinessAggregates(previous.businessId);
    }
    await syncBusinessAggregates(review.businessId);

    revalidateReviewPaths(review.businessId);
    return { data: { id: review.id, businessId: review.businessId } };
  } catch {
    return { error: "Failed to update review" };
  }
}

// DELETE (admin, hard delete)
export async function deleteReview(
  id: string
): Promise<ActionResult<{ id: string }>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Unauthorized" };

  try {
    const review = await prisma.review.delete({ where: { id } });
    await syncBusinessAggregates(review.businessId);

    revalidateReviewPaths(review.businessId);
    return { data: { id } };
  } catch {
    return { error: "Failed to delete review" };
  }
}

// APPROVE / REJECT / SOFT DELETE (admin moderation)
export async function approveReview(
  id: string
): Promise<ActionResult<{ id: string }>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Unauthorized" };

  try {
    const review = await prisma.review.update({
      where: { id },
      data: { status: "approved" },
    });
    await syncBusinessAggregates(review.businessId);
    revalidateReviewPaths(review.businessId);
    return { data: { id } };
  } catch {
    return { error: "Failed to approve review" };
  }
}

export async function rejectReview(
  id: string
): Promise<ActionResult<{ id: string }>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Unauthorized" };

  try {
    const review = await prisma.review.update({
      where: { id },
      data: { status: "rejected" },
    });
    await syncBusinessAggregates(review.businessId);
    revalidateReviewPaths(review.businessId);
    return { data: { id } };
  } catch {
    return { error: "Failed to reject review" };
  }
}

export async function softDeleteReview(
  id: string
): Promise<ActionResult<{ id: string }>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Unauthorized" };

  try {
    const review = await prisma.review.update({
      where: { id },
      data: { deleted: true },
    });
    await syncBusinessAggregates(review.businessId);
    revalidateReviewPaths(review.businessId);
    return { data: { id } };
  } catch {
    return { error: "Failed to delete review" };
  }
}

// CREATE (public — Business Details "Write a Review" flow)
export async function createPublicReview(
  values: PublicReviewFormValues
): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser();
  if (!user) return { error: EN.notLoggedIn };
  if (!user.verified) return { error: EN.verifyEmailFirst };

  const parsed = publicReviewSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const business = await prisma.business.findUnique({
    where: { id: parsed.data.businessId },
    select: { id: true },
  });
  if (!business) {
    return { error: "Business not found" };
  }

  // Check if user already reviewed this business
  const hasReviewed = await hasUserReviewedBusiness(user.id, parsed.data.businessId);
  if (hasReviewed) {
    return { error: "You have already submitted a review for this business." };
  }

  try {
    const hdrs = await headers();
    const ipAddress =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      undefined;
    const userAgent = hdrs.get("user-agent") ?? undefined;

    const review = await prisma.review.create({
      data: {
        businessId: parsed.data.businessId,
        rating: parsed.data.rating,
        userId: user.id, // Link review to user account
        // Identity comes from the session, never from the payload.
        reviewerName: user.fullName,
        email: user.email,
        title: parsed.data.title || undefined,
        message: parsed.data.message,
        status: "pending",
        deleted: false,
        ipAddress,
        userAgent,
      },
    });

    revalidatePath("/dashboard/review");
    return { data: { id: review.id } };
  } catch {
    return { error: "Failed to submit review" };
  }
}
