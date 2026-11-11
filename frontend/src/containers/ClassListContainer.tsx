import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { ALREADY_APPLIED_CODE, CLASSES_REFETCH_MS, PAGE_SIZE } from "../constants";
import { ClassGrid, LiveBadge } from "../components/classes";
import { SectionHead } from "../components/layout";
import { ButtonLink, EmptyState, ErrorMessage, LoadingSpinner, Pagination } from "../components/ui";
import { useStudent } from "../context/StudentContext";
import { useClassesQuery, useCreateHold } from "../hooks";

function readOffset(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}

export function ClassListContainer() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasStudentId } = useStudent();
  const { classes, isLoading, error, hasData } = useClassesQuery();
  const { applyToClass, isApplying, applyingClassId, error: applyError, errorCode } = useCreateHold((hold) =>
    navigate(`/applications/${hold.holdId}`),
  );

  const offset = readOffset(searchParams.get("offset"));
  const pageClasses = classes.slice(offset, offset + PAGE_SIZE);

  const applyMessage =
    applyError && errorCode === ALREADY_APPLIED_CODE ? (
      <>
        {applyError} <Link to="/my-applications">Open my applications</Link>
      </>
    ) : (
      applyError
    );

  return (
    <>
      <SectionHead
        eyebrow="Open for admission"
        title="Classes and shifts"
        lead="Seat counts refresh on their own every few seconds."
        actions={
          <>
            <LiveBadge label={`Live · every ${CLASSES_REFETCH_MS / 1000}s`} />
            <ButtonLink to="/classes/new" variant="ghost" size="sm">
              <Plus /> New class
            </ButtonLink>
          </>
        }
      />
      {isLoading && <LoadingSpinner label="Loading classes…" />}
      {error && (
        <ErrorMessage
          className="mb-4"
          message={hasData ? `Couldn't refresh seat counts. ${error}` : error}
        />
      )}
      {hasData && classes.length === 0 && (
        <EmptyState>
          No classes yet. <Link to="/classes/new">Create the first class</Link> to open admission.
        </EmptyState>
      )}
      {pageClasses.length > 0 && (
        <ClassGrid
          classes={pageClasses}
          hasStudentId={hasStudentId}
          applyingClassId={applyingClassId}
          isApplying={isApplying}
          errorClassId={applyError ? applyingClassId : null}
          error={applyMessage}
          onApply={applyToClass}
        />
      )}
      <Pagination
        offset={offset}
        limit={PAGE_SIZE}
        total={classes.length}
        noun="classes"
        onOffsetChange={(next) => setSearchParams(next > 0 ? { offset: String(next) } : {})}
      />
    </>
  );
}
