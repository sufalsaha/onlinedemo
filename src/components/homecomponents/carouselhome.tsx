
import { BusinessCard } from "@/lib/data";
import { ChevronRight } from "../icons";
import { BizCard } from "../BizCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

interface CarouselHomeProps {
  data: {
    category: string;
    slug: string,
    categoryId: string;
    cards: BusinessCard[];
  }[];
}

export default function CarouselHome({ data }: CarouselHomeProps) {
  return (
    <div className="w-full md:px-4 md:px-14 mt-10"> {/* বাটন যেন স্ক্রিনের বাইরে না যায় তাই প্যাডিং সামান্য বাড়ানো হয়েছে */}
      <div className="flex flex-col gap-10">
        {data.map((section) => (
          <div key={section.category} className="w-full">
            
            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] md:text-[22px] font-medium text-[#121212] tracking-[-0.4px]">
                {section.category}
              </h3>
              <Link href={`/categorys/${section.slug}`} className="flex items-center gap-1 border border-[#CEBFBF] rounded-full px-4 py-[6px] text-[14px] font-medium text-[#626161] bg-white hover:bg-gray-50 hover:border-[#00C085] cursor-pointer">
                See More
                <ChevronRight />
              </Link>
            </div>

            {/* Carousel */}
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full group"
            >
              <CarouselContent className="-ml-4 md:-ml-5">
                {section.cards.map((card) => (
                  <CarouselItem 
                    key={card.id} 
                    className="pl-4 md:pl-5 basis-[75%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <BizCard card={card} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Navigation Arrows (Fixed Hover & Click Issue) */}
              <CarouselPrevious className="hidden md:flex opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10" />
              <CarouselNext className="hidden md:flex opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10" />
            </Carousel>

          </div>
        ))}
      </div>
    </div>
  );
}








// import {  BusinessCard } from "@/lib/data";
// import { ChevronRight } from "../icons";
// import { BizCard } from "../BizCard";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// interface CarouselHomeProps {
//   data: {
//     category: string;
//     cards: BusinessCard[];
//   }[];
// }

// export default function CarouselHome({ data }: CarouselHomeProps) {
//   return (
//     <div className="w-full px-4 md:px-12 mt-10"> {/* Added padding so arrows don't get cut off */}
//       <div className="flex flex-col gap-10">
//         {data.map((section) => (
//           <div key={section.category} className="w-full">
            
//             {/* Section header */}
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-[22px] font-medium text-[#121212] tracking-[-0.4px]">
//                 {section.category}
//               </h3>
//               <button className="flex items-center gap-1 border border-[#CEBFBF] rounded-full px-4 py-[6px] text-[14px] font-medium text-[#626161] bg-white hover:bg-gray-50 cursor-pointer">
//                 See More
//                 <ChevronRight />
//               </button>
//             </div>

//             {/* Carousel replacing the Grid */}
//             <Carousel
//               opts={{
//                 align: "start",
//               }}
//               className="w-full"
//             >
//               <CarouselContent className="-ml-4 md:-ml-5">
//                 {section.cards.map((card) => (
//                   <CarouselItem 
//                     key={card.id} 
//                     // Responsive sizing: 1 on mobile, 2 on md, 3 on lg, 4 on xl
//                     className="pl-4 md:pl-5 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
//                   >
//                     <BizCard card={card} />
//                   </CarouselItem>
//                 ))}
//               </CarouselContent>
              
//               {/* Navigation Arrows */}
//               <CarouselPrevious className="hidden md:flex" />
//               <CarouselNext className="hidden md:flex" />
//             </Carousel>

//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }