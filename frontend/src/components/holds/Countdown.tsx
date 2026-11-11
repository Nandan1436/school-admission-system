import { formatCountdown } from "../../utils/holdStatus";
import styles from "./Holds.module.css";

const LOW_TIME_MS = 60_000;

interface CountdownProps {
  remainingMs: number;
  size?: "sm" | "lg";
}

export function Countdown({ remainingMs, size = "sm" }: CountdownProps) {
  const isLow = remainingMs <= LOW_TIME_MS;
  const sizeClass = size === "lg" ? styles.countdownLg : styles.countdown;
  return (
    <span className={`${sizeClass} ${isLow ? styles.countdownLow : ""}`} role="timer" aria-live="off">
      {formatCountdown(remainingMs)}
    </span>
  );
}
