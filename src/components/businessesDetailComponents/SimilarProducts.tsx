import { ChevronRight } from "lucide-react";
import { BizCard } from "../BizCard";
import { BusinessCard } from "@/lib/data";

export function SimilarProducts({ businesses }: { businesses: BusinessCard[] }) {
  return (
    <section className="bg-[#F9F8F5] py-14">
      <div className="container mx-auto px-4 md:px-8 lg:px-[166px] max-w-[1440px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-medium text-[24px] text-[#121212] tracking-tight">Similar Products</h2>
          <button className="border border-[#CEBFBF] rounded-full bg-white px-3 py-2 font-medium text-sm text-[#626161] hover:bg-gray-50 transition-colors flex items-center gap-1">
            See More
            <ChevronRight size={16} className="text-black" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {businesses.map((biz) => (
            <BizCard key={biz.id} card={biz} />
          ))}
        </div>
      </div>
    </section>
  );
}
