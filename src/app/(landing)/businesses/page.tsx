
import { Data } from "@/lib/data";
import Link from "next/link";
import { BrowseSection } from "@/components/BrowseSection";
import { prisma } from "@/lib/prisma";

export default async function AllBusinessPage() {
  const category = await prisma.category.findMany();
  // console.log(category);

  const businesses = await prisma.business.findMany();
  // console.log(businesses);

  const allData: Data[] = category.map((cat) => ({
    category: cat.name,
    slug: cat.slug,
    categoryId: cat.id,
    cards: businesses
      .filter((b) => b.categoryId === cat.id)
      .map((b) => ({
        id: b.id,
        name: b.name,
        logo: b.logo,
        about: b.about,
        reviewCount: b.reviewCount,
        rating: b.rating,
        productTag: b.productTag,
        platforms: b.platforms,
      })),
  }));

  return (
    <>
      <section className="py-10 md:pt-[50px] md:pb-16   bg-[#dceddd] md:bg-white  relative overflow-hidden ">
        {/* Decorative gradient blur */}
        <div className="absolute w-[383px] h-[300px] left-1/2 -translate-x-[650px] top-[10%] bg-gradient-to-b from-[#7CB342] to-[#4A90E2] blur-[150px] opacity-30 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8  lg:px-[157px] max-w-[1440px] relative ">
          {/* Breadcrumb */}
          <div className=" text-[#5A5A5A] flex flex-col gap-3 md:gap-4 md:mb-5">
            <div>
              {/* All Business / */}
              <Link
                href="/businesses"
                className="text-[#00C085] text-[14px] font-medium"
              >
                All Business /
              </Link>
            </div>

            <h1 className="text-[28px] md:text-[32px] font-bold text-black ">
              All Businesses
            </h1>
          </div>
        </div>
        {/* <div className="w-full h-[1px] border-t border-[#ca8080] " /> */}
      </section>

      <BrowseSection category={category} data={allData} />
    </>
  );
}
