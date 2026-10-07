"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "./label";
import { cn } from "@/lib/utils";

/**
 * Minimal ShadCN-style form primitives over react-hook-form. Field layout uses
 * the site's `.cf-field` styling for visual parity with the original forms.
 */
export const Form = FormProvider;

type FieldContextValue = { name: string };
const FormFieldContext = React.createContext<FieldContextValue>({ name: "" });

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormFieldError() {
  const { name } = React.useContext(FormFieldContext);
  const { formState } = useFormContext();
  const error = name
    ? (formState.errors[name as keyof typeof formState.errors] as
        | { message?: string }
        | undefined)
    : undefined;
  return { name, error };
}

export function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("cf-field", className)} {...props} />;
}

export function FormLabel(props: React.ComponentPropsWithoutRef<typeof Label>) {
  return <Label {...props} />;
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function FormMessage({ className }: { className?: string }) {
  const { error } = useFormFieldError();
  if (!error?.message) return null;
  return (
    <p className={cn("text-[13px] font-semibold text-error", className)}>
      {String(error.message)}
    </p>
  );
}
