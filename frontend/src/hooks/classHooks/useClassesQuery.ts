import { useQuery } from "@tanstack/react-query";
import { CLASSES_REFETCH_MS } from "../../constants";
import { getClasses } from "../../services/classService";

export function useClassesQuery() {
  const { data, isLoading, error, dataUpdatedAt } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
    refetchInterval: CLASSES_REFETCH_MS,
  });

  return {
    classes: data ?? [],
    isLoading,
    error: error ? error.message : null,
    hasData: data !== undefined,
    updatedAt: dataUpdatedAt,
  };
}
