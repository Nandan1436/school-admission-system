import styles from "./Layout.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <span>School Admission · first come, first served</span>
        <span>Seats are held for a limited time. Pay the fee before the timer ends to confirm.</span>
      </div>
    </footer>
  );
}
