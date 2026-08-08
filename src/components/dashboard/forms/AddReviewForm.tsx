"use client";

import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCw, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
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
  CardDescription,
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

import { createReview, updateReview } from "@/actions/review-action";
import { reviewFormSchema, type ReviewFormValues } from "@/lib/schemas/review";
import { ImageSeletor, ImageSeletorRef } from "@/components/imagefrom/image-seletor";

interface ExistingReview {
  id: string;
  businessId: string;
  reviewerName: string;
  authorLocation: string | null;
  email: string;
  title: string | null;
  status: "pending" | "approved" | "rejected";
  rating: number;
  message: string;
}

interface AddReviewFormProps {
  businesses: { id: string; name: string }[];
  review?: ExistingReview;
  onSuccess?: () => void;
  asDialog?: boolean;
}

export default function AddReviewForm({
  businesses,
  review,
  onSuccess,
  asDialog = false,
}: AddReviewFormProps) {
  const isEditMode = !!review;
const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [reviewedBusinessId, setReviewedBusinessId] = useState("");
    const imagesAddFormRef = useRef<ImageSeletorRef>(null);



  // console.log("businesses", businesses);
  

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      businessId: review?.businessId ?? "",
      reviewerName: review?.reviewerName ?? "",
      authorLocation: review?.authorLocation ?? "",
      email: review?.email ?? "",
      title: review?.title ?? "",
      status: review?.status,
      rating: review?.rating ?? 0,
      message: review?.message ?? "",
    },
  });

  async function onSubmit(values: ReviewFormValues) {
    setError(undefined);

      const image = imagesAddFormRef.current?.selectedImages[0]!;

    try {
      const result = isEditMode
        ? await updateReview(review.id, values, image)
        : await createReview(values,image);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (isEditMode) {
        router.push(`/dashboard/review/${review.id}`);
        router.refresh(); // ডেটা রিফ্রেশ করার জন্য
        onSuccess?.();
        return;
      }

      reset();
      setReviewedBusinessId(values.businessId);
      setSuccessAlertOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  }

  // Shared form fields — used by both Card and Dialog render paths
  const formFields = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Field>
        <FieldLabel>Business</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="businessId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger aria-invalid={!!errors.businessId}>
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FieldContent>
        {errors.businessId && (
          <FieldError>{errors.businessId.message}</FieldError>
        )}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Reviewer Name</FieldLabel>
          <FieldContent>
            <Input
              placeholder="e.g., Rahim Uddin"
              aria-invalid={!!errors.reviewerName}
              {...register("reviewerName")}
            />
          </FieldContent>
          {errors.reviewerName && (
            <FieldError>{errors.reviewerName.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Location</FieldLabel>
          <FieldContent>
            <Input
              placeholder="e.g., Khulna"
              aria-invalid={!!errors.authorLocation}
              {...register("authorLocation")}
            />
          </FieldContent>
          {errors.authorLocation && (
            <FieldError>{errors.authorLocation.message}</FieldError>
          )}
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldContent>
            <Input
              type="email"
              placeholder="reviewer@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </FieldContent>
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Review Title</FieldLabel>
          <FieldContent>
            <Input
              placeholder="e.g., Great service"
              aria-invalid={!!errors.title}
              {...register("title")}
            />
          </FieldContent>
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </Field>
      </div>

      {isEditMode && (
        <Field>
          <FieldLabel>Status</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger aria-invalid={!!errors.status}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FieldContent>
          {errors.status && <FieldError>{errors.status.message}</FieldError>}
        </Field>
      )}


  <ImageSeletor
          ref={imagesAddFormRef}
          multiselects={true}
          label={"Logo Image"}
        />
      



      <Field>
        <FieldLabel className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-slate-400" /> Rating (0–5)
        </FieldLabel>
        <FieldContent>
          <Input
            type="number"
            min="0"
            max="5"
            step="0.1"
            aria-invalid={!!errors.rating}
            {...register("rating", { valueAsNumber: true })}
          />
        </FieldContent>
        {errors.rating && <FieldError>{errors.rating.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel>Review Message</FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="Share details of your experience..."
            className="min-h-[100px] resize-y leading-relaxed"
            aria-invalid={!!errors.message}
            {...register("message")}
          />
        </FieldContent>
        {errors.message && <FieldError>{errors.message.message}</FieldError>}
      </Field>

      {error && (
        <div className="text-sm font-medium p-3 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <RotateCw className="w-4 h-4 mr-2 animate-spin" />
            {isEditMode ? "Saving Changes..." : "Submitting Review..."}
          </>
        ) : isEditMode ? (
          "Save Changes"
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );

  // Dialog render path — no Card, no AlertDialog (edit-only, closes via onSuccess)
  if (asDialog) {
    return formFields;
  }

  // Standalone page render path — wrapped in Card, with success AlertDialog
  return (
    <>
      <Card className="max-w-[500px] w-full m-5 shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {isEditMode ? "Edit Review" : "Add Review"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update this customer review"
              : "Submit a customer review for a listed business"}
          </CardDescription>
        </CardHeader>
        <CardContent>{formFields}</CardContent>
      </Card>

      <AlertDialog open={successAlertOpen} onOpenChange={setSuccessAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              You have successfully added a new Review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href={`/dashboard/business/${reviewedBusinessId}`}>
                View Business
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}