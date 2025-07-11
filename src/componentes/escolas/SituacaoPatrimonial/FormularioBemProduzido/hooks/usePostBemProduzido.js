import { useMutation } from "@tanstack/react-query";
import { postBemProduzido } from "../../../../../services/escolas/BensProduzidos.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const usePostBemProduzido = () => {
  const mutationPost = useMutation({
    mutationFn: ({ payload }) => postBemProduzido(payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess(
        "Rascunho do bem produzido salvo com sucesso."
      );
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao salvar rascunho.");
    },
  });

  return { mutationPost };
};
