"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/lib/schemas/category";

type ActionResult<T> =
  | { error: string; data?: never }
  | { error?: never; data: T };

// READ
export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

// CREATE
export async function createCategory(
  values: CategoryFormValues
): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = categoryFormSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const existing = await prisma.category.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return { error: "A category with this slug already exists" };
  }

  try {
    const category = await prisma.category.create({ data: parsed.data });
    revalidatePath("/maintainer/category");
    return { data: { id: category.id, slug: category.slug } };
  } catch {
    return { error: "Failed to create category" };
  }
}

// UPDATE
export async function updateCategory(
  id: string,
  values: CategoryFormValues
): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = categoryFormSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const existing = await prisma.category.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing && existing.id !== id) {
    return { error: "A category with this slug already exists" };
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: parsed.data,
    });
    revalidatePath("/maintainer/category");
    return { data: { id: category.id, slug: category.slug } };
  } catch {
    return { error: "Failed to update category" };
  }
}

// DELETE
export async function deleteCategory(
  id: string
): Promise<ActionResult<{ id: string }>> {
  const businessCount = await prisma.business.count({
    where: { categoryId: id },
  });
  if (businessCount > 0) {
    return {
      error: `Cannot delete: ${businessCount} business(es) still use this category`,
    };
  }

  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/maintainer/category");
    return { data: { id } };
  } catch {
    return { error: "Failed to delete category" };
  }
}
