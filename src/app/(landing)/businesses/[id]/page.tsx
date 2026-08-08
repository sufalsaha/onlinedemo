import { BusinessHero } from "@/components/businessesDetailComponents/BusinessHero";
import { LatestReviews } from "@/components/businessesDetailComponents/LatestReviews";
import { SimilarProducts } from "@/components/businessesDetailComponents/SimilarProducts";
import { VerifySection } from "@/components/VerifySection";
import { prisma } from "@/lib/prisma";
import { BusinessCard } from "@/lib/data";
import { notFound } from "next/navigation";



export const dynamic = "force-dynamic";

// ─── Main Page ────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ id: string }>;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default async function Page({ params }: PageProps) {
  // 1. Properly await the params to avoid the React/Next stream error
  const { id } = await params;

  // 2. Fetch the business from your database using the ID
  const businessData = await prisma.business.findUnique({
    where: { id },
    include: {
      reviews: {
        where: { status: "approved", deleted: false },
        orderBy: { createdAt: "desc" },
      },
    },
  });



  // 3. Fallback: If it's not found in the DB, trigger Next.js 404
  if (!businessData) {
    notFound();
  }

  const reviews = businessData.reviews || [];

  // Random "similar products" — a fresh set of 4 other businesses on every load
  const otherBusinesses = await prisma.business.findMany({
    where: { id: { not: id } },
  });

  const similarBusinesses: BusinessCard[] = shuffle(otherBusinesses)
    .slice(0, 4)
    .map((b) => ({
      id: b.id,
      name: b.name,
      logo: b.logo,
      about: b.about,
      reviewCount: b.reviewCount,
      rating: b.rating,
      productTag: b.productTag,
      platforms: b.platforms,
    }));

  return (
    <div className="min-h-screen font-sans bg-white">
      <main>
        {/* 4. Pass the actual database record to your components */}
        <BusinessHero data={businessData} />
        <LatestReviews reviews={reviews} />
        <SimilarProducts businesses={similarBusinesses} />
        <VerifySection />
      </main>
    </div>
  );
}