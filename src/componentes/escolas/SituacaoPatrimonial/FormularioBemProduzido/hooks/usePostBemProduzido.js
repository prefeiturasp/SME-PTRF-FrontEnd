import { useMutation } from "@tanstack/react-query";
import { postBemProduzido } from "../../../../../services/escolas/BensProduzidos.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const usePostBemProduzido = (navigate) => {
  const mutationPost = useMutation({
    mutationFn: ({ payload }) => postBemProduzido(payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("Bem Produzido criado com successo");
      navigate("/lista-situacao-patrimonial");
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao criar bem produzido.");
    },
  });

  return { mutationPost };
};
