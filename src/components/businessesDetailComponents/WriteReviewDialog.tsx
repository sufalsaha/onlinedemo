"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, RotateCw, Star } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";

import { createPublicReview } from "@/actions/review-action";
import {
  publicReviewSchema,
  type PublicReviewFormValues,
} from "@/lib/schemas/review";

interface WriteReviewDialogProps {
  businessId: string;
  businessName: string;
}

export function WriteReviewDialog({
  businessId,
  businessName,
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
      fullName: "",
      email: "",
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
        {submitted ? (
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

                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="Your name"
                      aria-invalid={!!errors.fullName}
                      {...register("fullName")}
                    />
                  </FieldContent>
                  {errors.fullName && (
                    <FieldError>{errors.fullName.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <FieldContent>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      {...register("email")}
                    />
                  </FieldContent>
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </Field>

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
