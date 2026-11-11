import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  padded?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Card({ title, description, actions, padded = true, className = "", children }: CardProps) {
  const hasHead = Boolean(title || description || actions);
  return (
    <section className={[styles.card, padded ? styles.padded : "", className].filter(Boolean).join(" ")}>
      {hasHead && (
        <div className={styles.head}>
          <div className="min-w-0">
            {title && <h3 className={styles.title}>{title}</h3>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
