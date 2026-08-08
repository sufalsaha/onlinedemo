"use client";

import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ReloadIcon } from "@radix-ui/react-icons";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { ImgAdd, uploadFile } from "@/actions/image-action";

export const formSchema = z.object({
  image: z
    .string()
    .min(1, { message: "Please select an image to upload" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ImageUpload({ ondata }: { ondata: () => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { image: "" },
  });

  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSubmitting = form.formState.isSubmitting;

  const resetFileInput = () => {
    setFile(null);
    form.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async () => {
    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);

      const result = await uploadFile(data);

      if (!result?.uploadResult) {
        throw new Error("Upload failed");
      }

      await ImgAdd(result.uploadResult);

      setOpen(true);
      resetFileInput();
      ondata();
    } catch (error) {
      console.error("Image upload failed:", error);
      form.setError("image", {
        type: "manual",
        message: "Something went wrong while uploading. Please try again.",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <div className="bg-[#e2a90c] p-[30px]">
          <h1 className="text-[30px]">Upload Image</h1>

          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            className="flex justify-center items-center gap-[50px]"
          >
            <FieldGroup >
              <Controller
                control={form.control}
                name="image"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      name={field.name}
                      onBlur={field.onBlur}
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0] ?? null;
                        setFile(selectedFile);
                        field.onChange(selectedFile ? selectedFile.name : "");
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <button
              type="submit"
              disabled={!file || isSubmitting}
              className="px-[10px] py-[16px] bg-[#44d418] text-[#fff] rounded-[10px] flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Upload Image
            </button>
          </form>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Image Upload</DialogTitle>
            <DialogDescription>
              Anyone who has image upload success will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">hello</div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}