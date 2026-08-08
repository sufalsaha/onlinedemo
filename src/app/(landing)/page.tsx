
import { HeroSection } from "@/components/HeroSection";
import { BrowseSection } from "@/components/BrowseSection";
import { ComplainSection } from "@/components/ComplainSection";
import { VerifySection } from "@/components/VerifySection";
import { prisma } from "@/lib/prisma";
import {  Data } from "@/lib/data";



export const dynamic = "force-dynamic";

// import { register } from "@/actions/user-actions";





export default async  function Home() {

  // await register()
   const category = await prisma.category.findMany();
  //  console.log(category);

   const businesses = await prisma.business.findMany();
  //  console.log(businesses);
   
   const allData : Data[] = category.map((cat) => ({
  category: cat.name,
  slug: cat.slug,
  categoryId: cat.id,
  cards: businesses.filter((b) => b.categoryId === cat.id).map((b) => ({
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

// console.log(allData);

   const visibleData = allData.filter((d) => d.cards.length > 0);
   const visibleCategories = category.filter((cat) =>
     visibleData.some((d) => d.categoryId === cat.id)
   );

  return (
    <main className="min-h-screen">

      <HeroSection />
      <BrowseSection category={visibleCategories} data={visibleData} />
      <ComplainSection />
      {/* <ReviewsSection /> */}
      <VerifySection />
      
    </main>
  );
}
