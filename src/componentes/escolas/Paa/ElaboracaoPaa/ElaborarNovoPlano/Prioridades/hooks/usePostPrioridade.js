import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postPrioridade, postDuplicarPrioridade } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePostPrioridade = (onClose) => {
  const queryClient = useQueryClient();
  const mutationPost = useMutation({
    mutationFn: ({ payload }) => postPrioridade(payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("Prioridade criada com sucesso.");
      queryClient.invalidateQueries(["prioridades"]);
      queryClient.invalidateQueries(["prioridades-resumo"]);
      onClose && onClose();
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao criar a prioridade.");
    },
  });

  return { mutationPost };
};

export const usePostDuplicarPrioridade = () => {
  const queryClient = useQueryClient();
  const mutationPost = useMutation({
    mutationFn: ({ uuid }) => postDuplicarPrioridade(uuid),
    onSuccess: () => {
      toastCustom.ToastCustomSuccess("Prioridade duplicada com sucesso.");
      queryClient.invalidateQueries(["prioridades"]);
    },
    onError: (e) => {
      toastCustom.ToastCustomError(e?.response?.data?.mensagem || "Houve um erro ao duplicar prioridade.");
    },
  });

  return { mutationPost };
};
