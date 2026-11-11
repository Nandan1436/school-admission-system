import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateHold() {
  const queryClient = useQueryClient();

  return useCallback(
    (holdId?: string, classId?: string) => {
      if (holdId) queryClient.invalidateQueries({ queryKey: ["hold", holdId] });
      if (classId) queryClient.invalidateQueries({ queryKey: ["class", classId] });
      queryClient.invalidateQueries({ queryKey: ["my-holds"] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    [queryClient],
  );
}
