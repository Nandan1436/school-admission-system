import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { STUDENT_STORAGE_KEY } from "../constants";
import { isValidStudentId } from "../utils/studentValidation";

interface StudentContextValue {
  studentId: string | null;
  hasStudentId: boolean;
  setStudentId: (studentId: string) => void;
  clearStudentId: () => void;
}

const StudentContext = createContext<StudentContextValue | undefined>(undefined);

function readInitialStudentId(): string | null {
  try {
    const stored = window.localStorage.getItem(STUDENT_STORAGE_KEY);
    return isValidStudentId(stored) ? stored : null;
  } catch {
    return null;
  }
}

function writeStudentId(studentId: string | null) {
  try {
    if (studentId) window.localStorage.setItem(STUDENT_STORAGE_KEY, studentId);
    else window.localStorage.removeItem(STUDENT_STORAGE_KEY);
  } catch {
    return;
  }
}

export function StudentProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [studentId, setStudentIdState] = useState<string | null>(readInitialStudentId);

  const applyStudentId = useCallback(
    (next: string | null) => {
      writeStudentId(next);
      setStudentIdState(next);
      queryClient.removeQueries({ queryKey: ["my-holds"] });
    },
    [queryClient],
  );

  const value = useMemo<StudentContextValue>(
    () => ({
      studentId,
      hasStudentId: studentId !== null,
      setStudentId: (next: string) => applyStudentId(next.trim()),
      clearStudentId: () => applyStudentId(null),
    }),
    [studentId, applyStudentId],
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent(): StudentContextValue {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used within a StudentProvider");
  return ctx;
}
