import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postPrioridade } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePostPrioridade = (onClose) => {
  const mutationPost = useMutation({
    mutationFn: ({ payload }) => postPrioridade(payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("Prioridade criada com sucesso.");
      onClose && onClose();
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao criar a prioridade.");
    },
  });

  return { mutationPost };
};
