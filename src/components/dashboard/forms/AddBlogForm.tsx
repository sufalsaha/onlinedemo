"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RotateCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { transliterate } from "transliteration";

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

import { createBlog, updateBlog } from "@/actions/blog-action";
import { blogFormSchema, type BlogFormValues } from "@/lib/schemas/blog";
import {
  ImageSeletor,
  ImageSeletorRef,
} from "@/components/imagefrom/image-seletor";

interface ExistingBlog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  authorName: string;
  authorAvatar: string | null;
  readingTime: number;
  featured: boolean;
  status: "draft" | "published";
}

interface AddBlogFormProps {
  blog?: ExistingBlog;
  onSuccess?: () => void;
  asDialog?: boolean;
}

export default function AddBlogForm({
  blog,
  onSuccess,
  asDialog = false,
}: AddBlogFormProps) {
  const isEditMode = !!blog;
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [newBlogSlug, setNewBlogSlug] = useState("");
  const imagesAddFormRef = useRef<ImageSeletorRef>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: blog?.title ?? "",
      slug: blog?.slug ?? "",
      excerpt: blog?.excerpt ?? "",
      content: blog?.content ?? "",
      category: blog?.category ?? "",
      tags: blog?.tags.map((value) => ({ value })) ?? [],
      authorName: blog?.authorName ?? "",
      authorAvatar: blog?.authorAvatar ?? "",
      readingTime: blog?.readingTime ?? 5,
      featured: blog?.featured ?? false,
      status: blog?.status ?? "draft",
    },
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({ control, name: "tags" });

  const titleValue = watch("title");

  useEffect(() => {
    if (isEditMode) return;

    setValue(
      "slug",
      slugify(transliterate(titleValue ?? ""), {
        lower: true,
        strict: true,
        trim: true,
      }),
      { shouldValidate: true }
    );
  }, [titleValue, setValue, isEditMode]);

  async function onSubmit(values: BlogFormValues) {
    setError(undefined);
    const coverImage = imagesAddFormRef.current?.selectedImages[0] ?? "";

    try {
      const result = isEditMode
        ? await updateBlog(blog.id, values, coverImage)
        : await createBlog(values, coverImage);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (isEditMode) {
        router.push(`/dashboard/blog/${blog.id}`);
        router.refresh();
        onSuccess?.();
        return;
      }

      if (!result.data?.id) {
        setError("Something went wrong. Please try again.");
        return;
      }

      reset();
      setNewBlogSlug(result.data.id);
      setSuccessAlertOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  }

  const formFields = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Field>
        <FieldLabel>Title</FieldLabel>
        <FieldContent>
          <Input
            placeholder="e.g., 5 Tips for Choosing a Trustworthy Business"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
        </FieldContent>
        {errors.title && <FieldError>{errors.title.message}</FieldError>}
      </Field>

      <ImageSeletor
        ref={imagesAddFormRef}
        multiselects={true}
        label={"Cover Image"}
      />

      <Field>
        <FieldLabel>Excerpt</FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="A short one-to-two sentence summary shown on cards..."
            className="min-h-20 resize-y leading-relaxed"
            aria-invalid={!!errors.excerpt}
            {...register("excerpt")}
          />
        </FieldContent>
        {errors.excerpt && <FieldError>{errors.excerpt.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel>Content</FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="Write the full post..."
            className="min-h-48 resize-y leading-relaxed"
            aria-invalid={!!errors.content}
            {...register("content")}
          />
        </FieldContent>
        {errors.content && <FieldError>{errors.content.message}</FieldError>}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Category</FieldLabel>
          <FieldContent>
            <Input
              placeholder="e.g., Business Tips"
              aria-invalid={!!errors.category}
              {...register("category")}
            />
          </FieldContent>
          {errors.category && (
            <FieldError>{errors.category.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Reading Time (minutes)</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              min="1"
              max="120"
              aria-invalid={!!errors.readingTime}
              {...register("readingTime", { valueAsNumber: true })}
            />
          </FieldContent>
          {errors.readingTime && (
            <FieldError>{errors.readingTime.message}</FieldError>
          )}
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Author Name</FieldLabel>
          <FieldContent>
            <Input
              placeholder="e.g., Rahim Uddin"
              aria-invalid={!!errors.authorName}
              {...register("authorName")}
            />
          </FieldContent>
          {errors.authorName && (
            <FieldError>{errors.authorName.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Author Avatar URL</FieldLabel>
          <FieldContent>
            <Input
              placeholder="https://example.com/avatar.jpg"
              aria-invalid={!!errors.authorAvatar}
              {...register("authorAvatar")}
            />
          </FieldContent>
          {errors.authorAvatar && (
            <FieldError>{errors.authorAvatar.message}</FieldError>
          )}
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FieldContent>
          {errors.status && <FieldError>{errors.status.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Featured</FieldLabel>
          <FieldContent>
            <label className="flex items-center gap-2 h-9 text-sm text-foreground">
              <input type="checkbox" className="size-4" {...register("featured")} />
              Show as the featured article on the blog page
            </label>
          </FieldContent>
        </Field>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between pt-3">
          <FieldLabel>Tags</FieldLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendTag({ value: "" })}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Tag
          </Button>
        </div>

        {tagFields.length === 0 && (
          <p className="text-xs text-muted-foreground">No tags added yet.</p>
        )}

        {tagFields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <Field className="flex-1">
              <FieldContent>
                <Input
                  placeholder="e.g., trust"
                  aria-invalid={!!errors.tags?.[index]?.value}
                  {...register(`tags.${index}.value` as const)}
                />
              </FieldContent>
              {errors.tags?.[index]?.value && (
                <FieldError>{errors.tags[index]?.value?.message}</FieldError>
              )}
            </Field>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-0.5 text-destructive hover:text-destructive"
              onClick={() => removeTag(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {error && (
        <div className="text-sm font-medium p-3 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <RotateCw className="w-4 h-4 mr-2 animate-spin" />
            {isEditMode ? "Saving Changes..." : "Creating Post..."}
          </>
        ) : isEditMode ? (
          "Save Changes"
        ) : (
          "Create Post"
        )}
      </Button>
    </form>
  );

  if (asDialog) {
    return formFields;
  }

  return (
    <>
      <Card className="max-w-[700px] w-full m-5 shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {isEditMode ? "Edit Blog Post" : "Add Blog Post"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update this blog post"
              : "Write a new post for the blog"}
          </CardDescription>
        </CardHeader>
        <CardContent>{formFields}</CardContent>
      </Card>

      <AlertDialog open={successAlertOpen} onOpenChange={setSuccessAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              You have successfully created a new blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href={`/dashboard/blog/${newBlogSlug}`}>View Post</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
