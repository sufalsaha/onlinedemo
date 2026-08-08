"use client";

import { useRef, useState, useTransition, type MouseEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Pencil,
  Star,
  Trash2,
  MapPin,
  UserRound,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  approveReview,
  rejectReview,
  softDeleteReview,
} from "@/actions/review-action";
import { EmptyState } from "@/components/dashboard/emptyState";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type ReviewStatus = "pending" | "approved" | "rejected";

interface ReviewRow {
  id: string;
  businessId: string;
  image: string | null;
  business: { name: string };
  reviewerName: string;
  authorLocation: string | null;
  email: string;
  title: string | null;
  rating: number;
  message: string;
  status: ReviewStatus;
}

interface ReviewTableProps {
  reviews?: ReviewRow[];
  businesses?: { id: string; name: string }[];
  total?: number;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ReviewStatus | "all";
}

const statusBadgeClass: Record<ReviewStatus, string> = {
  pending:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  approved:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  rejected:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
};

export default function ReviewTable({
  reviews = [],
  total = 0,
  page = 1,
  pageSize = 12,
  search = "",
  status = "all",
}: ReviewTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [deleting, setDeleting] = useState<ReviewRow | null>(null);
  const [deleteError, setDeleteError] = useState<string | undefined>();
  const [actionError, setActionError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  function pushQuery(next: { q?: string; status?: string; page?: number }) {
    const query = new URLSearchParams();
    const q = next.q ?? searchInput;
    const st = next.status ?? status;
    const pg = next.page ?? 1;
    if (q) query.set("q", q);
    if (st && st !== "all") query.set("status", st);
    if (pg > 1) query.set("page", String(pg));
    router.push(`${pathname}?${query.toString()}`);
  }

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushQuery({ q: value, page: 1 });
    }, 400);
  }

  function handleDelete(event: MouseEvent) {
    event.preventDefault();
    if (!deleting) return;

    setDeleteError(undefined);
    startTransition(async () => {
      const result = await softDeleteReview(deleting.id);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setDeleting(null);
    });
  }

  function handleApprove(id: string) {
    setActionError(undefined);
    setPendingActionId(id);
    startTransition(async () => {
      const result = await approveReview(id);
      if (result.error) setActionError(result.error);
      setPendingActionId(null);
    });
  }

  function handleReject(id: string) {
    setActionError(undefined);
    setPendingActionId(id);
    startTransition(async () => {
      const result = await rejectReview(id);
      if (result.error) setActionError(result.error);
      setPendingActionId(null);
    });
  }

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  return (
    <>
      <div className="m-5 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, title, message..."
            className="pl-8"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => pushQuery({ status: value, page: 1 })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button asChild className="sm:ml-auto">
          <Link href={"/dashboard/review/add"}>Add Review</Link>
        </Button>
      </div>

      {actionError && (
        <div className="mx-5 text-sm font-medium p-3 bg-destructive/10 text-destructive rounded-md">
          {actionError}
        </div>
      )}

      {reviews.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="No reviews found"
          description="Try adjusting your search or filters."
          action={{ label: "Add Review", href: "/dashboard/review/add" }}
        />
      ) : (
        <div className="mx-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <Card
                key={review.id}
                className="shadow-sm border-slate-200 dark:border-slate-800 flex flex-col"
              >
                <CardHeader className="pb-2 flex flex-row items-start gap-3">
                  <Avatar className="h-10 w-10 mt-0.5">
                    <AvatarImage
                      src={review.image ?? undefined}
                      alt={review.reviewerName}
                    />
                    <AvatarFallback>
                      <UserRound className="w-4 h-4 text-slate-400" />
                    </AvatarFallback>
                  </Avatar>

                  <Link
                    href={`/dashboard/review/${review.id}`}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                        {review.business.name}
                      </p>

                      <div className="flex items-start justify-between gap-2 pt-0.5">
                        <CardTitle className="text-sm font-semibold leading-tight truncate">
                          {review.reviewerName}
                        </CardTitle>
                        <span className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </CardHeader>

                <CardContent className="pb-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={statusBadgeClass[review.status]}
                    >
                      {review.status}
                    </Badge>
                    {review.authorLocation && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {review.authorLocation}
                        </span>
                      </div>
                    )}
                  </div>

                  {review.title && (
                    <p className="text-xs font-semibold text-foreground truncate">
                      {review.title}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 border-l-2 border-slate-200 dark:border-slate-700 pl-2">
                    {review.message}
                  </p>
                </CardContent>

                <CardFooter className="p-2 mt-auto flex flex-wrap justify-end gap-1">
                  {review.status !== "approved" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-emerald-600 hover:text-emerald-700"
                      disabled={isPending && pendingActionId === review.id}
                      onClick={() => handleApprove(review.id)}
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Approve
                    </Button>
                  )}
                  {review.status !== "rejected" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-amber-600 hover:text-amber-700"
                      disabled={isPending && pendingActionId === review.id}
                      onClick={() => handleReject(review.id)}
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Reject
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                    asChild
                  >
                    <Link href={`/dashboard/review/${review.id}/edit`}>
                      <Pencil className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-destructive hover:text-destructive"
                    onClick={() => setDeleting(review)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => pushQuery({ page: page - 1 })}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Prev
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => pushQuery({ page: page + 1 })}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review from &ldquo;
              {deleting?.reviewerName}&rdquo;? It will be hidden from the site
              but kept for records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <div className="text-sm font-medium p-3 bg-destructive/10 text-destructive rounded-md">
              {deleteError}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
