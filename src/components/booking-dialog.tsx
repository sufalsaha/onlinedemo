"use client";

import { useState } from "react";
import { CheckCircle2, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateContactInquiryAppointment } from "@/actions/contact-action";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactInquiryId: string | null;
  onDone: () => void;
}

export function BookingDialog({
  open,
  onOpenChange,
  contactInquiryId,
  onDone,
}: BookingDialogProps) {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  function resetLocalState() {
    setAppointmentDate("");
    setAppointmentTime("");
    setError(undefined);
    setIsSubmitting(false);
    setIsSaved(false);
  }

  function handleSkip() {
    resetLocalState();
    onOpenChange(false);
    onDone();
  }

  async function handleSave() {
    if (!contactInquiryId) {
      setError("Something went wrong. Please try again.");
      return;
    }
    if (!appointmentDate || !appointmentTime) {
      setError("Please enter both a date and a time, or skip this step.");
      return;
    }

    setError(undefined);
    setIsSubmitting(true);
    try {
      const result = await updateContactInquiryAppointment(contactInquiryId, {
        appointmentDate,
        appointmentTime,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setIsSaved(true);
      setTimeout(() => {
        resetLocalState();
        onOpenChange(false);
        onDone();
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetLocalState();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        {isSaved ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            <DialogTitle>Thanks!</DialogTitle>
            <DialogDescription>
              We&apos;ve saved your appointment details.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Let us know what you booked</DialogTitle>
              <DialogDescription>
                If you completed a booking in the Google Calendar window, tell
                us the date and time (optional).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-slate-400 text-xs font-medium">
                  Appointment Date
                </label>
                <Input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 text-xs font-medium">
                  Appointment Time
                </label>
                <Input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                />
              </div>

              {error && (
                <div className="text-sm font-medium p-3 bg-destructive/10 text-destructive rounded-md">
                  {error}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleSkip}>
                Skip
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-[#00c885] hover:bg-[#00b577] text-white"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
