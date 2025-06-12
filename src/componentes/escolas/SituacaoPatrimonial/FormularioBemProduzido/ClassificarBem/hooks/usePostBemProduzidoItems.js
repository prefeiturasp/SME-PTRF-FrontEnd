import { useMutation } from "@tanstack/react-query";
import { patchCadastrarBem } from "../../../../../../services/escolas/BensProduzidos.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostBemProduzidoItems = () => {
  const mutationPost = useMutation({
    mutationFn: ({ uuid, payload }) => patchCadastrarBem(uuid, payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess(
        "Sucesso!",
        "Bem produzido adicionado com sucesso."
      );
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao adicionar bem produzido.");
    },
  });

  return { mutationPost };
};
