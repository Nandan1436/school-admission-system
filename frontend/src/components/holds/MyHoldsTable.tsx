import { ArrowRight } from "lucide-react";
import { ButtonLink, Card } from "../ui";
import type { MyHold } from "../../interfaces";
import { formatDateTime } from "../../utils/formatDate";
import { getDisplayStatus, getRemainingMs } from "../../utils/holdStatus";
import { Countdown } from "./Countdown";
import { HoldStatusChip } from "./HoldStatusChip";
import styles from "./Holds.module.css";

interface MyHoldsTableProps {
  holds: MyHold[];
  now: number;
}

function TimeLeft({ hold, now }: { hold: MyHold; now: number }) {
  const status = getDisplayStatus(hold.status, hold.expiresAt, now);
  if (status !== "HELD") return <span className={styles.mutedCell}>–</span>;
  return <Countdown remainingMs={getRemainingMs(hold.expiresAt, now)} />;
}

export function MyHoldsTable({ holds, now }: MyHoldsTableProps) {
  return (
    <Card padded={false} className="overflow-hidden">
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Class</th>
              <th>Status</th>
              <th>Time left</th>
              <th>Hold ends</th>
              <th className={styles.alignRight}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {holds.map((hold) => (
              <tr key={hold.holdId}>
                <td className={styles.className}>{hold.className}</td>
                <td>
                  <HoldStatusChip status={getDisplayStatus(hold.status, hold.expiresAt, now)} />
                </td>
                <td>
                  <TimeLeft hold={hold} now={now} />
                </td>
                <td className={styles.mutedCell}>{formatDateTime(hold.expiresAt)}</td>
                <td className={styles.alignRight}>
                  <ButtonLink to={`/applications/${hold.holdId}`} variant="ghost" size="sm">
                    Open <ArrowRight />
                  </ButtonLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.cards}>
        {holds.map((hold) => (
          <div key={hold.holdId} className={styles.cardRow}>
            <div className={styles.cardRowHead}>
              <span className={styles.className}>{hold.className}</span>
              <TimeLeft hold={hold} now={now} />
            </div>
            <div className={styles.cardRowHead}>
              <HoldStatusChip status={getDisplayStatus(hold.status, hold.expiresAt, now)} />
              <ButtonLink to={`/applications/${hold.holdId}`} variant="ghost" size="sm">
                Open <ArrowRight />
              </ButtonLink>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
