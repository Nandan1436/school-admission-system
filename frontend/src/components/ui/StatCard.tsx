import type { CSSProperties, ReactNode } from "react";
import styles from "./StatCard.module.css";

interface StatCardProps {
  label: string;
  icon: ReactNode;
  color?: string;
  value: number | null | undefined;
  sub?: ReactNode;
}

export function StatCard({ label, icon, color = "var(--data)", value, sub }: StatCardProps) {
  return (
    <div className={styles.stat} style={{ "--c": color } as CSSProperties}>
      <div className={styles.head}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.value}>{value === null || value === undefined ? "–" : value.toLocaleString()}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}
