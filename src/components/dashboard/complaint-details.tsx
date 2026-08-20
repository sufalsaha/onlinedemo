"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Building2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { ComplaintUserInfo } from "./complaint-user-info";
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
import { updateComplaint, deleteComplaint } from "@/actions/complaint-action";

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

interface ComplaintDetailsProps {
  complaint: any;
}

export function ComplaintDetails({ complaint }: ComplaintDetailsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(complaint.status);
  const [priority, setPriority] = useState(complaint.priority);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    setActionMessage(null);

    const result = await updateComplaint(complaint.id, { status: newStatus as any });

    if ("error" in result) {
      setActionMessage({ type: "error", text: result.error });
    } else {
      setStatus(newStatus);
      setActionMessage({ type: "success", text: "Status updated successfully" });
    }

    setIsUpdating(false);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handlePriorityChange = async (newPriority: string) => {
    setIsUpdating(true);
    setActionMessage(null);

    const result = await updateComplaint(complaint.id, { priority: newPriority as any });

    if ("error" in result) {
      setActionMessage({ type: "error", text: result.error });
    } else {
      setPriority(newPriority);
      setActionMessage({ type: "success", text: "Priority updated successfully" });
    }

    setIsUpdating(false);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleDelete = async () => {
    const result = await deleteComplaint(complaint.id);

    if ("error" in result) {
      setActionMessage({ type: "error", text: result.error });
      setDeleteDialog(false);
    } else {
      router.push("/dashboard/complaint");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Complaints
        </Button>

        {actionMessage && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
            actionMessage.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}>
            {actionMessage.type === "success" ? "✓" : "✕"} {actionMessage.text}
          </div>
        )}
      </div>

      {/* User Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ComplaintUserInfo
            user={complaint.user}
            fallbackInfo={{
              fullName: complaint.fullName,
              email: complaint.email,
              mobile: complaint.mobile
            }}
          />
        </CardContent>
      </Card>

      {/* Complaint Details Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{complaint.subject}</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={STATUS_COLORS[status as keyof typeof STATUS_COLORS]}>
                  {status.replace("_", " ")}
                </Badge>
                <Badge className={PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS]}>
                  {priority}
                </Badge>
                {complaint.business && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {complaint.business.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Message */}
          <div>
            <h3 className="font-semibold mb-3">Complaint Message</h3>
            <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed">
              {complaint.message}
            </div>
          </div>

          {/* Screenshot */}
          {complaint.screenshot && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Screenshot
              </h3>
              <div className="rounded-lg overflow-hidden border">
                <a
                  href={complaint.screenshot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-90 transition-opacity"
                >
                  <img
                    src={complaint.screenshot}
                    alt="Complaint screenshot"
                    className="w-full h-auto max-h-96 object-contain bg-muted"
                  />
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Click image to view full size in new tab
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Submitted</p>
                <p className="text-muted-foreground">
                  {format(new Date(complaint.createdAt), "PPP")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-muted-foreground">
                  {format(new Date(complaint.updatedAt), "PPP")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(complaint.updatedAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Change Status</label>
                <Select
                  value={status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Change Priority</label>
                <Select
                  value={priority}
                  onValueChange={handlePriorityChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
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
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                onClick={() => setDeleteDialog(true)}
                disabled={isUpdating}
                className="w-full md:w-auto"
              >
                Delete Complaint
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this complaint? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}