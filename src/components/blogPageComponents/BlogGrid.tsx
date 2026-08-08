import { FileQuestion } from "lucide-react";

import { ScrollReveal } from "@/components/ScrollReveal";
import { BlogCard } from "./BlogCard";
import type { BlogPost } from "./types";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-[#E3DBDB] rounded-xl">
        <FileQuestion className="w-8 h-8 text-[#9CA3AF] mb-3" />
        <p className="font-medium text-black">No posts found</p>
        <p className="text-sm text-[#5A5A5A] mt-1">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {posts.map((post, index) => (
        <ScrollReveal key={post.id} delay={(index % 3) * 80}>
          <BlogCard post={post} />
        </ScrollReveal>
      ))}
    </div>
  );
}
