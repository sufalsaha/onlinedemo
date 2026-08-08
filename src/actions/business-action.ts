"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  businessFormSchema,
  type BusinessFormValues,
} from "@/lib/schemas/business";

type ActionResult<T> =
  | { error: string; data?: never }
  | { error?: never; data: T };

// READ
export async function getBusinesses() {
  return prisma.business.findMany({
    orderBy: { name: "asc" },
    include: { category: { select: { name: true } } },
  });
}

export async function getBusinessById(id: string) {
  return prisma.business.findUnique({ where: { id } });
}

// Shared mapping from form shape -> Prisma write shape
function toPrismaData(values: BusinessFormValues) {
  return {
    name: values.name,
    slug: values.slug,
    categoryId: values.categoryId,
    // logo: values.logo || null,
    about: values.about,
    subcategory: values.subcategory || null,
    location: values.location || null,
    rating: values.rating,
    productTag: values.productTag.map((tag) => tag.value),
    platforms: values.platforms,
  };
}

// CREATE
export async function createBusiness(
  values: BusinessFormValues,image: string,
): Promise<ActionResult<{ id: string;}>> {
  
  const parsed = businessFormSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

// const existing = await prisma.business.findUnique({
//   where: { : parsed.data.name }, 
// });

//   if (existing) {
//     return { error: "A business with this name already exists" };
//   }

  try {
    const business = await prisma.business.create({
      data: { ...toPrismaData(parsed.data), logo: image },
    });
    revalidatePath("/dashboard/business");
    return { data: { id: business.id} };
  } catch {
    return { error: "Failed to create business" };
  }
}

// UPDATE
export async function updateBusiness(
  id: string,
  values: BusinessFormValues,
  image: string
): Promise<ActionResult<{ id: string}>> {
  const parsed = businessFormSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  // console.log("hello",id,values,image);
  

  // const existing = await prisma.business.findUnique({
  //   where: { id: parsed.data.id },
  // });
  // if (existing && existing.id !== id) {
  //   return { error: "A business with this ID already exists" };
  // }

  try {
    const business = await prisma.business.update({
      where: { id: id },
      data: { ...toPrismaData(parsed.data), logo: image },
    });
    revalidatePath("/dashboard/business");
    return { data: { id: business.id} };
  } catch (e){
    console.error("Error updating business:", e);
    return { error: "Failed to update business" };
  }
}

// DELETE
export async function deleteBusiness(
  id: string
): Promise<ActionResult<{ id: string }>> {
  try {
    // Reviews belong to this business — remove them in the same transaction
    // so we never leave orphaned Review documents behind.
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { businessId: id } }),
      prisma.business.delete({ where: { id } }),
    ]);
    revalidatePath("/maintainer/business");
    revalidatePath("/maintainer/review");
    return { data: { id } };
  } catch {
    return { error: "Failed to delete business" };
  }
}
