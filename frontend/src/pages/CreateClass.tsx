import { PageHead } from "../components/layout";
import { CreateClassContainer } from "../containers";

export function CreateClass() {
  return (
    <div style={{ animation: "riseIn .28s ease both" }}>
      <PageHead
        eyebrow="School admin"
        title="Create class"
        lead="Open a class and shift for admission and set how many seats it has."
      />
      <CreateClassContainer />
    </div>
  );
}
