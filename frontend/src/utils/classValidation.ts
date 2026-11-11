import { z } from "zod";

export const MAX_TOTAL_SEATS = 10_000;

export const CreateClassSchema = z.object({
  grade: z.string().min(1, "Choose a class"),
  shift: z.string().min(1, "Choose a shift"),
  totalSeats: z
    .string()
    .trim()
    .min(1, "Enter the number of seats")
    .regex(/^\d+$/, "Seats must be a whole number")
    .transform(Number)
    .pipe(
      z
        .number()
        .int()
        .min(1, "There must be at least 1 seat")
        .max(MAX_TOTAL_SEATS, `Seats cannot be more than ${MAX_TOTAL_SEATS.toLocaleString()}`),
    ),
});

export type CreateClassForm = z.input<typeof CreateClassSchema>;

export function buildClassName(grade: string, shift: string): string {
  return `${grade} – ${shift}`;
}
