import { useState, type FormEvent } from "react";
import type { ZodType } from "zod";
import { getFieldErrors, type FieldErrors } from "../utils/validation";

export function useZodForm<TForm extends Record<string, string>, TParsed>(
  schema: ZodType<TParsed, TForm>,
  initial: TForm,
  submit: (parsed: TParsed) => void,
) {
  const [formData, setFormData] = useState<TForm>(initial);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TForm>>({});

  function setField(field: keyof TForm, value: string) {
    setFormData((data) => ({ ...data, [field]: value }));
    setFieldErrors((errors) => ({ ...errors, [field]: undefined }));
  }

  function reset(next: TForm = initial) {
    setFormData(next);
    setFieldErrors({});
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = schema.safeParse(formData);
    if (!result.success) {
      setFieldErrors(getFieldErrors<TForm>(result.error));
      return;
    }
    setFieldErrors({});
    submit(result.data);
  }

  return { formData, setField, fieldErrors, reset, onSubmit };
}
