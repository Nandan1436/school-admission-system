import { z } from "zod";

export const STUDENT_ID_LENGTH = 17;

export const StudentIdSchema = z
  .string()
  .trim()
  .min(1, "Enter the student's birth registration number")
  .regex(/^\d+$/, "Use digits only")
  .length(STUDENT_ID_LENGTH, `Birth registration number must be exactly ${STUDENT_ID_LENGTH} digits`);

export const StudentFormSchema = z.object({
  studentId: StudentIdSchema,
});

export type StudentForm = z.infer<typeof StudentFormSchema>;

export function isValidStudentId(value: string | null | undefined): value is string {
  return StudentIdSchema.safeParse(value ?? "").success;
}
