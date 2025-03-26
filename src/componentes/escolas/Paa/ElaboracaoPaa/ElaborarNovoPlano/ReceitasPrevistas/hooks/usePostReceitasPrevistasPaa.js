import { useMutation } from "@tanstack/react-query";
import { postReceitasPrevistasPaa } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePostReceitasPrevistasPaa = (onClose) => {
  const mutationPost = useMutation({
    mutationFn: ({ payload }) => postReceitasPrevistasPaa(payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("Recurso criado com sucesso.");
      onClose && onClose();
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao criar recurso.");
    },
  });

  return { mutationPost };
};
