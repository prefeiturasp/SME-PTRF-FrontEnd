import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchPrioridade } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";


export const usePatchPrioridade = (onClose) => {
  const queryClient = useQueryClient();
  const mutationPatch = useMutation({
    mutationFn: ({ uuid, payload }) => patchPrioridade(uuid, payload),
    onSuccess: () => {
      toastCustom.ToastCustomSuccess("Prioridade alterada com sucesso.");
      queryClient.invalidateQueries(["prioridades"]);
      queryClient.invalidateQueries(["prioridades-resumo"]);
      onClose && onClose();
    },
    onError: (e) => {
      toastCustom.ToastCustomError(e?.response?.data?.mensagem || "Houve um erro ao alterar a prioridade.");
    },
  });

  return { mutationPatch };
};
