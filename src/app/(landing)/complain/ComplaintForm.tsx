"use client";

import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RotateCw, Upload } from "lucide-react";
import { createComplaint } from "@/actions/complaint-action";
import { uploadFile } from "@/actions/image-action";

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
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Validation Schema using Zod
const complaintFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  pageName: z.string().min(1, "Please select a page"),
  date: z.string().min(1, "Date is required"),
  message: z.string().min(1, "Message is required"),
  screenshot: z.any().optional()
    .refine((file) => !file || file instanceof File, "Invalid file")
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, "File must be under 5MB")
    .refine((file) => !file || file.type.startsWith('image/'), "Must be an image"),
});

type ComplaintFormValues = z.infer<typeof complaintFormSchema>;

function todayFormatted() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${today.getFullYear()}`;
}

interface ComplaintFormProps {
  businesses: { id: string; name: string }[];
  onSuccess?: () => void;
}

export function ComplaintForm({ businesses, onSuccess }: ComplaintFormProps) {
  const [error, setError] = useState<string | undefined>();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
      fullName: "",
      mobile: "",
      pageName: "",
      date: todayFormatted(),
      message: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        setError("Screenshot file must be less than 5MB");
        return;
      }

      // Validate file type
      const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Only JPEG, PNG, WebP, and GIF images are allowed");
        return;
      }

      setSelectedFileName(file.name);
      setValue("screenshot", file);
      setError(undefined); // Clear any previous errors
    }
  };

  async function onSubmit(values: ComplaintFormValues) {
    setError(undefined);
    setSubmitting(true);

    try {
      // Upload screenshot if provided
      let screenshotUrl = "";
      const screenshotFile = values.screenshot;
      if (screenshotFile && screenshotFile instanceof File) {
        const formData = new FormData();
        formData.append("file", screenshotFile);

        const uploadResult = await uploadFile(formData);
        if (uploadResult?.uploadResult) {
          screenshotUrl = uploadResult.uploadResult;
        } else {
          setError("Failed to upload screenshot. Please try again.");
          return;
        }
      }

      const result = await createComplaint({
        ...values,
        screenshot: screenshotUrl,
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      reset();
      setSelectedFileName(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSuccessAlertOpen(true);
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Card className="max-w-[550px] w-full shadow-sm border-slate-200 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            অভিযোগ বাক্স
          </CardTitle>
          <CardDescription className="text-sm font-medium text-slate-700">
            আমাদের কাছে অভিযোগ করুন। আমরা বিষয়টি যাচাই করে সমাধানে সহযোগিতা করব।
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Full Name */}
            <Field>
              <FieldLabel className="text-slate-500 font-normal">
                Full Name
              </FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Full Name"
                  aria-invalid={!!errors.fullName}
                  {...register("fullName")}
                />
              </FieldContent>
              {errors.fullName && (
                <FieldError>{errors.fullName.message}</FieldError>
              )}
            </Field>

            {/* Mobile / WhatsApp */}
            <Field>
              <FieldLabel className="text-slate-500 font-normal">
                Mobile/WhatsApp
              </FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Mobile"
                  aria-invalid={!!errors.mobile}
                  {...register("mobile")}
                />
              </FieldContent>
              {errors.mobile && (
                <FieldError>{errors.mobile.message}</FieldError>
              )}
            </Field>

            {/* Business */}
            <Field>
              <FieldLabel className="text-slate-500 font-normal ">
                Page Name
              </FieldLabel>
              <FieldContent className="w-full">
                <Controller
                  control={control}
                  name="pageName"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger aria-invalid={!!errors.pageName} className="w-full">
                        <SelectValue placeholder="Page Name" />
                      </SelectTrigger>
                      <SelectContent>
                        {businesses.map((business) => (
                          <SelectItem key={business.id} value={business.id}>
                            {business.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FieldContent>
              {errors.pageName && (
                <FieldError>{errors.pageName.message}</FieldError>
              )}
            </Field>

            {/* Date */}
            <Field>
              <FieldLabel className="text-slate-500 font-normal">
                Date
              </FieldLabel>
              <FieldContent>
                <Input
                  placeholder="01/03/2026"
                  aria-invalid={!!errors.date}
                  {...register("date")}
                />
              </FieldContent>
              {errors.date && <FieldError>{errors.date.message}</FieldError>}
            </Field>

            {/* Message */}
            <Field>
              <FieldLabel className="text-slate-500 font-normal">
                Message
              </FieldLabel>
              <FieldContent>
                <Textarea
                  placeholder="Your Message"
                  className="min-h-[90px] resize-y"
                  aria-invalid={!!errors.message}
                  {...register("message")}
                />
              </FieldContent>
              {errors.message && (
                <FieldError>{errors.message.message}</FieldError>
              )}
            </Field>

            {/* Attach Screenshot File Input */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-full text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer shadow-sm transition-all">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedFileName || "Attach Screenshot"}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="text-sm font-medium p-3 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-4 bg-[#00c885] hover:bg-[#00b577] text-white font-medium py-3 rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={successAlertOpen} onOpenChange={setSuccessAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>সফল হয়েছে!</AlertDialogTitle>
            <AlertDialogDescription>
              অভিযোগ সফলভাবে পাঠানো হয়েছে!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setSuccessAlertOpen(false)}>
            ঠিক আছে
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
