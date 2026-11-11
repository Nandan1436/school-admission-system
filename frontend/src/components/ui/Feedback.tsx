import type { ReactNode } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";
import styles from "./Feedback.module.css";

interface MessageProps {
  message: ReactNode;
  className?: string;
}

export function LoadingSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className={styles.loading} role="status">
      <span className={styles.spinner} />
      {label}
    </div>
  );
}

export function ErrorMessage({ message, className = "" }: MessageProps) {
  return (
    <div className={`${styles.error} ${className}`} role="alert">
      <TriangleAlert />
      <div className="min-w-0">{message}</div>
    </div>
  );
}

export function SuccessMessage({ message, className = "" }: MessageProps) {
  return (
    <div className={`${styles.success} ${className}`} role="status">
      <CircleCheck />
      <div className="min-w-0">{message}</div>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className={styles.empty}>{children}</div>;
}
