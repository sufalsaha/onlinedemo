"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
} from "@/components/icons";
import { Data } from "@/lib/data";
import CarouselHome from "./homecomponents/carouselhome";
import { categoryIconMap } from "./categoryIconMap";
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, GridIcon } from "lucide-react";

export function BrowseSection({ category, data }: { category: { id: string; name: string; slug: string }[]; data: Data[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>("all");
  // ১. শুরুতে কয়টি আইটেম দেখাবে তা ট্র্যাক করার জন্য State
  const [visibleCount, setVisibleCount] = useState<number>(4);

  // ২. ক্যাটাগরি চেঞ্জ হলে আইটেম সংখ্যা আবার রিসেট হয়ে ৪ হয়ে যাবে
  useEffect(() => {
    setVisibleCount(4);
  }, [activeCategory]);

  // Category tabs horizontal scroll controls
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = () => {
    const el = categoryScrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 1);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [category]);

  const scrollCategories = (direction: "prev" | "next") => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  };

  // ফিল্টার করা ডাটা
  const currentCategoryObj = data.filter((category) => category.categoryId === activeCategory);
  
  // কোন ডাটাটি শো করবে (ফিল্টারড ডাটা অথবা সব ডাটা) তা নির্ধারণ করা
  const itemsToDisplay = currentCategoryObj.length > 0 ? currentCategoryObj : data;

  // ৩. ডাটাকে স্লাইস (slice) করা যেন শুধু নির্দিষ্ট সংখ্যার আইটেমই Carousel-এ যায়
  const slicedData = itemsToDisplay.slice(0, visibleCount);

  // ৪. See More বাটনে ক্লিক করলে আরও ৪টি আইটেম যোগ করার ফাংশন
  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <section className="container bg-white py-10 md:py-20 px-[20px]">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-2">
          <h2 className="text-[22px] md:text-[30px] font-semibold text-[#121212]">
            What are you looking for?
          </h2>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              aria-label="Previous categories"
              onClick={() => scrollCategories("prev")}
              disabled={!canScrollPrev}
              className="flex items-center justify-center size-8 md:size-9 rounded-full border border-[#E3DBDB] bg-white text-[#5A5A5A] transition-colors hover:border-[#00C085] hover:text-[#00C085] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E3DBDB] disabled:hover:text-[#5A5A5A] cursor-pointer"
            >
              <ChevronLeftIcon size={18} />
            </button>
            <button
              type="button"
              aria-label="Next categories"
              onClick={() => scrollCategories("next")}
              disabled={!canScrollNext}
              className="flex items-center justify-center size-8 md:size-9 rounded-full border border-[#E3DBDB] bg-white text-[#5A5A5A] transition-colors hover:border-[#00C085] hover:text-[#00C085] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E3DBDB] disabled:hover:text-[#5A5A5A] cursor-pointer"
            >
              <ChevronRightIcon size={18} />
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div
          ref={categoryScrollRef}
          onScroll={updateScrollState}
          className="flex items-center gap-5 mb-9 mt-6 overflow-x-auto whitespace-nowrap scrollbar-none"
        >
          {/* All Button */}
          <button
            onClick={() => setActiveCategory("all")}
            className="flex items-center gap-2 text-[16px] font-medium transition-colors cursor-pointer bg-transparent border-none flex-shrink-0"
            style={{ color: activeCategory === "all" ? "#49C24C" : "#5A5A5A" }}
          >
            <GridIcon className={activeCategory === "all" ? "text-[#49C24C]" : "text-[#5A5A5A]"} /> 
            <span>All</span>
          </button>

          {/* Dynamic categories list */}
          {category.map((cat) => {
            const Icon = categoryIconMap[cat.slug];
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex items-center gap-2 text-[16px] font-normal transition-colors cursor-pointer bg-transparent border-none flex-shrink-0"
                style={{ color: isActive ? "#49C24C" : "#5A5A5A" }}
              >
                {Icon && (
                  <Icon
                    className={isActive ? "text-[#49C24C]" : "text-[#5A5A5A]"}
                  />
                )}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* স্লাইস করা ডাটা Carousel-এ পাঠানো হচ্ছে */}
        <CarouselHome data={slicedData} />

        {/* See more button - ডাটা শেষ হয়ে গেলে বাটনটি হাইড হয়ে যাবে */}
        {visibleCount < itemsToDisplay.length && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={handleSeeMore}
              className="flex items-center gap-2 border border-[#CEBFBF] rounded-[8px] px-5 py-3 text-[16px] font-medium text-[#626161] bg-white hover:bg-gray-50 cursor-pointer"
            >
              See More Businesses
              <ChevronRight />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}