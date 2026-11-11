import type { FormEvent } from "react";
import { IdCard, Pencil, Save, X } from "lucide-react";
import { Button, TextField } from "../ui";
import styles from "./Layout.module.css";

interface StudentBarProps {
  studentId: string | null;
  isEditing: boolean;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onEdit: () => void;
  onCancel: () => void;
}

export function StudentBar({ studentId, isEditing, value, error, onChange, onSubmit, onEdit, onCancel }: StudentBarProps) {
  return (
    <div className={styles.studentBar}>
      <div className={styles.studentInner}>
        <div className={styles.studentLabel}>
          <IdCard />
          <span>Student</span>
        </div>
        {isEditing ? (
          <form className={styles.studentForm} onSubmit={onSubmit} noValidate>
            <TextField
              aria-label="Birth registration number"
              placeholder="17-digit birth registration no."
              inputMode="numeric"
              autoComplete="off"
              maxLength={17}
              mono
              value={value}
              error={error}
              onChange={(e) => onChange(e.target.value)}
              className={styles.studentInput}
            />
            <Button type="submit" size="sm">
              <Save /> <span className={styles.hideXs}>Save</span>
            </Button>
            {studentId && (
              <Button variant="ghost" size="sm" onClick={onCancel} aria-label="Cancel change">
                <X />
              </Button>
            )}
          </form>
        ) : (
          <div className={styles.studentCurrent}>
            <span className={styles.studentHint}>Applying as</span>
            <span className={styles.studentId}>{studentId}</span>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil /> <span className={styles.hideXs}>Change</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
