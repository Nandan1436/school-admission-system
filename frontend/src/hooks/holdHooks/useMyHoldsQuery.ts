import { useQuery } from "@tanstack/react-query";
import { HOLD_REFETCH_MS } from "../../constants";
import { getMyHolds } from "../../services/holdService";

export function useMyHoldsQuery(studentId: string | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-holds", studentId],
    queryFn: getMyHolds,
    enabled: Boolean(studentId),
    refetchInterval: HOLD_REFETCH_MS,
  });

  return {
    holds: data ?? [],
    isLoading: Boolean(studentId) && isLoading,
    error: error ? error.message : null,
  };
}
