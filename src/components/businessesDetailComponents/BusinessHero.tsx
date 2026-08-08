import { BusinessCard } from "@/lib/data";
import { AtSign, Globe, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { WriteReviewDialog } from "./WriteReviewDialog";

const platformIconMap = {
  facebook: FaFacebookF,
  youtube: FaYoutube,
  instagram: FaInstagram,
  twitter: FaTwitter,
  website: Globe,
  Website: Globe,
};

const platformColorMap = {
  facebook: {
    hoverBg: "hover:bg-[#1877F2]",
  },
  instagram: {
    hoverBg: "hover:bg-[#E4405F]",
  },
  twitter: {
    hoverBg: "hover:bg-[#1DA1F2]",
  },
  youtube: {
    hoverBg: "hover:bg-[#FF0000]",
  },
  TikTok: {
    hoverBg: "hover:bg-[#000000]",
  },
  WhatsApp: {
    hoverBg: "hover:bg-[#25D366]",
  },
  Website: {
    hoverBg: "hover:bg-[#4382DF]",
  },
};

export function BusinessHero({ data }: { data: BusinessCard }) {
  return (
    <section className="py-10 md:pt-[100px] md:pb-16 bg-[#dceddd] md:bg-white relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute w-[383px] h-[300px] left-1/2 -translate-x-[650px] top-[10%] bg-gradient-to-b from-[#7CB342] to-[#4A90E2] blur-[150px] opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 lg:px-[157px] max-w-[1440px] relative">
        {/* Breadcrumb */}
        <div className=" text-[#5A5A5A] mb-5">
          All Business /{" "}
          <Link href={""} className="text-[#00C085] text-[14px] font-medium">
            {data.name}
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">
          {/* Left: Business info */}
          <div className="flex-1">
            {/* <div className="w-[118px] h-[47px] bg-[#f5f5f5] rounded-md mb-5 flex items-center justify-center border border-gray-200">
              <span className="font-bold text-sm text-[#00C085]">১৬আনা</span>
            </div> */}
            <div className="w-[100px] h-[100px] border border-[#DDD] rounded-[6px] mb-5">
              <img
                src={data.logo || "/placeholder-logo.png"}
                alt={data.name}
                width={100}
                height={100}
                className="object-cover w-[100px] h-[100px]"
              />
            </div>

            <h2 className="text-[24px] md:text-[28px] font-bold text-black mb-4">
              {data.name}
            </h2>

            <p className="text-[18px] leading-8 text-black mb-6 max-w-xl">
              {data.about}
            </p>

            <div className="flex flex-wrap items-center gap-7 mb-8">
              <div className="flex items-center gap-1.5 relative z-20">
                {data.platforms.map((platform, index) => {
                  const name =
                    typeof platform === "string" ? platform : platform.name;
                  const Icon =
                    platformIconMap[name as keyof typeof platformIconMap];
                  const colors =
                    platformColorMap[name as keyof typeof platformColorMap];

                 if (!Icon || !colors) return null;

                  return (
                    <a
                      key={index}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform.name}
                    >
                      <div
                        className={`w-[32px] h-[32px] rounded-[3px] flex items-center justify-center border border-[#CCCCCC] hover:text-white  ${colors.hoverBg}`}
                      >
                        <Icon className=" " />
                      </div>
                    </a>
                  );
                })}
              </div>
              {/* <div className="flex gap-1.5"> */}
              {/* <SocialIcon label="f" />
                <SocialIcon label="T" />
              
                <SocialIcon icon={AtSign} /> */}
              {/* </div> */}

              <div className="flex items-center gap-2">
                <StarRating rating={data.rating} size="sm" />
                <span className="font-semibold text-base text-black">{parseFloat(data.rating.toFixed(1))}({data.reviewCount})</span>
              </div>
            </div>

            <WriteReviewDialog businessId={data.id} businessName={data.name} />
          </div>

          {/* Right: Rating widget */}
          <div className="max-w-[372px] lg:w-[372px] shrink-0 flex flex-col gap-5">
            <div className="border border-[#E3DBDB] rounded-xl p-6 bg-white shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div>
                  <div className="font-bold text-5xl text-[#1D1919] leading-none">
                    {parseFloat(data.rating.toFixed(1))}
                  </div>
                  <div className="font-semibold text-sm text-[#1D1919] mt-1.5">
                    Excellent
                  </div>
                  <div className="mt-1">
                    <StarRating rating={data.rating} size="sm" />
                  </div>
                  <div className="text-xs text-[#626161] mt-1">{data.reviewCount} reviews</div>
                </div>

                <div className="flex-1 flex flex-col gap-1.5 mt-1">
                  {[
                    { label: "5-star", pct: 0 },
                    { label: "4-star", pct: 0 },
                    { label: "3-star", pct: 0 },
                    { label: "2-star", pct: 0 },
                    { label: "1-star", pct: 0 },
                  ].map((bar) => (
                    <div key={bar.label} className="flex items-center gap-2">
                      <span className="text-[11px] text-[#626161] w-9 shrink-0">
                        {bar.label}
                      </span>
                      <div className="flex-1 h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00C085] rounded-full"
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="#" className="text-xs text-[#00C085] hover:underline">
                How is the TrustScore calculated?
              </Link>
            </div>

            <div>
              <div className="text-xl text-black mb-3">Our Products</div>
              <div className="flex flex-wrap gap-2.5">
                {data.productTag.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[#CEBFBF] rounded-full px-3 py-1.5 font-medium text-sm text-[#626161] bg-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const boxSize = size === "sm" ? "w-[18px] h-[18px]" : "w-[22px] h-[22px]";
  const starSize = size === "sm" ? 16 : 18;

  return (
    <div className={`flex ${size === "sm" ? "gap-0.5" : "gap-1"}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating);
        const halfFilled = !filled && star - 0.5 <= rating;

        // হাফ-স্টারের জন্য ইউনিক আইডি গ্রাডিয়েন্ট
        const bgGradientId = `bg-half-${star}-${size}`;
        const starGradientId = `star-half-${star}-${size}`;

        return (
          <div
            key={star}
            className={`${boxSize} rounded-[2.5px] flex items-center justify-center relative overflow-hidden`}
            style={{
              background: filled
                ? "#45C646"
                : halfFilled
                  ? `linear-gradient(90deg, #45C646 50%, #ddd 50%)`
                  : "#ddd",
            }}
          >
            <svg
              width={starSize}
              height={starSize}
              viewBox="0 0 11 11"
              fill="none"
            >
              <defs>
                {/* হাফ-স্টারের ভেতরের আইকনের জন্য গ্রাডিয়েন্ট */}
                <linearGradient id={starGradientId}>
                  <stop offset="50%" stopColor="#FEFEFE" />
                  <stop offset="50%" stopColor="#bbb" />
                </linearGradient>
              </defs>
              <path
                d="M5.5 1l1.2 2.6 2.8.4-2 2 .5 2.8L5.5 7.4l-2.5 1.4.5-2.8-2-2 2.8-.4z"
                fill={
                  filled
                    ? "#FEFEFE"
                    : halfFilled
                      ? `url(#${starGradientId})`
                      : "#bbb"
                }
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────

export function SocialIcon({
  label,
  isGradient,
  icon: Icon,
}: {
  label?: string;
  isGradient?: boolean;
  icon?: any;
}) {
  return (
    <div
      className={`w-6 h-6 rounded flex items-center justify-center text-white text-[11px] font-bold ${
        isGradient
          ? "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]"
          : "bg-black"
      }`}
      style={!isGradient && label === "f" ? { backgroundColor: "#1877F2" } : {}}
    >
      {Icon ? <Icon size={14} /> : label}
    </div>
  );
}
