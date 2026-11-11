import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ClassSummary } from "../../interfaces";
import { ClassCard } from "./ClassCard";

const OPEN_CLASS: ClassSummary = {
  id: "c_123",
  name: "Class 6 – Morning Shift",
  totalSeats: 120,
  heldSeats: 15,
  confirmedSeats: 80,
  availableSeats: 25,
};

function renderCard(classSummary: ClassSummary, hasStudentId = true) {
  const onApply = vi.fn();
  render(
    <ClassCard
      classSummary={classSummary}
      hasStudentId={hasStudentId}
      isApplying={false}
      isBusy={false}
      onApply={onApply}
    />,
  );
  return { onApply };
}

describe("ClassCard", () => {
  it("shows every seat count", () => {
    renderCard(OPEN_CLASS);
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("applies to the class when the student clicks Apply", async () => {
    const { onApply } = renderCard(OPEN_CLASS);
    await userEvent.click(screen.getByRole("button", { name: /apply/i }));
    expect(onApply).toHaveBeenCalledWith("c_123");
  });

  it("disables Apply when the class is full", () => {
    renderCard({ ...OPEN_CLASS, heldSeats: 40, availableSeats: 0 });
    expect(screen.getByRole("button", { name: /no seats left/i })).toBeDisabled();
  });

  it("disables Apply until a birth registration number is entered", () => {
    renderCard(OPEN_CLASS, false);
    expect(screen.getByRole("button", { name: /apply/i })).toBeDisabled();
    expect(screen.getByText(/enter a birth registration no/i)).toBeInTheDocument();
  });
});
