import type { FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button, SelectField, TextField } from "../ui";
import type { FieldErrors } from "../../utils/validation";
import type { CreateClassForm as CreateClassFormData } from "../../utils/classValidation";
import styles from "./Classes.module.css";

interface CreateClassFormProps {
  grades: string[];
  shifts: string[];
  formData: CreateClassFormData;
  fieldErrors: FieldErrors<CreateClassFormData>;
  previewName: string | null;
  isSubmitting: boolean;
  setField: (field: keyof CreateClassFormData, value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function CreateClassForm({
  grades,
  shifts,
  formData,
  fieldErrors,
  previewName,
  isSubmitting,
  setField,
  onSubmit,
}: CreateClassFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <div className={styles.formGrid}>
        <SelectField
          label="Class"
          placeholder="Choose a class"
          options={grades}
          value={formData.grade}
          error={fieldErrors.grade}
          onChange={(e) => setField("grade", e.target.value)}
        />
        <SelectField
          label="Shift"
          placeholder="Choose a shift"
          options={shifts}
          value={formData.shift}
          error={fieldErrors.shift}
          onChange={(e) => setField("shift", e.target.value)}
        />
        <TextField
          label="Total seats"
          placeholder="e.g. 120"
          inputMode="numeric"
          value={formData.totalSeats}
          error={fieldErrors.totalSeats}
          hint="Between 1 and 10,000"
          onChange={(e) => setField("totalSeats", e.target.value)}
          className={styles.formFull}
        />
        <div className={`${styles.preview} ${styles.formFull}`}>
          Class name: {previewName ? <strong>{previewName}</strong> : <span>choose a class and a shift</span>}
        </div>
      </div>
      <div className={styles.formActions}>
        <Button type="submit" disabled={isSubmitting}>
          <Plus /> {isSubmitting ? "Creating…" : "Create class"}
        </Button>
      </div>
    </form>
  );
}
