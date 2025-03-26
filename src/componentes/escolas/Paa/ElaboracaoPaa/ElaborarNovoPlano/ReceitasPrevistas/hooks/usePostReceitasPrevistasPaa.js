import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postReceitasPrevistasPaa } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePostReceitasPrevistasPaa = (onClose) => {
  const queryClient = useQueryClient();
  const mutationPost = useMutation({
    mutationFn: ({ payload }) => postReceitasPrevistasPaa(payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("Recurso criado com sucesso.");
      queryClient.invalidateQueries(["acoes-associacao"]);
      onClose && onClose();
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao criar recurso.");
    },
  });

  return { mutationPost };
};
