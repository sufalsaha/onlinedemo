"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ChevronRight, UserRound } from "lucide-react";
import { StarRating } from "./StarRating";
import { BusinessCard, ProudReview } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ReviewType {
  id: string;
  rating: number;
  reviewerName: string;
  authorLocation: string | null;
  title: string | null;
  message: string;
  createdAt: Date;
  businessId: string;
  image: string | null;
}

// এখানে আমরা সরাসরি reviews অ্যারে নিচ্ছি, কোনো জটিল ডাটা অবজেক্ট না
interface LatestReviewsProps {
  reviews: ReviewType[]; 
}




const PAGE_SIZE = 12;

export function LatestReviews({ reviews = [] }: LatestReviewsProps) {

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleReviews = reviews.slice(0, visibleCount);
  const remaining = Math.max(reviews.length - visibleCount, 0);

  return (
    <section className="bg-white py-16 container mx-auto px-4 md:px-8 lg:px-[166px] max-w-[1440px]">
      <h2 className="font-medium text-[20px] md:text-3xl text-black mb-8">Latest Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {visibleReviews.map((review) => (
          <div key={review.id} className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 fill-mode-both">
            <ReviewCard review={review} />
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, reviews.length))}
            className="border border-[#CEBFBF] rounded-full bg-white px-10 py-3 font-medium text-lg text-[#626161] hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            See All ({remaining}) Reviews
            <ChevronRight size={20} className="text-black" />
          </button>
        </div>
      )}
    </section>
  );
}





function ReviewCard({ review }: { review: ReviewType }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [fullHeight, setFullHeight] = useState(0);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 0;
    const collapsed = lineHeight * 4;
    const full = el.scrollHeight;

    setCollapsedHeight(collapsed);
    setFullHeight(full);
    setShowToggle(full > collapsed + 1);
  }, [review.message]);

  return (
    <div className="border border-[#E3DBDB] rounded-xl p-4 bg-white flex flex-col gap-3.5 h-full">
      <StarRating rating={review.rating} size="sm" />
      {review.title && (
        <p className="font-semibold text-[15px] text-[#1D1919] m-0 -mb-1">
          {review.title}
        </p>
      )}
      <div
        className="overflow-hidden"
        style={{
          maxHeight: expanded ? fullHeight : collapsedHeight,
          transition: "max-height 300ms ease-in-out",
        }}
      >
        <p ref={textRef} className=" text-[15px] text-[#2D2D2D] m-0 leading-relaxed">
          {review.message}
        </p>
      </div>
      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-sm font-medium text-[#2D2D2D] underline underline-offset-2 self-start hover:opacity-70 transition-opacity -mt-2"
        >
          {expanded ? "See Less" : "See More"}
        </button>
      )}
      <div className="flex items-center gap-2.5 mt-auto pt-2">
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={review.image ?? undefined} alt={review.reviewerName} />
          <AvatarFallback>
            <UserRound className="w-4 h-4 text-slate-400" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-sm text-[#2D2D2D]">{review.reviewerName}</div>
          <div className="text-xs text-[#2D2D2D] opacity-80">
            {[
              review.authorLocation,
              new Date(review.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}




// import { ChevronRight } from "lucide-react";
// import { StarRating } from "./BusinessHero";

// interface ReviewType {
//   id: string;
//   rating: number;
//   reviewerName: string;
//   authorLocation: string;
//   message: string;
//   createdAt: Date;
//   businessId: string;
// }

// // এখানে আমরা সরাসরি reviews অ্যারে নিচ্ছি, কোনো জটিল ডাটা অবজেক্ট না
// interface LatestReviewsProps {
//   reviews: ReviewType[]; 
// }

// export function LatestReviews({ reviews = [] }: LatestReviewsProps) {
//   const countReview = reviews.length;

//   return (
//     <section className="bg-white py-16 container mx-auto px-4 md:px-8 lg:px-[166px] max-w-[1440px]">
//       <h2 className="font-medium text-[20px] md:text-3xl text-black mb-8">
//         Latest Reviews
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
//         {reviews.map((review) => (
//           <ReviewCard key={review.id} review={review} />
//         ))}
//       </div>

//       <div className="flex justify-center mt-10">
//         <button className="border border-[#CEBFBF] rounded-full bg-white px-10 py-3 font-medium text-lg text-[#626161] hover:bg-gray-50 transition-colors flex items-center gap-2">
//           See all {countReview} reviews
//           <ChevronRight size={20} className="text-black" />
//         </button>
//       </div>
//     </section>
//   );
// }

// function ReviewCard({ review }: { review: ReviewType }) {
//   return (
//     <div className="border border-[#E3DBDB] rounded-xl p-4 bg-white flex flex-col gap-3.5 h-full">
//       <StarRating rating={review.rating} size="sm" />
//       <p className="text-[15px] text-[#2D2D2D] m-0 leading-relaxed">
//         {review.message} 
//       </p>
//       <div className="flex items-center gap-2.5 mt-auto pt-2">
//         <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
//         <div>
//           <div className="font-semibold text-sm text-[#2D2D2D]">
//             {review.reviewerName}
//           </div>
//           <div className="text-xs text-[#2D2D2D] opacity-80">
//             {review.authorLocation}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }