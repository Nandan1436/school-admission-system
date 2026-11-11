import { LayoutGrid } from "lucide-react";
import { PageHead } from "../components/layout";
import { ButtonLink } from "../components/ui";
import { MyHoldsContainer } from "../containers";

export function MyApplications() {
  return (
    <div style={{ animation: "riseIn .28s ease both" }}>
      <PageHead
        eyebrow="Student"
        title="My applications"
        lead="Every application made with this birth registration number, with its current status."
        actions={
          <ButtonLink to="/" variant="ghost" size="sm">
            <LayoutGrid /> Browse classes
          </ButtonLink>
        }
      />
      <MyHoldsContainer />
    </div>
  );
}
