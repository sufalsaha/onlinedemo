import { BusinessCard } from "@/lib/data";
import { StarIcon, LogoPlaceholder } from "@/components/icons";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Image from "next/image";

interface BusinessCardProps {
  card: BusinessCard;
}

const platformIconMap = {
  facebook: FaFacebookF,
  youtube: FaYoutube,
  instagram: FaInstagram,
  twitter: FaTwitter,
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

export function BizCard({ card }: BusinessCardProps) {
  const isFeatured = card.featured;

  return (
    <div className="relative rounded-[10px] p-4 flex flex-col gap-3 transition-shadow hover:shadow-lg bg-[#fff] hover:bg-[rgba(69,198,70,0.05)] border border-[#E3DBDB] hover:border-[#45C646]">
      <Link href={`/businesses/${card.id}`} className="absolute inset-0 z-10" />

      {/* Logo */}
      <div className="w-[70px] h-[70px] border border-[#DDD] rounded-[6px] ">
        {card.logo ? (
          <img src={card.logo} alt="" width={100} height={100} />
        ) : (
          <LogoPlaceholder />
        )}
      </div>

      {/* Name */}
      <p className="text-[17px] font-medium text-[#2D2D2D] tracking-[-0.3px]">
        {card.name}
      </p>

      {/* Platform icons */}

      {/* <div className="flex items-center gap-1.5 relative z-20">
        {card.platforms.map((platform) => {
          const Icon = platformIconMap[platform];
          if (!Icon) return null;

          return (
            <Link key={platform} href={"#"}>
              <div className="w-[26px] h-[26px] rounded-[3px] flex items-center justify-center  border border-[#CCCCCC] hover:bg-[#1877F2]">
                <Icon className="hover:text-white" />
              </div>
            </Link>
          );
        })}
      </div> */}

      <div className="flex items-center gap-1.5 relative z-20">
        {card.platforms.map((platform, index) => {
          const name = typeof platform === "string" ? platform : platform.name;
          const Icon = platformIconMap[name as keyof typeof platformIconMap];
          const colors = platformColorMap[name as keyof typeof platformColorMap];

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

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-[2px]">
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} filled={i < card.rating} />
          ))}
        </div>
        <span className="font-['Inter'] text-[14px] font-semibold text-black">
          {card.rating.toFixed(2)}
          <span className="text-[#5A5A5A]">({card.reviewCount})</span>
        </span>
      </div>
    </div>
  );
}
