import type { ReactNode } from "react";
import type { ClassSummary } from "../../interfaces";
import { ClassCard } from "./ClassCard";
import styles from "./Classes.module.css";

interface ClassGridProps {
  classes: ClassSummary[];
  hasStudentId: boolean;
  applyingClassId: string | null;
  isApplying: boolean;
  errorClassId: string | null;
  error: ReactNode;
  onApply: (classId: string) => void;
}

export function ClassGrid({
  classes,
  hasStudentId,
  applyingClassId,
  isApplying,
  errorClassId,
  error,
  onApply,
}: ClassGridProps) {
  return (
    <div className={styles.grid}>
      {classes.map((classSummary) => (
        <ClassCard
          key={classSummary.id}
          classSummary={classSummary}
          hasStudentId={hasStudentId}
          isApplying={isApplying && applyingClassId === classSummary.id}
          isBusy={isApplying}
          error={errorClassId === classSummary.id ? error : undefined}
          onApply={onApply}
        />
      ))}
    </div>
  );
}
