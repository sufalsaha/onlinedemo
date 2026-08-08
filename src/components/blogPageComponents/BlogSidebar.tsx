import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { NewsletterForm } from "./NewsletterForm";
import type { BlogPost } from "./types";

interface BlogSidebarProps {
  search: string;
  categories: { category: string; count: number }[];
  tags: string[];
  recentPosts: BlogPost[];
  popularPosts: BlogPost[];
}

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#E3DBDB] rounded-xl bg-white shadow-sm p-5">
      <h3 className="text-[15px] font-bold text-black mb-4">{title}</h3>
      {children}
    </div>
  );
}

function MiniPost({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="flex items-center gap-3 group"
    >
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F0F0F0] shrink-0">
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-[#2D2D2D] leading-snug line-clamp-2 group-hover:text-[#00C085] transition-colors">
          {post.title}
        </p>
        <p className="text-[11px] text-[#5A5A5A] mt-1">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            : ""}
        </p>
      </div>
    </Link>
  );
}

export function BlogSidebar({
  search,
  categories,
  tags,
  recentPosts,
  popularPosts,
}: BlogSidebarProps) {
  const featuredTopics = categories.slice(0, 5);

  return (
    <aside className="flex flex-col gap-5">
      <SidebarCard title="Search">
        <form action="/blogs" method="GET" className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Search articles..."
            className="pl-9 h-10 rounded-[10px] border-[#E3DBDB]"
          />
        </form>
      </SidebarCard>

      <SidebarCard title="Categories">
        <ul className="flex flex-col gap-2.5">
          {categories.length === 0 && (
            <li className="text-xs text-[#5A5A5A]">No categories yet.</li>
          )}
          {categories.map((c) => (
            <li key={c.category}>
              <Link
                href={`/blogs?category=${encodeURIComponent(c.category)}`}
                className="flex items-center justify-between text-[13px] text-[#2D2D2D] hover:text-[#00C085] transition-colors"
              >
                <span>{c.category}</span>
                <span className="text-[#9CA3AF]">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </SidebarCard>

      <SidebarCard title="Recent Posts">
        <div className="flex flex-col gap-4">
          {recentPosts.map((post) => (
            <MiniPost key={post.id} post={post} />
          ))}
        </div>
      </SidebarCard>

      <SidebarCard title="Popular Posts">
        <div className="flex flex-col gap-4">
          {popularPosts.map((post) => (
            <div key={post.id} className="flex items-center justify-between gap-2">
              <MiniPost post={post} />
              <span className="flex items-center gap-1 text-[11px] text-[#9CA3AF] shrink-0">
                <Eye className="w-3 h-3" />
                {post.viewCount}
              </span>
            </div>
          ))}
        </div>
      </SidebarCard>

      {featuredTopics.length > 0 && (
        <SidebarCard title="Featured Topics">
          <div className="flex flex-wrap gap-2">
            {featuredTopics.map((c) => (
              <Link key={c.category} href={`/blogs?category=${encodeURIComponent(c.category)}`}>
                <Badge className="bg-[#dceddd] text-[#00552C] border-none hover:bg-[#c7e6c9] transition-colors">
                  {c.category}
                </Badge>
              </Link>
            ))}
          </div>
        </SidebarCard>
      )}

      {tags.length > 0 && (
        <SidebarCard title="Tags">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
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
        </SidebarCard>
      )}

      <div className="rounded-xl bg-[#00552C] p-5">
        <h3 className="text-[15px] font-bold text-white mb-1">Newsletter</h3>
        <p className="text-[12px] text-[#D7E6D7] mb-4">
          Get the latest articles delivered to your inbox.
        </p>
        <NewsletterForm variant="full" />
      </div>

      <SidebarCard title="Follow Us">
        <div className="flex gap-3">
          <a
            href="#"
            aria-label="Facebook"
            className="w-9 h-9 rounded-full border border-[#E3DBDB] flex items-center justify-center text-[#2D2D2D] hover:bg-[#00C085] hover:text-white hover:border-[#00C085] transition-colors"
          >
            <FaFacebookF size={14} />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="w-9 h-9 rounded-full border border-[#E3DBDB] flex items-center justify-center text-[#2D2D2D] hover:bg-[#00C085] hover:text-white hover:border-[#00C085] transition-colors"
          >
            <FaTwitter size={14} />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="w-9 h-9 rounded-full border border-[#E3DBDB] flex items-center justify-center text-[#2D2D2D] hover:bg-[#00C085] hover:text-white hover:border-[#00C085] transition-colors"
          >
            <FaInstagram size={14} />
          </a>
          <a
            href="#"
            aria-label="YouTube"
            className="w-9 h-9 rounded-full border border-[#E3DBDB] flex items-center justify-center text-[#2D2D2D] hover:bg-[#00C085] hover:text-white hover:border-[#00C085] transition-colors"
          >
            <FaYoutube size={14} />
          </a>
        </div>
      </SidebarCard>
    </aside>
  );
}
