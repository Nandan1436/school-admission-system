import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { HoldStatus } from "../../interfaces";
import { HoldDetailCard } from "./HoldDetailCard";

function renderCard(status: HoldStatus, overrides: { hasStudentId?: boolean; remainingMs?: number } = {}) {
  const onPay = vi.fn();
  const onCancel = vi.fn();
  render(
    <MemoryRouter>
      <HoldDetailCard
        holdId="h_789"
        className="Class 6 – Morning Shift"
        status={status}
        expiresAt="2026-11-01T04:10:00Z"
        remainingMs={overrides.remainingMs ?? 90_000}
        hasStudentId={overrides.hasStudentId ?? true}
        isPaying={false}
        isCancelling={false}
        error={null}
        onPay={onPay}
        onCancel={onCancel}
      />
    </MemoryRouter>,
  );
  return { onPay, onCancel };
}

describe("HoldDetailCard", () => {
  it("shows the countdown and lets the student pay while the seat is held", async () => {
    const { onPay } = renderCard("HELD");
    expect(screen.getByRole("timer")).toHaveTextContent("01:30");
    const payButton = screen.getByRole("button", { name: /pay admission fee/i });
    expect(payButton).toBeEnabled();
    await userEvent.click(payButton);
    expect(onPay).toHaveBeenCalledOnce();
  });

  it("shows EXPIRED and hides the pay button once time runs out", () => {
    renderCard("EXPIRED", { remainingMs: 0 });
    expect(screen.getByText("Expired")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /pay admission fee/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  });

  it("shows a confirmation and no actions once admission is confirmed", () => {
    renderCard("CONFIRMED");
    expect(screen.getByText("Admission confirmed")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("disables pay and cancel when no student number is entered", () => {
    renderCard("HELD", { hasStudentId: false });
    expect(screen.getByRole("button", { name: /pay admission fee/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });
});
