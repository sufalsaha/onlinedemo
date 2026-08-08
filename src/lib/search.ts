import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

export interface BusinessSearchResult {
  id: string;
  name: string;
  logo: string | null;
  rating: number;
  reviewCount: number;
  category: { name: string; slug: string };
}

// Mongo/Prisma array filters (`has`/`hasSome`) only match whole tag values,
// not substrings — so the distinct tag vocabulary is cached in-process and
// filtered in JS to find which exact tags a partial query should match.
const TAG_CACHE_TTL_MS = 5 * 60 * 1000;
let tagCache: { tags: string[]; fetchedAt: number } | null = null;

async function getDistinctTags(): Promise<string[]> {
  if (tagCache && Date.now() - tagCache.fetchedAt < TAG_CACHE_TTL_MS) {
    return tagCache.tags;
  }

  const businesses = await prisma.business.findMany({
    select: { productTag: true },
  });
  const tags = Array.from(new Set(businesses.flatMap((b) => b.productTag)));
  tagCache = { tags, fetchedAt: Date.now() };
  return tags;
}

export async function searchBusinesses(
  rawQuery: string,
  limit = 8,
): Promise<BusinessSearchResult[]> {
  const q = rawQuery.trim();
  if (!q) return [];

  const [matchingCategories, allTags] = await Promise.all([
    prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true },
    }),
    getDistinctTags(),
  ]);

  const lowerQ = q.toLowerCase();
  const matchedTags = allTags.filter((tag) => tag.toLowerCase().includes(lowerQ));

  const orConditions: Prisma.BusinessWhereInput[] = [
    { name: { contains: q, mode: "insensitive" } },
    { about: { contains: q, mode: "insensitive" } },
    { subcategory: { contains: q, mode: "insensitive" } },
    { location: { contains: q, mode: "insensitive" } },
    { platforms: { some: { url: { contains: q, mode: "insensitive" } } } },
  ];

  if (matchedTags.length) {
    orConditions.push({ productTag: { hasSome: matchedTags } });
  }
  if (matchingCategories.length) {
    orConditions.push({
      categoryId: { in: matchingCategories.map((c) => c.id) },
    });
  }

  const businesses = await prisma.business.findMany({
    where: { OR: orConditions },
    select: {
      id: true,
      name: true,
      logo: true,
      rating: true,
      reviewCount: true,
      category: { select: { name: true, slug: true } },
    },
    orderBy: { rating: "desc" },
    take: limit,
  });

  return businesses;
}
