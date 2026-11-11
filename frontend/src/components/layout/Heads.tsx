import type { ReactNode } from "react";
import styles from "./Layout.module.css";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className={styles.eyebrow}>{children}</div>;
}

interface HeadProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
}

export function PageHead({ eyebrow, title, lead, actions }: HeadProps) {
  return (
    <div className={styles.pageHead}>
      <div className="min-w-0">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1>{title}</h1>
        {lead && <p>{lead}</p>}
      </div>
      {actions && <div className={styles.headActions}>{actions}</div>}
    </div>
  );
}

export function SectionHead({ eyebrow, title, lead, actions }: HeadProps) {
  return (
    <div className={styles.sectionHead}>
      <div className="min-w-0">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2>{title}</h2>
        {lead && <p>{lead}</p>}
      </div>
      {actions && <div className={styles.headActions}>{actions}</div>}
    </div>
  );
}
