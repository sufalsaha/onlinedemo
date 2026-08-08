import Link from "next/link";
import { Clock, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { BlogPost } from "./types";

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="group relative rounded-[10px] border border-[#E3DBDB] hover:border-[#45C646] hover:bg-[rgba(69,198,70,0.05)] bg-white transition-colors flex flex-col overflow-hidden">
      <Link href={`/blogs/${post.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Read {post.title}</span>
      </Link>

      <div className="relative h-[180px] overflow-hidden bg-[#F0F0F0]">
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <Badge className="absolute top-3 left-3 bg-white text-[#2D2D2D] border border-[#E3DBDB]">
          {post.category}
        </Badge>
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <h3 className="text-[16px] font-semibold text-[#1D1919] leading-snug line-clamp-2 group-hover:text-[#00C085] transition-colors">
          {post.title}
        </h3>
        <p className="text-[13px] text-[#5A5A5A] leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2 mt-auto pt-3 relative z-20">
          <Avatar className="w-6 h-6">
            <AvatarImage src={post.authorAvatar ?? undefined} alt={post.authorName} />
            <AvatarFallback className="text-[10px]">
              {post.authorName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-[12px] font-medium text-[#2D2D2D] truncate">
            {post.authorName}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#5A5A5A] pt-1 border-t border-[#F0F0F0] mt-1">
          <span>{formatDate(post.publishedAt)}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.viewCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
