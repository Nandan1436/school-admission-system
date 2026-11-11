import styles from "./Classes.module.css";

export function LiveBadge({ label }: { label: string }) {
  return (
    <span className={styles.live}>
      <span className={styles.livePulse} />
      {label}
    </span>
  );
}
