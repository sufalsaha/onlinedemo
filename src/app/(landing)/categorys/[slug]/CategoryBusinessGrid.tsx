"use client";

import { useState } from "react";
import { ChevronRight } from "@/components/icons";
import { BizCard } from "@/components/BizCard";
import { BusinessCard } from "@/lib/data";

export function CategoryBusinessGrid({ cards }: { cards: BusinessCard[] }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const displayedCards = cards.slice(0, visibleCount);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {displayedCards.length > 0 ? (
          displayedCards.map((card) => <BizCard key={card.id} card={card} />)
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No businesses found in this category.
          </div>
        )}
      </div>

      {visibleCount < cards.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="flex items-center gap-2 border border-[#CEBFBF] rounded-[8px] px-5 py-3 text-[16px] font-medium text-[#626161] bg-white hover:bg-gray-50 cursor-pointer transition-colors"
          >
            See More Businesses
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
