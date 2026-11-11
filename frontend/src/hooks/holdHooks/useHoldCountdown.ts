import { useEffect, useRef } from "react";
import type { HoldStatus } from "../../interfaces";
import { getDisplayStatus, getRemainingMs } from "../../utils/holdStatus";
import { useNow } from "../useNow";
import { useInvalidateHold } from "./useInvalidateHold";

interface CountdownTarget {
  holdId: string;
  classId: string;
  status: HoldStatus;
  expiresAt: string;
}

export function useHoldCountdown(target: CountdownTarget | undefined) {
  const now = useNow();
  const invalidateHold = useInvalidateHold();
  const notifiedHoldId = useRef<string | null>(null);

  const displayStatus = target ? getDisplayStatus(target.status, target.expiresAt, now) : null;
  const remainingMs = target && displayStatus === "HELD" ? getRemainingMs(target.expiresAt, now) : 0;
  const hasJustExpired = target?.status === "HELD" && displayStatus === "EXPIRED";

  useEffect(() => {
    if (!target || !hasJustExpired || notifiedHoldId.current === target.holdId) return;
    notifiedHoldId.current = target.holdId;
    invalidateHold(target.holdId, target.classId);
  }, [target, hasJustExpired, invalidateHold]);

  return { displayStatus, remainingMs };
}
