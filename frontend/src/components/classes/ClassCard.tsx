import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Ban } from "lucide-react";
import { Button, ErrorMessage } from "../ui";
import type { ClassSummary } from "../../interfaces";
import { SeatBar } from "./SeatBar";
import styles from "./Classes.module.css";

interface ClassCardProps {
  classSummary: ClassSummary;
  hasStudentId: boolean;
  isApplying: boolean;
  isBusy: boolean;
  error?: ReactNode;
  onApply: (classId: string) => void;
}

function SeatCount({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={styles.count} style={{ "--c": color } as CSSProperties}>
      <span className={styles.countLabel}>
        <span className={styles.countDot} />
        {label}
      </span>
      <span className={styles.countValue}>{value.toLocaleString()}</span>
    </div>
  );
}

export function ClassCard({ classSummary, hasStudentId, isApplying, isBusy, error, onApply }: ClassCardProps) {
  const { id, name, totalSeats, heldSeats, confirmedSeats, availableSeats } = classSummary;
  const isFull = availableSeats <= 0;

  return (
    <article className={styles.classCard}>
      <div className={styles.classHead}>
        <h3>{name}</h3>
        <span className={isFull ? styles.badgeFull : styles.badgeOpen}>
          {isFull ? "Full" : `${availableSeats.toLocaleString()} free`}
        </span>
      </div>
      <SeatBar totalSeats={totalSeats} heldSeats={heldSeats} confirmedSeats={confirmedSeats} />
      <div className={styles.counts}>
        <SeatCount label="Total" value={totalSeats} color="var(--fg-dim)" />
        <SeatCount label="Held" value={heldSeats} color="var(--accent)" />
        <SeatCount label="Confirmed" value={confirmedSeats} color="var(--down)" />
        <SeatCount label="Available" value={availableSeats} color="var(--data)" />
      </div>
      {error && <ErrorMessage message={error} />}
      <div className={styles.classFoot}>
        {!hasStudentId && <span className={styles.footHint}>Enter a birth registration no. above to apply</span>}
        <Button
          className="ml-auto"
          disabled={!hasStudentId || isFull || isBusy}
          onClick={() => onApply(id)}
        >
          {isFull ? (
            <>
              <Ban /> No seats left
            </>
          ) : (
            <>
              {isApplying ? "Applying…" : "Apply"} <ArrowRight />
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
