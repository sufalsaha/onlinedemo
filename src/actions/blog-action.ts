"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "../../generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth/user-auth";
import { blogFormSchema, type BlogFormValues } from "@/lib/schemas/blog";

type ActionResult<T> =
  | { error: string; data?: never }
  | { error?: never; data: T };

type BlogSort = "latest" | "popular" | "oldest";

function toPrismaData(values: BlogFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt,
    content: values.content,
    category: values.category,
    tags: values.tags.map((tag) => tag.value),
    authorName: values.authorName,
    authorAvatar: values.authorAvatar || null,
    readingTime: values.readingTime,
    featured: values.featured,
    status: values.status,
  };
}

// ─── Admin ──────────────────────────────────────────────────────────────────

export async function getBlogs(opts?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "draft" | "published" | "all";
}) {
  const page = Math.max(opts?.page ?? 1, 1);
  const pageSize = opts?.pageSize ?? 12;
  const search = opts?.search?.trim();

  const where: Prisma.BlogWhereInput = {
    ...(opts?.status && opts.status !== "all" ? { status: opts.status } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blog.count({ where }),
  ]);

  return { data, total, page, pageSize };
}

export async function getBlogById(id: string) {
  return prisma.blog.findUnique({ where: { id } });
}

export async function createBlog(
  values: BlogFormValues,
  coverImage: string
): Promise<ActionResult<{ id: string; slug: string }>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Unauthorized" };

  const parsed = blogFormSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const data = toPrismaData(parsed.data);
    const blog = await prisma.blog.create({
      data: {
        ...data,
        coverImage: coverImage || null,
        publishedAt: data.status === "published" ? new Date() : null,
      },
    });
    revalidatePath("/dashboard/blog");
    revalidatePath("/blogs");
    return { data: { id: blog.id, slug: blog.slug } };
  } catch {
    return { error: "Failed to create blog post" };
  }
}

export async function updateBlog(
  id: string,
  values: BlogFormValues,
  coverImage: string
): Promise<ActionResult<{ id: string; slug: string }>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Unauthorized" };

  const parsed = blogFormSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const previous = await prisma.blog.findUnique({ where: { id } });
    const data = toPrismaData(parsed.data);
    const becamePublished = data.status === "published" && previous?.status !== "published";

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...data,
        coverImage: coverImage || null,
        ...(becamePublished ? { publishedAt: new Date() } : {}),
      },
    });
    revalidatePath("/dashboard/blog");
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blog.slug}`);
    return { data: { id: blog.id, slug: blog.slug } };
  } catch {
    return { error: "Failed to update blog post" };
  }
}

export async function deleteBlog(id: string): Promise<ActionResult<{ id: string }>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Unauthorized" };

  try {
    await prisma.blog.delete({ where: { id } });
    revalidatePath("/dashboard/blog");
    revalidatePath("/blogs");
    return { data: { id } };
  } catch {
    return { error: "Failed to delete blog post" };
  }
}

export async function setBlogStatus(
  id: string,
  status: "draft" | "published"
): Promise<ActionResult<{ id: string }>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Unauthorized" };

  try {
    const previous = await prisma.blog.findUnique({ where: { id } });
    const becamePublished = status === "published" && previous?.status !== "published";

    await prisma.blog.update({
      where: { id },
      data: {
        status,
        ...(becamePublished ? { publishedAt: new Date() } : {}),
      },
    });
    revalidatePath("/dashboard/blog");
    revalidatePath("/blogs");
    return { data: { id } };
  } catch {
    return { error: "Failed to update status" };
  }
}

// ─── Public ─────────────────────────────────────────────────────────────────

export async function getPublishedBlogs(opts?: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  tag?: string;
  sort?: BlogSort;
}) {
  const page = Math.max(opts?.page ?? 1, 1);
  const pageSize = opts?.pageSize ?? 6;
  const search = opts?.search?.trim();

  const where: Prisma.BlogWhereInput = {
    status: "published",
    ...(opts?.category ? { category: opts.category } : {}),
    ...(opts?.tag ? { tags: { has: opts.tag } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.BlogOrderByWithRelationInput =
    opts?.sort === "popular"
      ? { viewCount: "desc" }
      : opts?.sort === "oldest"
        ? { publishedAt: "asc" }
        : { publishedAt: "desc" };

  const [data, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blog.count({ where }),
  ]);

  return { data, total, page, pageSize };
}

export async function getBlogBySlug(slug: string) {
  return prisma.blog.findFirst({ where: { slug, status: "published" } });
}

export async function getFeaturedBlog() {
  const featured = await prisma.blog.findFirst({
    where: { status: "published", featured: true },
    orderBy: { publishedAt: "desc" },
  });
  if (featured) return featured;

  return prisma.blog.findFirst({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getBlogCategories() {
  const blogs = await prisma.blog.findMany({
    where: { status: "published" },
    select: { category: true },
  });

  const counts = new Map<string, number>();
  for (const { category } of blogs) {
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getBlogTags() {
  const blogs = await prisma.blog.findMany({
    where: { status: "published" },
    select: { tags: true },
  });

  const tags = new Set<string>();
  for (const { tags: blogTags } of blogs) {
    for (const tag of blogTags) tags.add(tag);
  }

  return Array.from(tags).sort();
}

export async function getRecentBlogs(limit = 5) {
  return prisma.blog.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getPopularBlogs(limit = 5) {
  return prisma.blog.findMany({
    where: { status: "published" },
    orderBy: { viewCount: "desc" },
    take: limit,
  });
}

export async function incrementBlogView(slug: string) {
  try {
    await prisma.blog.updateMany({
      where: { slug, status: "published" },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // best-effort — a failed view increment shouldn't break the page
  }
}
