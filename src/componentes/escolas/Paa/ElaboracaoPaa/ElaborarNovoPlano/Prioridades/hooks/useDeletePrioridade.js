import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePrioridade } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const useDeletePrioridade = (onClose) => {
  const queryClient = useQueryClient();
  const mutationDelete = useMutation({
    mutationFn: ({ uuid }) => deletePrioridade(uuid),
    onSuccess: () => {
      toastCustom.ToastCustomSuccess("Prioridade removida com sucesso.");
      queryClient.invalidateQueries(["prioridades"]);
      onClose && onClose();
    },
    onError: (e) => {
      toastCustom.ToastCustomError(e?.response?.data?.mensagem || "Houve um erro ao remover a prioridade.");
    },
  });

  return { mutationDelete };
};
