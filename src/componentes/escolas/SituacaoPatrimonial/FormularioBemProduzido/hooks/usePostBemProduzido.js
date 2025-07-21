import { useMutation } from "@tanstack/react-query";
import { postBemProduzido } from "../../../../../services/escolas/BensProduzidos.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const usePostBemProduzido = () => {
  const mutationPost = useMutation({
    mutationFn: ({ payload }) => postBemProduzido(payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("Bem produzido criado com sucesso.");
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao criar bem produzido.");
    },
  });

  return { mutationPost };
};
