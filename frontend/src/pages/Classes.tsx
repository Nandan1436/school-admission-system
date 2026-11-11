import { PageHead } from "../components/layout";
import { ClassListContainer, ClassStatsContainer } from "../containers";

export function Classes() {
  return (
    <div style={{ animation: "riseIn .28s ease both" }}>
      <PageHead
        eyebrow="Admission"
        title="Classes"
        lead="Seats are given first come, first served. Applying holds a seat for a limited time; pay the admission fee before the timer runs out to confirm it."
      />
      <ClassStatsContainer />
      <ClassListContainer />
    </div>
  );
}
