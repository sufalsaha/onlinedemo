import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Star, Building2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { prisma } from "@/lib/prisma";

interface ViewBusinessPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewBusinessPage({ params }: ViewBusinessPageProps) {
  const { id } = await params;

  const business = await prisma.business.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      reviews: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!business) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-[600px] mb-6 flex items-center justify-start">
        <Link
          href="/dashboard/business"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Businesses
        </Link>
      </div>

      <Card className="w-full max-w-[600px] shadow-md border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
        <CardHeader className="space-y-4 pt-6">
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="w-12 h-12 rounded-md">
                <AvatarImage src={business.logo ?? undefined} alt={business.name} />
                <AvatarFallback className="rounded-md">
                  <Building2 className="w-5 h-5 text-slate-400" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <CardTitle className="text-lg font-bold text-foreground leading-tight truncate">
                  {business.name}
                </CardTitle>
                <Badge variant="secondary" className="mt-1 text-xs font-normal">
                  {business.category.name}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-full text-amber-600 dark:text-amber-400 font-bold text-sm border border-amber-200/40">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {business.rating.toFixed(1)} / 5.0
              </div>
              <span className="text-xs text-muted-foreground">
                {business.reviewCount.toLocaleString()} reviews
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              About
            </p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {business.about}
            </p>
          </div>

          {business.productTag.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Product Tags
              </p>
              <div className="flex flex-wrap gap-1">
                {business.productTag.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {business.platforms.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Platforms
              </p>
              <div className="flex flex-wrap gap-1">
                {business.platforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded hover:text-foreground transition-colors"
                  >
                    {platform.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recent Reviews
            </p>
            {business.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No reviews yet.
              </p>
            ) : (
              <div className="space-y-2">
                {business.reviews.map((review) => (
                  <Link
                    key={review.id}
                    href={`/dashboard/review/${review.id}`}
                    className="block bg-slate-50/50 dark:bg-slate-900/30 border-l-4 border-primary p-3 rounded-r-xl hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {review.reviewerName}
                      </span>
                      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1">
                      {review.message}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
