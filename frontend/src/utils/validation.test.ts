import { describe, expect, it } from "vitest";
import { CreateClassSchema, buildClassName } from "./classValidation";
import { StudentIdSchema, isValidStudentId } from "./studentValidation";

describe("StudentIdSchema", () => {
  it("accepts exactly 17 digits", () => {
    expect(isValidStudentId("20152691234567890")).toBe(true);
  });

  it.each(["", "2015269123456789", "201526912345678901", "2015269123456789a"])("rejects %j", (value) => {
    expect(StudentIdSchema.safeParse(value).success).toBe(false);
  });
});

describe("CreateClassSchema", () => {
  it("parses seats into a number", () => {
    const result = CreateClassSchema.parse({ grade: "Class 6", shift: "Morning Shift", totalSeats: "120" });
    expect(result.totalSeats).toBe(120);
  });

  it.each(["0", "-1", "1.5", "10001", "abc", ""])("rejects %j seats", (totalSeats) => {
    const result = CreateClassSchema.safeParse({ grade: "Class 6", shift: "Morning Shift", totalSeats });
    expect(result.success).toBe(false);
  });

  it("requires a class and a shift", () => {
    const result = CreateClassSchema.safeParse({ grade: "", shift: "", totalSeats: "10" });
    expect(result.success).toBe(false);
  });

  it("builds the class name the backend expects", () => {
    expect(buildClassName("Class 6", "Morning Shift")).toBe("Class 6 – Morning Shift");
  });
});
