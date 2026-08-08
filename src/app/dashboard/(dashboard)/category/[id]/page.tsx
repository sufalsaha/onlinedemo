import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Tag, Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

interface ViewCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewCategoryPage({ params }: ViewCategoryPageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      businesses: { select: { id: true, name: true, rating: true } },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-[600px] mb-6 flex items-center justify-start">
        <Link
          href="/dashboard/category"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Categories
        </Link>
      </div>

      <Card className="w-full max-w-[600px] shadow-md border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
        <CardHeader className="space-y-4 pt-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground leading-tight">
                {category.name}
              </CardTitle>
              <p className="font-mono text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-md mt-1 inline-block">
                /{category.slug}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-6">
          <p className="text-sm font-semibold text-foreground">
            {category.businesses.length} business
            {category.businesses.length === 1 ? "" : "es"} in this category
          </p>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Businesses
            </p>
            {category.businesses.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No businesses use this category yet — it can be safely deleted.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {category.businesses.map((business) => (
                  <Link
                    key={business.id}
                    href={`/dashboard/business/${business.id}`}
                    className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-xl px-3 py-2.5 hover:border-primary/40 transition-colors min-w-0"
                  >
                    <span className="text-sm font-medium text-foreground truncate">
                      {business.name}
                    </span>
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {business.rating.toFixed(1)}
                    </span>
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
