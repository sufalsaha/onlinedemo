// src/app/dashboard/(dashboard)/review/[id]/view/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Star, MapPin, Calendar, Building2, User, Mail } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

const statusBadgeClass: Record<string, string> = {
  pending:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  approved:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  rejected:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
};

interface ViewReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewReviewPage({ params }: ViewReviewPageProps) {
  const { id } = await params;

  // ডাটাবেজ থেকে রিভিউর সব ডিটেইলস এবং বিজনেসের নাম নিয়ে আসা
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      business: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!review) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 p-4 md:p-8 flex flex-col items-center">
      {/* টপ বার: ব্যাক বাটন */}
      <div className="w-full max-w-[600px] mb-6 flex items-center justify-start">
        <Link
          href="/dashboard/review"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Reviews
        </Link>
      </div>

      {/* মেইন ভিউ কার্ড */}
      <Card className="w-full max-w-[600px] shadow-md border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
        
    

        <CardHeader className="space-y-4 pt-6">
          {/* বিজনেসের নাম ও রেটিং */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={review.image ?? undefined}
                    alt={review.reviewerName}
                  />
                  <AvatarFallback>
                    <User className="w-4 h-4 text-slate-400" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business</p>
                <h1 className="text-lg font-bold text-foreground leading-tight">{review.business?.name}</h1>
              </div>
            </div>
            
            {/* রেটিং ব্যাজ */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <Badge
                variant="outline"
                className={statusBadgeClass[review.status]}
              >
                {review.status}
              </Badge>
              <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-full text-amber-600 dark:text-amber-400 font-bold text-sm border border-amber-200/40">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {review.rating.toFixed(1)} / 5.0
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-6">
          {/* কাস্টমার ইনফো গ্রিড */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
            <div className="flex items-center gap-2.5 min-w-0">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Reviewer</p>
                <p className="text-sm font-semibold text-foreground truncate">{review.reviewerName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 min-w-0">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Email</p>
                <p className="text-sm font-semibold text-foreground truncate">{review.email || "Not Specified"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 min-w-0">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Location</p>
                <p className="text-sm font-semibold text-foreground truncate">{review.authorLocation || "Not Specified"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 min-w-0">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Submitted</p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* রিভিউ মেসেজ বডি */}
          <div className="space-y-2">
            {review.title && (
              <p className="text-sm font-semibold text-foreground">{review.title}</p>
            )}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Review Message</p>
            <div className="bg-slate-50/50 dark:bg-slate-900/30 border-l-4 border-primary p-4 rounded-r-xl">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                "{review.message}"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}