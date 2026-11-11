import { Link } from "react-router-dom";
import { HoldDetailCard } from "../components/holds";
import { ErrorMessage, LoadingSpinner } from "../components/ui";
import { useStudent } from "../context/StudentContext";
import { useClassQuery, useHoldActions, useHoldCountdown, useHoldQuery } from "../hooks";

export function HoldDetailContainer({ holdId }: { holdId: string }) {
  const { hasStudentId } = useStudent();
  const { hold, isLoading, error } = useHoldQuery(holdId);
  const { classSummary } = useClassQuery(hold?.classId);
  const { displayStatus, remainingMs } = useHoldCountdown(hold);
  const actions = useHoldActions(hold?.holdId, hold?.classId);

  if (isLoading) return <LoadingSpinner label="Loading application…" />;
  if (error && !hold) {
    return (
      <ErrorMessage
        message={
          <>
            {error} <Link to="/my-applications">See my applications</Link>
          </>
        }
      />
    );
  }
  if (!hold || !displayStatus) return null;

  return (
    <div className="flex max-w-[720px] flex-col gap-4">
      {error && <ErrorMessage message={`Couldn't refresh this application. ${error}`} />}
      <HoldDetailCard
        holdId={hold.holdId}
        className={classSummary?.name ?? null}
        status={displayStatus}
        expiresAt={hold.expiresAt}
        remainingMs={remainingMs}
        hasStudentId={hasStudentId}
        isPaying={actions.isPaying}
        isCancelling={actions.isCancelling}
        error={actions.error}
        onPay={actions.payFee}
        onCancel={actions.cancelApplication}
      />
    </div>
  );
}
