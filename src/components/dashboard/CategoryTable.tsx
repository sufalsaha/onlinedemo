



























"use client";

import { useState, useTransition, type MouseEvent } from "react";
import { Pencil, Trash2, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
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


import { deleteCategory } from "@/actions/category-action";

import { EmptyState } from "./emptyState";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryTableProps {
  categories?: Category[];
}

export default function CategoryTable({
  categories = [],
}: CategoryTableProps) {
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  function handleDelete(event: MouseEvent) {
    event.preventDefault();
    if (!deleting) return;

    setDeleteError(undefined);
    startTransition(async () => {
      const result = await deleteCategory(deleting.id);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setDeleting(null);
    });
  }

  return (
    <>
      {categories.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No categories yet"
          description="Create your first category to start organising businesses."
          action={{ label: "Add Category", href: "/dashboard/category/add" }}
        />
      ) : (
        <div className="m-5">
           <div className="flex justify-end mb-5">
        <Button asChild>
          <Link href={"/dashboard/category/add"}>Add Category</Link>
        </Button>
      </div>
          <div className="grid grid-cols-1 mt-6 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="shadow-sm border-slate-200 dark:border-slate-800 flex flex-col"
            >
              <CardHeader className="pb-2">
                <Link
                  href={`/dashboard/category/${category.id}`}
                  className="flex items-start justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800">
                      <Tag className="w-4 h-4 text-slate-500" />
                    </div>
                    <CardTitle className="text-base font-semibold leading-tight truncate">
                      {category.name}
                    </CardTitle>
                  </div>
                </Link>
              </CardHeader>

              <CardContent className="pb-3">
                <p className="font-mono text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-md truncate">
                  /{category.slug}
                </p>
              </CardContent>

              <CardFooter className="pt-0 mt-auto flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <Link href={`/dashboard/category/${category.id}/edit`}>
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-destructive hover:text-destructive"
                  onClick={() => setDeleting(category)}
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
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleting?.name}&rdquo;?
              This cannot be undone.
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












