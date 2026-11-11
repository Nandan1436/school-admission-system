import type { HoldStatus } from "../interfaces";

export const HOLD_STATUS_LABELS: Record<HoldStatus, string> = {
  HELD: "Seat held",
  CONFIRMED: "Admission confirmed",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

export const HOLD_STATUS_COLORS: Record<HoldStatus, string> = {
  HELD: "var(--accent)",
  CONFIRMED: "var(--down)",
  EXPIRED: "var(--fg-faint)",
  CANCELLED: "var(--up)",
};

export const ALREADY_APPLIED_CODE = "ALREADY_APPLIED";
