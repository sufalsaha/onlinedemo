"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle2, MailWarning, RotateCw, Star, UserRound } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

import { createPublicReview } from "@/actions/review-action";
import {
  publicReviewSchema,
  type PublicReviewFormValues,
} from "@/lib/schemas/review";

interface WriteReviewDialogProps {
  businessId: string;
  businessName: string;
  /** null when signed out. Reviews are attributed from the session, not this prop. */
  reviewer: { fullName: string; verified: boolean; id: string } | null;
  /** User's existing review for this business, if any */
  existingReview?: {
    id: string;
    rating: number;
    title?: string | null;
    message: string;
    status: "pending" | "approved" | "rejected";
  } | null;
}

export function WriteReviewDialog({
  businessId,
  businessName,
  reviewer,
  existingReview,
}: WriteReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PublicReviewFormValues>({
    resolver: zodResolver(publicReviewSchema),
    defaultValues: {
      businessId,
      rating: 0,
      title: "",
      message: "",
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      window.setTimeout(() => {
        setStep(1);
        setRating(0);
        setSubmitted(false);
        setError(undefined);
        reset();
      }, 200);
    }
  }

  function selectRating(value: number) {
    setRating(value);
    setValue("rating", value, { shouldValidate: true });
  }

  async function onSubmit(values: PublicReviewFormValues) {
    setError(undefined);
    const result = await createPublicReview(values);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="bg-[#00C085] hover:bg-[#00a874] transition-colors rounded-full px-6 py-3.5 font-medium text-lg text-white inline-flex items-center gap-2">
          Write a Review
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-popover text-popover-foreground">
        {!reviewer ? (
          <GateMessage
            icon={<UserRound className="w-12 h-12 text-[#00C085]" />}
            title="Sign in to write a review"
            description={`Reviews on ${businessName} are tied to a verified account, so readers know they're genuine.`}
            actionHref="/user/login"
            actionLabel="Sign in"
            secondary={
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/user/register"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Register
                </Link>
              </p>
            }
          />
        ) : !reviewer.verified ? (
          <GateMessage
            icon={<MailWarning className="w-12 h-12 text-amber-500" />}
            title="Verify your email first"
            description="We only publish reviews from verified accounts. Confirm your email address and you can post right away."
            actionHref="/user/verify"
            actionLabel="Verify email"
          />
        ) : existingReview ? (
          <GateMessage
            icon={<CheckCircle2 className="w-12 h-12 text-blue-500" />}
            title="You've already reviewed this business"
            description={
              existingReview.status === "pending"
                ? "Your review is awaiting approval. You'll be notified once it's published."
                : existingReview.status === "approved"
                ? "You have already submitted a review for this business."
                : "Your review was not approved. If you have questions, please contact support."
            }
            actionLabel="Close"
            onClick={() => handleOpenChange(false)}
          />
        ) : submitted ? (
          <div className="flex flex-col items-center text-center gap-3 py-6">
            <CheckCircle2 className="w-12 h-12 text-[#00C085]" />
            <DialogTitle>Thank you!</DialogTitle>
            <DialogDescription>
              Your review of {businessName} has been submitted and is pending
              approval. It will appear on this page once reviewed.
            </DialogDescription>
            <Button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="mt-2 w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Rate &amp; Review {businessName}</DialogTitle>
              <DialogDescription>
                Share your experience to help others make better decisions.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-1.5" aria-hidden="true">
              <div
                className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-[#00C085]" : "bg-muted"}`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-[#00C085]" : "bg-muted"}`}
              />
            </div>

            {step === 1 ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <StarRatingInput value={rating} onChange={selectRating} />
                <p className="text-sm text-muted-foreground">
                  {rating > 0
                    ? `You selected ${rating} out of 5`
                    : "Tap a star to rate your experience"}
                </p>
                <DialogFooter className="w-full">
                  <Button
                    type="button"
                    disabled={rating === 0}
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto"
                  >
                    Next
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <StarRatingInput value={rating} readOnly size="sm" />
                    <span className="text-sm font-medium">{rating}/5</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-primary hover:underline"
                  >
                    Change rating
                  </button>
                </div>

                <p className="text-sm text-muted-foreground">
                  Posting as{" "}
                  <span className="font-medium text-foreground">
                    {reviewer.fullName}
                  </span>
                </p>

                <Field>
                  <FieldLabel>
                    Review Title{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="Summarize your experience"
                      aria-invalid={!!errors.title}
                      {...register("title")}
                    />
                  </FieldContent>
                  {errors.title && (
                    <FieldError>{errors.title.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Review Message</FieldLabel>
                  <FieldContent>
                    <Textarea
                      className="min-h-24 resize-y leading-relaxed"
                      placeholder="Tell us about your experience..."
                      aria-invalid={!!errors.message}
                      {...register("message")}
                    />
                  </FieldContent>
                  {errors.message && (
                    <FieldError>{errors.message.message}</FieldError>
                  )}
                </Field>

                {error && (
                  <div className="text-sm font-medium p-3 bg-destructive/10 text-destructive rounded-md">
                    {error}
                  </div>
                )}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function GateMessage({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
  secondary,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel: string;
  secondary?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-6">
      {icon}
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
      {actionHref ? (
        <Link
          href={actionHref}
          className={cn(buttonVariants({}), "mt-2 w-full sm:w-auto")}
        >
          {actionLabel}
        </Link>
      ) : (
        <Button
          type="button"
          onClick={onClick}
          className="mt-2 w-full sm:w-auto"
        >
          {actionLabel}
        </Button>
      )}
      {secondary}
    </div>
  );
}

function StarRatingInput({
  value,
  onChange,
  readOnly = false,
  size = "md",
}: {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
}) {
  const [hover, setHover] = useState(0);
  const starSize = size === "sm" ? "w-4 h-4" : "w-8 h-8";

  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            className={readOnly ? "cursor-default" : "cursor-pointer"}
            onMouseEnter={() => !readOnly && setHover(star)}
            onClick={() => !readOnly && onChange?.(star)}
          >
            <Star
              className={`${starSize} transition-colors ${
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-none text-muted-foreground"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
