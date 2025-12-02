import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchPaa } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePatchPaa = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ uuid, payload }) => {
      return await patchPaa(uuid, payload);
    },
    onSuccess: (data, variables) => {
      toastCustom.ToastCustomSuccess("Sucesso!", "Item salvo com sucesso!");

      // invalidar caches
      queryClient.invalidateQueries({ queryKey: ["paaVigente"] });
      queryClient.invalidateQueries({ queryKey: ["objetivosPaa"] });
      queryClient.invalidateQueries({ queryKey: ["paa", variables.uuid] });
    },
    onError: (error) => {
      console.error("Erro ao atualizar PAA:", error);
      toastCustom.ToastCustomError("Erro!", "Ops! Houve um erro ao tentar salvar.");
    },
  });

  return {
    patchPaa: mutation.mutate,
    patchPaaAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
};
