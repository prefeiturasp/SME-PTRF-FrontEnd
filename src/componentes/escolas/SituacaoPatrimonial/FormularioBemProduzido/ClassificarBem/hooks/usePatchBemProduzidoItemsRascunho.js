import { useMutation } from "@tanstack/react-query";
import { patchCadastrarBem } from "../../../../../../services/escolas/BensProduzidos.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchBemProduzidoItemsRascunho = () => {
  const mutationPatch = useMutation({
    mutationFn: ({ uuid, payload }) =>
      patchCadastrarBem(uuid, { ...payload, completar_status: false }),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess(
        "Rascunho do bem produzido salvo com sucesso."
      );
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao salvar rascunho.");
    },
  });

  return { mutationPatch };
};
