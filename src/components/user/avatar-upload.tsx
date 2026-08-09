"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCw, Trash2, Upload } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import {
  removeProfilePicture,
  updateProfilePicture,
} from "@/actions/user-actions";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_BYTES,
} from "@/lib/schemas/profile";
import { EN } from "@/lib/lang";

import { initials } from "./user-menu";

export function AvatarUpload({
  fullName,
  image,
}: {
  fullName: string;
  image: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [saved, setSaved] = useState(image);
  const [file, setFile] = useState<File | null>(null);
  // A blob: URL for the chosen file, so the user sees the new picture before
  // it is uploaded. Kept in state (not derived) so it can be revoked exactly
  // once — an un-revoked blob URL leaks its buffer for the page's lifetime.
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, setPending] = useState<"save" | "remove" | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function replacePreview(next: string | null) {
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return next;
    });
  }

  function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    setError(undefined);
    setSuccess(undefined);

    const picked = event.target.files?.[0];
    if (!picked) return;

    // Mirrors the server-side guard in updateProfilePicture. Doing it here too
    // means an oversized file is rejected before it crosses the network.
    if (!ACCEPTED_IMAGE_TYPES.includes(picked.type)) {
      setError(EN.invalidImageType);
      clearInput();
      return;
    }
    if (picked.size > MAX_AVATAR_BYTES) {
      setError(EN.imageTooLarge);
      clearInput();
      return;
    }

    setFile(picked);
    replacePreview(URL.createObjectURL(picked));
  }

  function clearInput() {
    setFile(null);
    replacePreview(null);
    // Reset the input, or picking the same file twice fires no change event.
    if (inputRef.current) inputRef.current.value = "";
  }

  async function onSave() {
    if (!file) {
      setError(EN.noImageSelected);
      return;
    }

    setError(undefined);
    setSuccess(undefined);
    setPending("save");

    try {
      const data = new FormData();
      data.append("file", file);

      const result = await updateProfilePicture(data);

      if (result.error) {
        setError(result.error);
        return;
      }

      setSaved(result.image ?? null);
      setSuccess(result.success);
      clearInput();
    } catch (err) {
      setError(err instanceof Error ? err.message : EN.somethingWentWrong);
    } finally {
      setPending(null);
    }
  }

  async function onRemove() {
    setError(undefined);
    setSuccess(undefined);
    setPending("remove");

    try {
      const result = await removeProfilePicture();

      if (result.error) {
        setError(result.error);
        return;
      }

      setSaved(null);
      setSuccess(result.success);
      clearInput();
    } catch (err) {
      setError(err instanceof Error ? err.message : EN.somethingWentWrong);
    } finally {
      setPending(null);
    }
  }

  const shown = preview ?? saved;
  const busy = pending !== null;

  return (
    <div className="space-y-4">
      <FieldLabel>Profile Picture</FieldLabel>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <Avatar className="h-20 w-20 border border-slate-200 dark:border-slate-800">
          {shown && <AvatarImage src={shown} alt={fullName} />}
          <AvatarFallback className="text-lg">
            {initials(fullName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3 text-center sm:text-left">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="hidden"
            onChange={onPick}
          />

          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="mr-2 h-3.5 w-3.5" />
              {shown ? "Choose another" : "Choose image"}
            </Button>

            {file && (
              <>
                <Button type="button" size="sm" disabled={busy} onClick={onSave}>
                  {pending === "save" ? (
                    <>
                      <RotateCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save picture"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  onClick={() => {
                    setError(undefined);
                    clearInput();
                  }}
                >
                  Cancel
                </Button>
              </>
            )}

            {saved && !file && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                disabled={busy}
                onClick={onRemove}
              >
                {pending === "remove" ? (
                  <RotateCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                )}
                Remove
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP, GIF or AVIF. Up to 5MB.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-emerald-500/10 p-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          {success}
        </div>
      )}
    </div>
  );
}
