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
      onClose && onClose();
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao alterar a prioridade.");
    },
  });

  return { mutationPatch };
};
