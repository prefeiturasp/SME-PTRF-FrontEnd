import { useMutation } from "@tanstack/react-query";
import { deleteBemProduzido } from "../../../../../services/escolas/BensProduzidos.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const useDeleteBemProduzido = () => {
  const mutationDelete = useMutation({
    mutationFn: (uuid) => deleteBemProduzido(uuid),

    onSuccess: () => {
      toastCustom.ToastCustomSuccess(
        "Bem produzido deletado com sucesso."
      );
    },

    onError: (error) => {
      toastCustom.ToastCustomError(
        error?.response?.data?.mensagem || "Houve um erro ao excluir o bem produzido."
      );
    },
  });

  return { mutationDelete };
};
