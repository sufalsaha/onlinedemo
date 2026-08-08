"use client";

import { useRef, useState, useTransition, type MouseEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
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

import { deleteBlog, setBlogStatus } from "@/actions/blog-action";
import { EmptyState } from "@/components/dashboard/emptyState";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type BlogStatus = "draft" | "published";

interface BlogRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  authorName: string;
  status: BlogStatus;
  viewCount: number;
}

interface BlogTableProps {
  blogs?: BlogRow[];
  total?: number;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: BlogStatus | "all";
}

const statusBadgeClass: Record<BlogStatus, string> = {
  draft:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  published:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
};

export default function BlogTable({
  blogs = [],
  total = 0,
  page = 1,
  pageSize = 12,
  search = "",
  status = "all",
}: BlogTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [deleting, setDeleting] = useState<BlogRow | null>(null);
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
      const result = await deleteBlog(deleting.id);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setDeleting(null);
    });
  }

  function handleToggleStatus(blog: BlogRow) {
    setActionError(undefined);
    setPendingActionId(blog.id);
    startTransition(async () => {
      const result = await setBlogStatus(
        blog.id,
        blog.status === "published" ? "draft" : "published"
      );
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
            placeholder="Search by title, excerpt, category..."
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
        <Button asChild className="sm:ml-auto">
          <Link href={"/dashboard/blog/add"}>Add Post</Link>
        </Button>
      </div>

      {actionError && (
        <div className="mx-5 text-sm font-medium p-3 bg-destructive/10 text-destructive rounded-md">
          {actionError}
        </div>
      )}

      {blogs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No blog posts found"
          description="Try adjusting your search or filters."
          action={{ label: "Add Post", href: "/dashboard/blog/add" }}
        />
      ) : (
        <div className="mx-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <Card
                key={blog.id}
                className="shadow-sm border-slate-200 dark:border-slate-800 flex flex-col"
              >
                <CardHeader className="pb-2 flex flex-row items-start gap-3">
                  <Avatar className="h-10 w-10 mt-0.5 rounded-md">
                    <AvatarImage
                      src={blog.coverImage ?? undefined}
                      alt={blog.title}
                    />
                    <AvatarFallback className="rounded-md">
                      <FileText className="w-4 h-4 text-slate-400" />
                    </AvatarFallback>
                  </Avatar>

                  <Link
                    href={`/dashboard/blog/${blog.id}`}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                      {blog.category}
                    </p>
                    <CardTitle className="text-sm font-semibold leading-tight line-clamp-2">
                      {blog.title}
                    </CardTitle>
                  </Link>
                </CardHeader>

                <CardContent className="pb-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={statusBadgeClass[blog.status]}
                    >
                      {blog.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {blog.viewCount} views
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 border-l-2 border-slate-200 dark:border-slate-700 pl-2">
                    {blog.excerpt}
                  </p>
                </CardContent>

                <CardFooter className="p-2 mt-auto flex flex-wrap justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                    disabled={isPending && pendingActionId === blog.id}
                    onClick={() => handleToggleStatus(blog)}
                  >
                    {blog.status === "published" ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 mr-1" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Publish
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                    asChild
                  >
                    <Link href={`/dashboard/blog/${blog.id}/edit`}>
                      <Pencil className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-destructive hover:text-destructive"
                    onClick={() => setDeleting(blog)}
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

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleting?.title}&rdquo;?
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
