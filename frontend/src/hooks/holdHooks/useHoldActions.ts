import { useMutation } from "@tanstack/react-query";
import { cancelHold, confirmHold } from "../../services/holdService";
import { useInvalidateHold } from "./useInvalidateHold";

export function useHoldActions(holdId: string | undefined, classId: string | undefined) {
  const invalidateHold = useInvalidateHold();
  const settle = () => invalidateHold(holdId, classId);

  const confirm = useMutation({ mutationFn: confirmHold, onSettled: settle });
  const cancel = useMutation({ mutationFn: cancelHold, onSettled: settle });

  const activeError = confirm.error ?? cancel.error;

  return {
    payFee: () => {
      if (!holdId) return;
      cancel.reset();
      confirm.mutate(holdId);
    },
    cancelApplication: () => {
      if (!holdId) return;
      confirm.reset();
      cancel.mutate(holdId);
    },
    isPaying: confirm.isPending,
    isCancelling: cancel.isPending,
    error: activeError ? activeError.message : null,
  };
}
