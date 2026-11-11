import { useQuery } from "@tanstack/react-query";
import { CLASSES_REFETCH_MS } from "../../constants";
import { getClassById } from "../../services/classService";

export function useClassQuery(classId: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["class", classId],
    queryFn: () => getClassById(classId!),
    enabled: Boolean(classId),
    refetchInterval: CLASSES_REFETCH_MS,
  });

  return {
    classSummary: data,
    isLoading,
    error: error ? error.message : null,
  };
}
