import type { HoldStatus } from "../interfaces";

export function getRemainingMs(expiresAt: string, now: number): number {
  const expiresAtMs = Date.parse(expiresAt);
  if (Number.isNaN(expiresAtMs)) return 0;
  return Math.max(0, expiresAtMs - now);
}

export function getDisplayStatus(status: HoldStatus, expiresAt: string, now: number): HoldStatus {
  if (status === "HELD" && getRemainingMs(expiresAt, now) <= 0) return "EXPIRED";
  return status;
}

export function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}
