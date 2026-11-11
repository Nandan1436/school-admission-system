import { CreateClassSchema, buildClassName, type CreateClassForm } from "../../utils/classValidation";
import { useZodForm } from "../useZodForm";
import { useCreateClass } from "./useCreateClass";

const INITIAL_FORM: CreateClassForm = { grade: "", shift: "", totalSeats: "" };

export function useCreateClassForm() {
  const { createClass, isCreating, error, created, resetResult } = useCreateClass(() => reset());
  const { formData, setField, fieldErrors, reset, onSubmit } = useZodForm(CreateClassSchema, INITIAL_FORM, (parsed) =>
    createClass({ name: buildClassName(parsed.grade, parsed.shift), totalSeats: parsed.totalSeats }),
  );

  const previewName = formData.grade && formData.shift ? buildClassName(formData.grade, formData.shift) : null;

  return {
    formData,
    setField: (field: keyof CreateClassForm, value: string) => {
      resetResult();
      setField(field, value);
    },
    fieldErrors,
    generalError: error,
    created,
    previewName,
    isSubmitting: isCreating,
    onSubmit,
  };
}
