import { useMutation } from "@tanstack/react-query";
import { patchCadastrarBem } from "../../../../../../services/escolas/BensProduzidos.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchBemProduzidoItems = () => {
  const mutationPatch = useMutation({
    mutationFn: ({ uuid, payload }) =>
      patchCadastrarBem(uuid, { ...payload, completar_status: true }),
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

  return { mutationPatch };
};
