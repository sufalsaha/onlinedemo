"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, AlertCircle, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./emptyState";

import { getComplaints, deleteComplaint, updateComplaint } from "@/actions/complaint-action";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-purple-100 text-purple-800",
  urgent: "bg-red-100 text-red-800",
};

export function ComplaintTable({
  searchParams,
}: {
  searchParams: { page?: string; q?: string; status?: string; priority?: string };
}) {
  const router = useRouter();
  const searchParamsObj = useSearchParams();
  const pathname = "/dashboard/complaint";

  const [data, setData] = useState<{
    data: any[];
    total: number;
    page: number;
    pageSize: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(searchParams.q || "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string }>({
    open: false,
    id: "",
  });

  // Fetch complaints
  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getComplaints({
        page: parseInt(searchParams.page || "1"),
        search: searchParams.q,
        status: searchParams.status,
        priority: searchParams.priority,
      });
      setData(result);
    } catch (err) {
      setError("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushQuery({ q: searchInput || undefined, page: 1 });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  function pushQuery(next: { q?: string; status?: string; priority?: string; page?: number }) {
    const query = new URLSearchParams();
    if (next.q) query.set("q", next.q);
    if (next.status && next.status !== "all") query.set("status", next.status);
    if (next.priority && next.priority !== "all") query.set("priority", next.priority);
    if (next.page && next.page > 1) query.set("page", next.page.toString());
    router.push(`${pathname}?${query.toString()}`);
  }

  async function handleStatusChange(complaintId: string, status: string) {
    const result = await updateComplaint(complaintId, { status: status as any });
    if (!("error" in result)) {
      fetchComplaints();
    }
  }

  async function handlePriorityChange(complaintId: string, priority: string) {
    const result = await updateComplaint(complaintId, { priority: priority as any });
    if (!("error" in result)) {
      fetchComplaints();
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteComplaint(id);
    if (!("error" in result)) {
      setDeleteDialog({ open: false, id: "" });
      fetchComplaints();
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchComplaints} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="No complaints found"
        description={searchParams.q || searchParams.status || searchParams.priority
          ? "Try adjusting your filters"
          : "No complaints have been submitted yet"}
        actionLabel="Clear Filters"
        onAction={() => pushQuery({})}
      />
    );
  }

  const totalPages = Math.ceil(data.total / data.pageSize);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search complaints..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={searchParams.status || "all"}
          onValueChange={(value) => pushQuery({ status: value, page: 1 })}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={searchParams.priority || "all"}
          onValueChange={(value) => pushQuery({ priority: value, page: 1 })}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="All Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Complaint Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.data.map((complaint) => (
          <Card
            key={complaint.id}
            className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow group"
            onClick={() => router.push(`/dashboard/complaint/${complaint.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-10 h-10">
                      {complaint.user?.image ? (
                        <AvatarImage src={complaint.user.image} alt={complaint.fullName} />
                      ) : null}
                      <AvatarFallback>
                        <UserCircle className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{complaint.subject}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {complaint.user?.fullName || complaint.fullName}
                      </p>
                    </div>
                  </div>
                  {(complaint.user?.email || complaint.email) && (
                    <p className="text-xs text-muted-foreground">{complaint.user?.email || complaint.email}</p>
                  )}
                  {complaint.mobile && (
                    <p className="text-xs text-muted-foreground">{complaint.mobile}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1 ml-2">
                  <Badge className={STATUS_COLORS[complaint.status as keyof typeof STATUS_COLORS]}>
                    {complaint.status.replace("_", " ")}
                  </Badge>
                  <Badge className={PRIORITY_COLORS[complaint.priority as keyof typeof PRIORITY_COLORS]}>
                    {complaint.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm line-clamp-3 text-muted-foreground">{complaint.message}</p>
              {complaint.business && (
                <p className="text-xs text-muted-foreground mt-2">
                  Business: {complaint.business.name}
                </p>
              )}
              {complaint.screenshot && (
                <div className="mt-3">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(complaint.screenshot, '_blank');
                    }}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    <span>📷</span> View Screenshot
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-2">
                  <Select
                    value={complaint.status}
                    onValueChange={(value) => {
                      handleStatusChange(complaint.id, value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={complaint.priority}
                    onValueChange={(value) => {
                      handlePriorityChange(complaint.id, value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialog({ open: true, id: complaint.id });
                  }}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((data.page - 1) * data.pageSize) + 1} to {Math.min(data.page * data.pageSize, data.total)} of {data.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.page === 1}
              onClick={() => pushQuery({ page: data.page - 1 })}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.page === totalPages}
              onClick={() => pushQuery({ page: data.page + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: deleteDialog.id })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this complaint? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(deleteDialog.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
