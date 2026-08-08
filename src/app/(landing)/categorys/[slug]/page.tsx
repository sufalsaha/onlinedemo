import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BusinessCard } from "@/lib/data";
import { CategoryBusinessGrid } from "./CategoryBusinessGrid";



export const dynamic = "force-dynamic";


export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) {
    notFound();
  }

  const businesses = await prisma.business.findMany({
    where: { categoryId: category.id },
  });

  const businessCards: BusinessCard[] = businesses.map((b) => ({
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
    <>
      <section className="py-10 md:pt-[50px] md:pb-16 bg-[#dceddd]  md:bg-white relative overflow-hidden ">
        {/* Decorative gradient blur */}
        <div className="absolute w-[383px] h-[300px] left-1/2 -translate-x-[650px] top-[10%] bg-gradient-to-b from-[#7CB342] to-[#4A90E2] blur-[150px] opacity-30 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8  lg:px-[157px] max-w-[1440px] relative ">
          {/* Breadcrumb */}
          <div className=" text-[#5A5A5A] flex flex-col gap-4 md:mb-5">
            <div>
              <Link href="/businesses" className="text-[14px]">All Business </Link> /{" "}
              <Link href={`/categorys/${slug}`} className="text-[#00C085] text-[14px]  font-medium">
                {category.name}
              </Link>
            </div>

            <h1 className="text-[28px] md:text-3xl leading-[1.2] font-bold text-black  md:mb-6">
              Best {category.name} Business
            </h1>
          </div>
        </div>
      </section>

      <div className="flex flex-col justify-center items-center">
        <section className="container bg-white py-10 md:pt-10 md:pb-20  px-[20px]">
          {/* Business Cards Grid */}
          <div className="text-[18px] font-semibold text-[#121212] mb-6">
            Companies({businessCards.length})
          </div>

          <CategoryBusinessGrid cards={businessCards} />
        </section>
      </div>
    </>
  );
}
