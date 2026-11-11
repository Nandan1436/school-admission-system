import type { CSSProperties } from "react";
import styles from "./Classes.module.css";

interface SeatBarProps {
  totalSeats: number;
  heldSeats: number;
  confirmedSeats: number;
}

function percent(part: number, total: number): string {
  return total > 0 ? `${Math.min(100, (part / total) * 100)}%` : "0%";
}

export function SeatBar({ totalSeats, heldSeats, confirmedSeats }: SeatBarProps) {
  return (
    <div
      className={styles.seatBar}
      role="img"
      aria-label={`${confirmedSeats} confirmed and ${heldSeats} held out of ${totalSeats} seats`}
    >
      <span
        className={styles.seatSegment}
        style={{ "--c": "var(--down)", width: percent(confirmedSeats, totalSeats) } as CSSProperties}
      />
      <span
        className={styles.seatSegment}
        style={{ "--c": "var(--accent)", width: percent(heldSeats, totalSeats) } as CSSProperties}
      />
    </div>
  );
}
