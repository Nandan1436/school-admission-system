import { StudentBar } from "../components/layout";
import { useStudentForm } from "../hooks";

export function StudentBarContainer() {
  const form = useStudentForm();
  return <StudentBar {...form} />;
}
