import { useQuery } from "@tanstack/react-query";
import { getClassOptions } from "../../services/classService";

export function useClassOptionsQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["class-options"],
    queryFn: getClassOptions,
    staleTime: Infinity,
  });

  return {
    grades: data?.grades ?? [],
    shifts: data?.shifts ?? [],
    isLoading,
    error: error ? error.message : null,
  };
}
