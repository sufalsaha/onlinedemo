import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Eye } from "lucide-react";

import { getBlogBySlug, incrementBlogView } from "@/actions/blog-action";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BlogCtaSection } from "@/components/blogPageComponents/BlogCtaSection";

export const dynamic = "force-dynamic";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Post not found | OnlineTrustPoint" };

  return {
    title: `${blog.title} | OnlineTrustPoint Blog`,
    description: blog.excerpt,
  };
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  incrementBlogView(slug);

  return (
    <>
      <section className="bg-white pt-8 pb-6 md:pt-[60px] md:pb-10">
        <div className="container mx-auto px-4 md:px-8 lg:px-[157px] max-w-[1440px]">
          <div className="text-[#5A5A5A] mb-5 text-[14px]">
            <Link href="/blogs" className="text-[#00C085] font-medium">
              Blog
            </Link>{" "}
            / {blog.title}
          </div>

          <Badge variant="secondary" className="mb-4">
            {blog.category}
          </Badge>

          <h1 className="text-[26px] md:text-[36px] font-bold text-black leading-tight mb-5 max-w-[860px]">
            {blog.title}
          </h1>

          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={blog.authorAvatar ?? undefined} alt={blog.authorName} />
              <AvatarFallback>{blog.authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium text-black">{blog.authorName}</div>
              <div className="text-[#5A5A5A] flex items-center gap-2 text-xs">
                <span>{formatDate(blog.publishedAt)}</span>
                <span>&middot;</span>
                <Clock className="w-3 h-3" />
                <span>{blog.readingTime} min read</span>
                <span>&middot;</span>
                <Eye className="w-3 h-3" />
                <span>{blog.viewCount} views</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {blog.coverImage && (
        <section className="bg-white pb-8 md:pb-10">
          <div className="container mx-auto px-4 md:px-8 lg:px-[157px] max-w-[1440px]">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full max-h-[480px] object-cover rounded-[20px]"
            />
          </div>
        </section>
      )}

      <section className="bg-white pb-14 md:pb-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-[157px] max-w-[1440px]">
          <div className="max-w-[800px]">
            <p className="text-[16px] text-[#2D2D2D] leading-[1.9] whitespace-pre-wrap">
              {blog.content}
            </p>

            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-[#E3DBDB]">
                {blog.tags.map((tag) => (
                  <Link key={tag} href={`/blogs?tag=${encodeURIComponent(tag)}`}>
                    <Badge
                      variant="outline"
                      className="border-[#E3DBDB] text-[#5A5A5A] hover:border-[#00C085] hover:text-[#00C085] transition-colors"
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <BlogCtaSection />
    </>
  );
}
