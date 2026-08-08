import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, Eye, User, Calendar } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

interface ViewBlogPageProps {
  params: Promise<{ id: string }>;
}

const statusBadgeClass: Record<string, string> = {
  draft:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  published:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
};

export default async function ViewBlogPage({ params }: ViewBlogPageProps) {
  const { id } = await params;

  const blog = await prisma.blog.findUnique({ where: { id } });

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-[700px] mb-6 flex items-center justify-start">
        <Link
          href="/dashboard/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Blog Posts
        </Link>
      </div>

      <Card className="w-full max-w-[700px] shadow-md border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
        <CardHeader className="space-y-4 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={blog.authorAvatar ?? undefined}
                    alt={blog.authorName}
                  />
                  <AvatarFallback>
                    <User className="w-4 h-4 text-slate-400" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {blog.category}
                </p>
                <h1 className="text-lg font-bold text-foreground leading-tight">
                  {blog.title}
                </h1>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`self-start sm:self-center ${statusBadgeClass[blog.status]}`}
            >
              {blog.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-6">
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto rounded-xl border border-slate-100 dark:border-slate-800"
            />
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
            <div className="flex items-center gap-2.5 min-w-0">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <p className="text-[11px] font-medium text-muted-foreground uppercase">
                  Author
                </p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {blog.authorName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 min-w-0">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <p className="text-[11px] font-medium text-muted-foreground uppercase">
                  Reading Time
                </p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {blog.readingTime} min
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 min-w-0">
              <Eye className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <p className="text-[11px] font-medium text-muted-foreground uppercase">
                  Views
                </p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {blog.viewCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 min-w-0">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <p className="text-[11px] font-medium text-muted-foreground uppercase">
                  Published
                </p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString()
                    : "Not yet"}
                </p>
              </div>
            </div>
          </div>

          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Excerpt
            </p>
            <p className="text-sm text-foreground leading-relaxed italic">
              {blog.excerpt}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Content
            </p>
            <div className="bg-slate-50/50 dark:bg-slate-900/30 border-l-4 border-primary p-4 rounded-r-xl">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
