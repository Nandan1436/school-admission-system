import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageHead } from "../components/layout";
import { ButtonLink } from "../components/ui";
import { HoldDetailContainer } from "../containers";

export function Application() {
  const { holdId = "" } = useParams();

  return (
    <div style={{ animation: "riseIn .28s ease both" }}>
      <PageHead
        eyebrow="Application"
        title="Admission application"
        lead="The status and timer update on their own. No need to reload the page."
        actions={
          <ButtonLink to="/my-applications" variant="ghost" size="sm">
            <ArrowLeft /> My applications
          </ButtonLink>
        }
      />
      <HoldDetailContainer key={holdId} holdId={holdId} />
    </div>
  );
}
