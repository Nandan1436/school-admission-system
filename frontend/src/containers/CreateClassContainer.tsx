import { Link } from "react-router-dom";
import { CreateClassForm } from "../components/classes";
import { Card, ErrorMessage, LoadingSpinner, SuccessMessage } from "../components/ui";
import { useClassOptionsQuery, useCreateClassForm } from "../hooks";

export function CreateClassContainer() {
  const { grades, shifts, isLoading, error } = useClassOptionsQuery();
  const { generalError, created, ...form } = useCreateClassForm();

  return (
    <Card
      title="New class"
      description="Each shift is its own class with its own seats, for example Class 6 – Morning Shift."
      className="max-w-[720px]"
    >
      {isLoading && <LoadingSpinner label="Loading class options…" />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error && (
        <div className="flex flex-col gap-4">
          {created && (
            <SuccessMessage
              message={
                <>
                  <strong>{created.name}</strong> was created with {created.totalSeats.toLocaleString()} seats.{" "}
                  <Link to="/">See all classes</Link>
                </>
              }
            />
          )}
          {generalError && <ErrorMessage message={generalError} />}
          <CreateClassForm grades={grades} shifts={shifts} {...form} />
        </div>
      )}
    </Card>
  );
}
