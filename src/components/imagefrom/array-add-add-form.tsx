"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CircleX, Pencil } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";

const FormSchema = z.object({
  item: z.string().min(1, {
    message: "Item must be at least 1 character.",
  }),
});

export interface ArrayAddFormRef {
  items: string[];
  reset: () => void;
  setValue: (items: string[]) => void;
}

export const ArrayAddForm = forwardRef<
  ArrayAddFormRef,
  { defaultItems?: string[]; label: string }
>((props, ref) => {
  const [items, setItems] = useState<string[]>(props.defaultItems || []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      item: "",
    },
  });

  useImperativeHandle(ref, () => ({
    items,
    reset: () => {
      setItems(props.defaultItems || []);
      form.reset();
    },
    setValue: (newItems) => {
      setItems(newItems);
    },
  }));

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setItems([...items, data.item]);
    form.reset();
  }

  function handleEdit(index: number) {
    const value = items[index];
    setItems([...items.slice(0, index), ...items.slice(index + 1)]);
    form.setValue("item", value);
  }

  function handleRemove(index: number) {
    setItems([...items.slice(0, index), ...items.slice(index + 1)]);
  }

  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FieldGroup>
          <Controller
            control={form.control}
            name="item"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="array-add-item">{props.label}</FieldLabel>
                <Input
                  id="array-add-item"
                  placeholder={props.label}
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Button type="submit" className="m-0 w-fit">
          Add
        </Button>
      </form>

      <div className="mt-3 flex flex-col gap-2">
        {items.length === 0 && (
          <p className="text-sm text-neutral-500">No items added yet.</p>
        )}
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="border-2 border-neutral-900 h-10 pr-5 flex justify-center items-center gap-4"
          >
            <p className="w-full pt-2 pl-2 h-10">{item}</p>
            <Button
              type="button"
              variant="ghost"
              aria-label={`Edit ${item}`}
              onClick={() => handleEdit(index)}
            >
              <Pencil />
            </Button>
            <Button
              type="button"
              variant="ghost"
              aria-label={`Remove ${item}`}
              onClick={() => handleRemove(index)}
            >
              <CircleX />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
});

ArrayAddForm.displayName = "ArrayAddForm";