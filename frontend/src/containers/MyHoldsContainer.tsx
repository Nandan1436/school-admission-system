import { Link, useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../constants";
import { MyHoldsTable } from "../components/holds";
import { EmptyState, ErrorMessage, LoadingSpinner, Pagination } from "../components/ui";
import { useStudent } from "../context/StudentContext";
import { useMyHoldsQuery, useNow } from "../hooks";

function readOffset(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}

export function MyHoldsContainer() {
  const { studentId } = useStudent();
  const [searchParams, setSearchParams] = useSearchParams();
  const { holds, isLoading, error } = useMyHoldsQuery(studentId);
  const now = useNow();

  if (!studentId) {
    return <EmptyState>Enter the birth registration number above to see this student's applications.</EmptyState>;
  }
  if (isLoading) return <LoadingSpinner label="Loading applications…" />;
  if (error && holds.length === 0) return <ErrorMessage message={error} />;
  if (holds.length === 0) {
    return (
      <EmptyState>
        No applications yet for this student. <Link to="/">Browse classes</Link> to apply.
      </EmptyState>
    );
  }

  const offset = readOffset(searchParams.get("offset"));

  return (
    <div className="flex flex-col gap-4">
      {error && <ErrorMessage message={`Couldn't refresh applications. ${error}`} />}
      <MyHoldsTable holds={holds.slice(offset, offset + PAGE_SIZE)} now={now} />
      <Pagination
        offset={offset}
        limit={PAGE_SIZE}
        total={holds.length}
        noun="applications"
        onOffsetChange={(next) => setSearchParams(next > 0 ? { offset: String(next) } : {})}
      />
    </div>
  );
}
