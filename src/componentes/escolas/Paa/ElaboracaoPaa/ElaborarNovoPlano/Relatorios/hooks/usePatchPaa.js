import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchPaa } from "../../../../../../../services/escolas/Paa.service";

export const usePatchPaa = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    ({ uuid, payload }) => patchPaa(uuid, payload),
    {
      onSuccess: (data, variables) => {
        // Invalidar cache do PAA vigente para atualizar os dados
        queryClient.invalidateQueries(["paaVigente"]);
        
        // Invalidar cache do PAA específico se necessário
        queryClient.invalidateQueries(["paa", variables.uuid]);
      },
      onError: (error) => {
        console.error('Erro ao atualizar PAA:', error);
      },
    }
  );

  return {
    patchPaa: mutation.mutate,
    patchPaaAsync: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
};
