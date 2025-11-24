import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePrioridadesEmLote } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const useDeletePrioridadesEmLote = (onClose) => {
  const queryClient = useQueryClient();
  const mutationDeleteEmLote = useMutation({
    mutationFn: ({ payload }) => deletePrioridadesEmLote(payload),
    onSuccess: (data) => {
      if (data.erros && data.erros.length > 0) {
        toastCustom.ToastCustomWarning(data.mensagem);
      } else {
        toastCustom.ToastCustomSuccess("Prioridades removidas com sucesso.");
      }
      queryClient.invalidateQueries("prioridades");
      queryClient.invalidateQueries("prioridades-resumo");
      onClose && onClose();
    },
    onError: (e) => {
      toastCustom.ToastCustomError(e?.response?.data?.mensagem || "Houve um erro ao remover as prioridades.");
    },
  });

  return { mutationDeleteEmLote };
}; 