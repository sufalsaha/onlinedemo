"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
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
import slugify from "slugify";
import { transliterate } from "transliteration";

import { createCategory, updateCategory } from "@/actions/category-action";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/lib/schemas/category";

// function slugify(value: string) {
//   return value
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)+/g, "");
// }

interface AddCategoryFormProps {
  category?: { id: string; name: string; slug: string };
  onSuccess?: () => void;
  // When true, renders only the form fields with no Card wrapper.
  // The parent Dialog becomes the visual container; its own DialogHeader
  // supplies the title and description instead.
  asDialog?: boolean;
}

export default function AddCategoryForm({
  category,
  onSuccess,
  asDialog = false,
}: AddCategoryFormProps) {
  const isEditMode = !!category;
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [newCategoryId, setNewCategoryId] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
    },
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (isEditMode) return;
    setValue("slug", slugify(transliterate(nameValue ?? ""), {
    lower: true,
    strict: true,
    trim: true,
  }), { shouldValidate: true });
  }, [nameValue, setValue, isEditMode]);

  async function onSubmit(values: CategoryFormValues) {
    setError(undefined);

    try {
      const result = isEditMode
        ? await updateCategory(category.id, values)
        : await createCategory(values);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (isEditMode) {
        router.push(`/dashboard/category/${category.id}`);
        router.refresh();
        onSuccess?.();
        return;
      }

      reset();
      const id = result?.data?.id;
      if (!id) {
        setError("Something went wrong. Please try again.");
        return;
      }
      setNewCategoryId(id);
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
        <FieldLabel>Category Name</FieldLabel>
        <FieldContent>
          <Input
            placeholder="e.g., Agriculture"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </FieldContent>
        {errors.name && <FieldError>{errors.name.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel>URL Slug</FieldLabel>
        <FieldContent>
          <Input
            className="bg-slate-50 dark:bg-slate-900 font-mono text-xs"
            readOnly={!isEditMode}
            aria-invalid={!!errors.slug}
            {...register("slug")}
          />
        </FieldContent>
        {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
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
            {isEditMode ? "Saving Changes..." : "Creating Category..."}
          </>
        ) : isEditMode ? (
          "Save Changes"
        ) : (
          "Create Category"
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
            {isEditMode ? "Edit Category" : "Add Category"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update this business category"
              : "Create a new business category for the directory"}
          </CardDescription>
        </CardHeader>
        <CardContent>{formFields}</CardContent>
      </Card>

      <AlertDialog open={successAlertOpen} onOpenChange={setSuccessAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              You have successfully added a new Category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href={`/dashboard/category/${newCategoryId}`}>
                View Category
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}