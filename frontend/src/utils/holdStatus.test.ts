import { describe, expect, it } from "vitest";
import { formatCountdown, getDisplayStatus, getRemainingMs } from "./holdStatus";

const NOW = Date.parse("2026-11-01T04:00:00Z");

describe("getRemainingMs", () => {
  it("returns the time left until expiry", () => {
    expect(getRemainingMs("2026-11-01T04:10:00Z", NOW)).toBe(600_000);
  });

  it("never goes below zero", () => {
    expect(getRemainingMs("2026-11-01T03:59:00Z", NOW)).toBe(0);
  });

  it("treats an invalid date as expired", () => {
    expect(getRemainingMs("not-a-date", NOW)).toBe(0);
  });
});

describe("getDisplayStatus", () => {
  it("keeps HELD while time is left", () => {
    expect(getDisplayStatus("HELD", "2026-11-01T04:00:01Z", NOW)).toBe("HELD");
  });

  it("shows EXPIRED once a HELD application runs out of time", () => {
    expect(getDisplayStatus("HELD", "2026-11-01T04:00:00Z", NOW)).toBe("EXPIRED");
  });

  it("never turns a confirmed admission into EXPIRED", () => {
    expect(getDisplayStatus("CONFIRMED", "2026-11-01T03:00:00Z", NOW)).toBe("CONFIRMED");
  });
});

describe("formatCountdown", () => {
  it("formats minutes and seconds", () => {
    expect(formatCountdown(600_000)).toBe("10:00");
    expect(formatCountdown(65_000)).toBe("01:05");
  });

  it("rounds partial seconds up so the timer reaches 00:00 only at expiry", () => {
    expect(formatCountdown(500)).toBe("00:01");
    expect(formatCountdown(0)).toBe("00:00");
  });

  it("adds hours for long holds", () => {
    expect(formatCountdown(3_661_000)).toBe("1:01:01");
  });
});
