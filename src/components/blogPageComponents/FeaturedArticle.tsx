import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { BlogPost } from "./types";

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function FeaturedArticle({ post }: { post: BlogPost }) {
  return (
    <section className="bg-white pb-10 md:pb-14">
      <div className="container mx-auto px-4 md:px-8 lg:px-[157px] max-w-[1440px]">
        <ScrollReveal>
          <Link
            href={`/blogs/${post.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[20px] border border-[#E3DBDB] bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="relative h-[240px] lg:h-full overflow-hidden bg-[#F0F0F0]">
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <Badge className="absolute top-4 left-4 bg-[#00C085] text-white border-none">
                Featured
              </Badge>
            </div>

            <div className="p-6 md:p-10 flex flex-col justify-center gap-4">
              <Badge variant="secondary" className="w-fit">
                {post.category}
              </Badge>

              <h2 className="text-[22px] md:text-[28px] font-bold text-black leading-tight group-hover:text-[#00C085] transition-colors">
                {post.title}
              </h2>

              <p className="text-[15px] text-[#5A5A5A] leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={post.authorAvatar ?? undefined} alt={post.authorName} />
                  <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium text-black">{post.authorName}</div>
                  <div className="text-[#5A5A5A] flex items-center gap-1.5 text-xs">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>&middot;</span>
                    <Clock className="w-3 h-3" />
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 mt-2 bg-[#00C085] group-hover:bg-[#00a874] transition-colors rounded-[12px] px-6 py-3 font-medium text-white w-fit">
                Read More
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
