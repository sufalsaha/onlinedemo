import type { Metadata } from "next";

import {
  getPublishedBlogs,
  getFeaturedBlog,
  getBlogCategories,
  getBlogTags,
  getRecentBlogs,
  getPopularBlogs,
} from "@/actions/blog-action";
import { BlogHero } from "@/components/blogPageComponents/BlogHero";
import { FeaturedArticle } from "@/components/blogPageComponents/FeaturedArticle";
import { BlogFilters } from "@/components/blogPageComponents/BlogFilters";
import { BlogGrid } from "@/components/blogPageComponents/BlogGrid";
import { BlogPagination } from "@/components/blogPageComponents/BlogPagination";
import { BlogSidebar } from "@/components/blogPageComponents/BlogSidebar";
import { NewsletterSection } from "@/components/blogPageComponents/NewsletterSection";
import { BlogCtaSection } from "@/components/blogPageComponents/BlogCtaSection";

export const metadata: Metadata = {
  title: "Blog | OnlineTrustPoint",
  description:
    "Insights, guides, and stories to help you find trustworthy businesses and make confident buying decisions online.",
};

export const dynamic = "force-dynamic";

interface BlogsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  const search = params.q ?? "";
  const category = params.category ?? "";
  const tag = params.tag ?? "";
  const sort = (params.sort as "latest" | "popular" | "oldest") ?? "latest";
  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  const hasActiveFilters = Boolean(search || category || tag);

  const [
    featuredPost,
    { data: posts, total, pageSize },
    categories,
    tags,
    recentPosts,
    popularPosts,
  ] = await Promise.all([
    hasActiveFilters || page > 1 ? Promise.resolve(null) : getFeaturedBlog(),
    getPublishedBlogs({ page, search, category, tag, sort }),
    getBlogCategories(),
    getBlogTags(),
    getRecentBlogs(5),
    getPopularBlogs(5),
  ]);

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  return (
    <>
      <BlogHero />

      {featuredPost && <FeaturedArticle post={featuredPost} />}

      <section className="bg-white pb-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-[157px] max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
            <div>
              <BlogFilters
                search={search}
                category={category}
                tag={tag}
                sort={sort}
                categories={categories}
                tags={tags}
              />
              <BlogGrid posts={posts} />
              <BlogPagination page={page} totalPages={totalPages} searchParams={params} />
            </div>

            <BlogSidebar
              search={search}
              categories={categories}
              tags={tags}
              recentPosts={recentPosts}
              popularPosts={popularPosts}
            />
          </div>
        </div>
      </section>

      <NewsletterSection />
      <BlogCtaSection />
    </>
  );
}
