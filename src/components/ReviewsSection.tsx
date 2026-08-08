import { ChevronLeft, ChevronRight, PlayIcon } from "@/components/icons";
import { reviews } from "@/lib/data";

const gradients = [
  "linear-gradient(135deg, #4a7c59, #2d5a3d)",
  "linear-gradient(135deg, #5a8a6a, #3d6b50)",
];

export function ReviewsSection() {
  return (
    <section className="bg-white py-20 px-[117px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[36px] font-medium text-black">Latest Reviews</h2>
        <div className="flex gap-2">
          <button className="w-[26px] h-[26px] border border-[#CEBFBF] rounded-[6px] bg-white flex items-center justify-center text-[#333] hover:bg-gray-50 cursor-pointer">
            <ChevronLeft />
          </button>
          <button className="w-[26px] h-[26px] border border-[#CEBFBF] rounded-[6px] bg-white flex items-center justify-center text-[#333] hover:bg-gray-50 cursor-pointer">
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Reviews grid */}
      <div className="grid grid-cols-2 gap-5">
        {reviews.map((review, idx) => (
          <div
            key={review.id}
            className="flex rounded-[12px] overflow-hidden"
            style={{ border: "1px solid #E3DBDB" }}
          >
            {/* Photo column */}
            <div
              className="relative w-[250px] shrink-0 min-h-[360px]"
              style={{ background: gradients[idx % gradients.length] }}
            >
              {/* Overlay gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.75) 40%, transparent 100%)",
                }}
              />

              {/* Reviewer info */}
              <div className="absolute bottom-6 left-5 z-10">
                <p className="text-[18px] font-semibold text-white">
                  {review.reviewerName}
                </p>
                <p className="text-[14px] text-white opacity-85">
                  {review.businessName}
                </p>
              </div>

              {/* Play button */}
              <div className="absolute bottom-6 right-5 z-10">
                <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center border border-[rgba(0,128,255,0.16)] backdrop-blur-sm bg-[rgba(255,255,255,0.28)]">
                  <div className="w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform">
                    <PlayIcon />
                  </div>
                </div>
              </div>
            </div>

            {/* Quote column */}
            <div className="flex-1 p-6 flex flex-col justify-between bg-white">
              <p className="text-[16px] font-semibold text-[#2D2D2D] leading-[1.65] flex-1">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="mt-4">
                {review.authorTitle.split("\n").map((line, i) => (
                  <p
                    key={i}
                    className={`text-[13px] ${
                      i === 0
                        ? "font-semibold text-[#2D2D2D]"
                        : "font-normal text-[#626161]"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
