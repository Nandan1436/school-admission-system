import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateClassRequest, CreateClassResponse } from "../../interfaces";
import { createClass } from "../../services/classService";

export function useCreateClass(onCreated?: (created: CreateClassResponse) => void) {
  const queryClient = useQueryClient();
  const { mutate, isPending, error, data, reset } = useMutation({
    mutationFn: createClass,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      onCreated?.(created);
    },
  });

  return {
    createClass: (request: CreateClassRequest) => mutate(request),
    isCreating: isPending,
    error: error ? error.message : null,
    created: data ?? null,
    resetResult: reset,
  };
}
