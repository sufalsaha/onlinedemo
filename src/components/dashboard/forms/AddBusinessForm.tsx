"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RotateCw, Star, Trash2 } from "lucide-react";
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
import slugify from "slugify";
import { transliterate } from "transliteration";

import { createBusiness, updateBusiness } from "@/actions/business-action";
import {
  businessFormSchema,
  platformNames,
  type BusinessFormValues,
  type PlatformNameValue,
} from "@/lib/schemas/business";
import {
  ImageSeletor,
  ImageSeletorRef,
} from "@/components/imagefrom/image-seletor";

// function slugify(value: string) {
//   // return value
//   //   .toLowerCase()
//   //   .replace(/[^a-z0-9]+/g, "-")
//   //   .replace(/(^-|-$)+/g, "");
// }

interface ExistingBusiness {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  logo: string | null;
  about: string;
  subcategory?: string | null;
  location?: string | null;
  rating: number;
  productTag: string[];
  platforms: { name: PlatformNameValue; url: string }[];
}

interface AddBusinessFormProps {
  categories: { id: string; name: string }[];
  business?: ExistingBusiness;
  onSuccess?: () => void;
  asDialog?: boolean;
}

export default function AddBusinessForm({
  categories,
  business,
  onSuccess,
  asDialog = false,
}: AddBusinessFormProps) {
  const isEditMode = !!business;
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [newBusinessSlug, setNewBusinessSlug] = useState("");
  const imagesAddFormRef = useRef<ImageSeletorRef>(null);


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: business?.name ?? "",
      slug: business?.slug ?? "",
      categoryId: business?.categoryId ?? "",
      logo: business?.logo ?? "",
      about: business?.about ?? "",
      subcategory: business?.subcategory ?? "",
      location: business?.location ?? "",
      rating: business?.rating ?? 0,
      productTag: business?.productTag.map((value) => ({ value })) ?? [],
      platforms: business?.platforms.length
        ? business.platforms
        : [{ name: "facebook", url: "" }],
    },
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({ control, name: "productTag" });

  const {
    fields: platformFields,
    append: appendPlatform,
    remove: removePlatform,
  } = useFieldArray({ control, name: "platforms" });

  const nameValue = watch("name");

  useEffect(() => {
    if (isEditMode) return;

    // console.log(slugify(transliterate(nameValue ?? "")));
    setValue("slug", slugify(transliterate(nameValue ?? ""), {
    lower: true,
    strict: true,
    trim: true,
  }), { shouldValidate: true });
  }, [nameValue, setValue, isEditMode]);

  console.log(errors)
  async function onSubmit(values: BusinessFormValues) {
    // console.log("submit called");
   const image = imagesAddFormRef.current?.selectedImages[0]!;

    setError(undefined);

    try {

      
      
      const result = isEditMode
        ? await updateBusiness(business.id, values,image)
        : await createBusiness(values,image );
// console.log("images", image);


      if (result.error) {
        setError(result.error);
        return;
      }

      if (isEditMode) {
        router.push(`/dashboard/business/${business.id}`);
        router.refresh();
        onSuccess?.();
        return;
      }

      if (!result.data?.id) {
        setError("Something went wrong. Please try again.");
        return;
      }

      reset();
      setNewBusinessSlug(result.data.id);
      setSuccessAlertOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  // Shared form fields — used by both Card and Dialog render paths
  const formFields = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Identity Content */}
      <div className="space-y-4">
        <Field>
          <FieldLabel>Business Name</FieldLabel>
          <FieldContent>
            <Input
              placeholder="e.g., Dream Electronics And Machinery"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </FieldContent>
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <div className="grid grid-cols-2 gap-4">
          {/* <Field>
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
          </Field> */}

          <Field>
            <FieldLabel>Category</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-invalid={!!errors.categoryId}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldContent>
            {errors.categoryId && (
              <FieldError>{errors.categoryId.message}</FieldError>
            )}
          </Field>
        </div>

        {/* <Field> */}
        {/* <FieldLabel>Logo URL</FieldLabel>
          <FieldContent>
            <Input
              placeholder="https://example.com/logo.jpeg"
              aria-invalid={!!errors.logo}
              {...register("logo")}
            />
          </FieldContent>
          {errors.logo && <FieldError>{errors.logo.message}</FieldError>}
        </Field> */}

        <ImageSeletor
          ref={imagesAddFormRef}
          multiselects={true}
          label={"Logo Image"}
        />
      </div>

      {/* Narrative Text Controls */}
      <Field>
        <FieldLabel>About</FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="Write a short profile of this business..."
            className="min-h-[100px] resize-y leading-relaxed"
            aria-invalid={!!errors.about}
            {...register("about")}
          />
        </FieldContent>
        {errors.about && <FieldError>{errors.about.message}</FieldError>}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Subcategory</FieldLabel>
          <FieldContent>
            <Input
              placeholder="e.g., Tractor Parts"
              aria-invalid={!!errors.subcategory}
              {...register("subcategory")}
            />
          </FieldContent>
          {errors.subcategory && (
            <FieldError>{errors.subcategory.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Location</FieldLabel>
          <FieldContent>
            <Input
              placeholder="e.g., Dhaka, Bangladesh"
              aria-invalid={!!errors.location}
              {...register("location")}
            />
          </FieldContent>
          {errors.location && <FieldError>{errors.location.message}</FieldError>}
        </Field>
      </div>

      {/* Rating */}
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

      {/* Product Tags */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between pt-3">
          <FieldLabel>Product Tags</FieldLabel>
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
                  placeholder="e.g., ভুট্টা এড়ানো মেশিন"
                  aria-invalid={!!errors.productTag?.[index]?.value}
                  {...register(`productTag.${index}.value` as const)}
                />
              </FieldContent>
              {errors.productTag?.[index]?.value && (
                <FieldError>
                  {errors.productTag[index]?.value?.message}
                </FieldError>
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

      {/* Platforms */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between pt-3">
          <FieldLabel>Social Platforms</FieldLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendPlatform({ name: "facebook", url: "" })}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Platform
          </Button>
        </div>

        {platformFields.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No platforms added yet.
          </p>
        )}

        {platformFields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <Controller
              control={control}
              name={`platforms.${index}.name` as const}
              render={({ field: selectField }) => (
                <Select
                  onValueChange={selectField.onChange}
                  value={selectField.value}
                >
                  <SelectTrigger className="w-[130px] shrink-0">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformNames.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Field className="flex-1">
              <FieldContent>
                <Input
                  placeholder="https://facebook.com/yourpage"
                  aria-invalid={!!errors.platforms?.[index]?.url}
                  {...register(`platforms.${index}.url` as const)}
                />
              </FieldContent>
              {errors.platforms?.[index]?.url && (
                <FieldError>{errors.platforms[index]?.url?.message}</FieldError>
              )}
            </Field>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-0.5 text-destructive hover:text-destructive"
              onClick={() => removePlatform(index)}
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
            {isEditMode ? "Saving Changes..." : "Publishing Business..."}
          </>
        ) : isEditMode ? (
          "Save Changes"
        ) : (
          "Create Business"
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
      <Card className="max-w-[600px] w-full m-5 shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {isEditMode ? "Edit Business" : "Add Business"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update this business listing"
              : "List a new business on the directory"}
          </CardDescription>
        </CardHeader>
        <CardContent>{formFields}</CardContent>
      </Card>

      <AlertDialog open={successAlertOpen} onOpenChange={setSuccessAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              You have successfully added a new Business.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href={`/dashboard/business/${newBusinessSlug}`}>
                View Business
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
