import { useState } from "react";
import { useStudent } from "../../context/StudentContext";
import { StudentFormSchema } from "../../utils/studentValidation";
import { useZodForm } from "../useZodForm";

export function useStudentForm() {
  const { studentId, setStudentId } = useStudent();
  const [isEditing, setIsEditing] = useState(!studentId);
  const { formData, setField, fieldErrors, reset, onSubmit } = useZodForm(
    StudentFormSchema,
    { studentId: studentId ?? "" },
    (parsed) => {
      setStudentId(parsed.studentId);
      setIsEditing(false);
    },
  );

  return {
    studentId,
    isEditing: isEditing || !studentId,
    value: formData.studentId,
    error: fieldErrors.studentId,
    onChange: (value: string) => setField("studentId", value.replace(/\D/g, "")),
    onSubmit,
    onEdit: () => {
      reset({ studentId: studentId ?? "" });
      setIsEditing(true);
    },
    onCancel: () => {
      reset({ studentId: studentId ?? "" });
      setIsEditing(false);
    },
  };
}
