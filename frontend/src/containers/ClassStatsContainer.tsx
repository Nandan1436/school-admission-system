import { Armchair, CircleCheck, Hourglass, School } from "lucide-react";
import { StatCard } from "../components/ui";
import { useClassesQuery } from "../hooks";

export function ClassStatsContainer() {
  const { classes, hasData } = useClassesQuery();

  const totals = classes.reduce(
    (sum, c) => ({
      seats: sum.seats + c.totalSeats,
      held: sum.held + c.heldSeats,
      confirmed: sum.confirmed + c.confirmedSeats,
      available: sum.available + c.availableSeats,
    }),
    { seats: 0, held: 0, confirmed: 0, available: 0 },
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Classes"
        icon={<School />}
        color="var(--d1)"
        value={hasData ? classes.length : null}
        sub={hasData ? `${totals.seats.toLocaleString()} seats in total` : undefined}
      />
      <StatCard label="Available seats" icon={<Armchair />} color="var(--data)" value={hasData ? totals.available : null} />
      <StatCard label="Held right now" icon={<Hourglass />} color="var(--accent)" value={hasData ? totals.held : null} />
      <StatCard label="Confirmed" icon={<CircleCheck />} color="var(--down)" value={hasData ? totals.confirmed : null} />
    </div>
  );
}
