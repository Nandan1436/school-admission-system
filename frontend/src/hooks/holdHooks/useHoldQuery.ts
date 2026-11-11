import { useQuery } from "@tanstack/react-query";
import { HOLD_REFETCH_MS } from "../../constants";
import { getHoldById } from "../../services/holdService";

export function useHoldQuery(holdId: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["hold", holdId],
    queryFn: () => getHoldById(holdId!),
    enabled: Boolean(holdId),
    refetchInterval: (query) => (query.state.data?.status === "HELD" ? HOLD_REFETCH_MS : false),
    retry: false,
  });

  return {
    hold: data,
    isLoading,
    error: error ? error.message : null,
  };
}
