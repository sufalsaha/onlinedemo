"use client";

import { useState, useTransition, type MouseEvent } from "react";
import { Pencil, Star, Trash2, Building2 } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import { deleteBusiness } from "@/actions/business-action";
import type { PlatformNameValue } from "@/lib/schemas/business";
import { EmptyState } from "@/components/dashboard/emptyState";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface BusinessRow {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category: { name: string };
  logo: string | null;
  about: string;
  rating: number;
  reviewCount: number;
  productTag: string[];
  platforms: { name: PlatformNameValue; url: string }[];
}

interface BusinessTableProps {
  businesses?: BusinessRow[];
}

export default function BusinessTable({
  businesses = [],
}: BusinessTableProps) {
  const [deleting, setDeleting] = useState<BusinessRow | null>(null);
  const [deleteError, setDeleteError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  function handleDelete(event: MouseEvent) {
    event.preventDefault();
    if (!deleting) return;

    setDeleteError(undefined);
    startTransition(async () => {
      const result = await deleteBusiness(deleting.id);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setDeleting(null);
    });
  }

  return (
    <>
      {businesses.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No businesses yet"
          description="Add your first business listing to the directory."
          action={{ label: "Add Business", href: "/dashboard/business/add" }}
        />
      ) : (
        <div className="m-5">
          <div className="flex justify-end mb-5">
            <Button asChild>
              <Link href={"/dashboard/business/add"}>Add Business</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {businesses.map((business) => (
              <Card
                key={business.id}
                className="shadow-sm border-slate-200 dark:border-slate-800 flex flex-col"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    {/* Logo */}
                    <Avatar className="h-10 w-10 rounded-md shrink-0">
                      <AvatarImage src={business.logo ?? undefined} alt={business.name} />
                      <AvatarFallback className="rounded-md">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </AvatarFallback>
                    </Avatar>

                    <Link
                      href={`/dashboard/business/${business.id}`}
                      className="min-w-0 flex-1"
                    >
                      <CardTitle className="text-sm font-semibold leading-tight line-clamp-2">
                        {business.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="mt-1 text-xs font-normal"
                      >
                        {business.category.name}
                      </Badge>
                    </Link>
                  </div>
                </CardHeader>

                <CardContent className="pb-3 space-y-3">
                  {/* About */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {business.about}
                  </p>

                  {/* Rating + Review Count */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-sm font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {business.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {business.reviewCount.toLocaleString()} reviews
                    </span>
                  </div>

                  {/* Product Tags */}
                  {business.productTag.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {business.productTag.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {business.productTag.length > 3 && (
                        <span className="inline-block text-xs text-muted-foreground px-1 py-0.5">
                          +{business.productTag.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Platforms */}
                  {business.platforms.length > 0 && (
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
                  )}
                </CardContent>

                <CardFooter className="p-2 mt-auto flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                    asChild
                  >
                    <Link href={`/dashboard/business/${business.id}/edit`}>
                      <Pencil className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-destructive hover:text-destructive"
                    onClick={() => setDeleting(business)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Business</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleting?.name}&rdquo;?
              All of its reviews will be deleted as well. This cannot be undone.
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
