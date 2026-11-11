import type { ZodError } from "zod";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function getFieldErrors<T>(error: ZodError): FieldErrors<T> {
  const fieldErrors: FieldErrors<T> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof T | undefined;
    if (field !== undefined && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
}
