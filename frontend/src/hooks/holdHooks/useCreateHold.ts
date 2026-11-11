import { useMutation } from "@tanstack/react-query";
import type { CreateHoldResponse } from "../../interfaces";
import { createHold } from "../../services/holdService";
import { getErrorCode } from "../../utils/apiError";
import { useInvalidateHold } from "./useInvalidateHold";

export function useCreateHold(onCreated: (hold: CreateHoldResponse) => void) {
  const invalidateHold = useInvalidateHold();
  const { mutate, isPending, error, variables } = useMutation({
    mutationFn: createHold,
    onSuccess: (hold) => onCreated(hold),
    onSettled: (_hold, _error, classId) => invalidateHold(undefined, classId),
  });

  return {
    applyToClass: (classId: string) => mutate(classId),
    isApplying: isPending,
    applyingClassId: variables ?? null,
    error: error ? error.message : null,
    errorCode: getErrorCode(error),
  };
}
