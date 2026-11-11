import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CreditCard, XCircle } from "lucide-react";
import { Button, Card, ErrorMessage, SuccessMessage } from "../ui";
import type { HoldStatus } from "../../interfaces";
import { formatDateTime } from "../../utils/formatDate";
import { Countdown } from "./Countdown";
import { HoldStatusChip } from "./HoldStatusChip";
import styles from "./Holds.module.css";

interface HoldDetailCardProps {
  holdId: string;
  className: string | null;
  status: HoldStatus;
  expiresAt: string;
  remainingMs: number;
  hasStudentId: boolean;
  isPaying: boolean;
  isCancelling: boolean;
  error: string | null;
  onPay: () => void;
  onCancel: () => void;
}

const STATUS_NOTES: Record<HoldStatus, ReactNode> = {
  HELD: "Your seat is held. Pay the admission fee before the timer ends to confirm it.",
  CONFIRMED: "Admission confirmed. This seat now belongs to the student.",
  EXPIRED: (
    <>
      The time to pay ran out and the seat was released. You can <Link to="/">apply again</Link> if seats are left.
    </>
  ),
  CANCELLED: (
    <>
      This application was cancelled and the seat was released. <Link to="/">Back to classes</Link>
    </>
  ),
};

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.detail}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function HoldDetailCard({
  holdId,
  className,
  status,
  expiresAt,
  remainingMs,
  hasStudentId,
  isPaying,
  isCancelling,
  error,
  onPay,
  onCancel,
}: HoldDetailCardProps) {
  const isHeld = status === "HELD";
  const isBusy = isPaying || isCancelling;

  return (
    <Card title={className ?? "Application"} actions={<HoldStatusChip status={status} />}>
      <div className={styles.timerBox}>
        <span className={styles.timerLabel}>{isHeld ? "Time left to pay" : "Status"}</span>
        {isHeld ? <Countdown remainingMs={remainingMs} size="lg" /> : <span className={styles.timerDone}>{status}</span>}
      </div>

      <dl className={styles.details}>
        <Detail label="Application ID">
          <span className="font-mono">{holdId}</span>
        </Detail>
        <Detail label={isHeld ? "Expires at" : "Hold ended at"}>{formatDateTime(expiresAt)}</Detail>
      </dl>

      <div className="mt-5 flex flex-col gap-3">
        {status === "CONFIRMED" ? (
          <SuccessMessage message={STATUS_NOTES.CONFIRMED} />
        ) : (
          <p className={styles.note}>{STATUS_NOTES[status]}</p>
        )}
        {error && <ErrorMessage message={error} />}
        {isHeld && !hasStudentId && (
          <p className={styles.note}>Enter the birth registration number used to apply to pay or cancel.</p>
        )}
      </div>

      {isHeld && (
        <div className={styles.actions}>
          <Button variant="danger" disabled={!hasStudentId || isBusy} onClick={onCancel}>
            <XCircle /> {isCancelling ? "Cancelling…" : "Cancel"}
          </Button>
          <Button disabled={!hasStudentId || isBusy} onClick={onPay}>
            <CreditCard /> {isPaying ? "Paying…" : "Pay admission fee"}
          </Button>
        </div>
      )}
    </Card>
  );
}
