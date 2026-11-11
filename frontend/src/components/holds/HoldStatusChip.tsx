import { HOLD_STATUS_COLORS, HOLD_STATUS_LABELS } from "../../constants";
import { Chip } from "../ui";
import type { HoldStatus } from "../../interfaces";

export function HoldStatusChip({ status }: { status: HoldStatus }) {
  return (
    <Chip color={HOLD_STATUS_COLORS[status]} solid dot title={status}>
      {HOLD_STATUS_LABELS[status]}
    </Chip>
  );
}
