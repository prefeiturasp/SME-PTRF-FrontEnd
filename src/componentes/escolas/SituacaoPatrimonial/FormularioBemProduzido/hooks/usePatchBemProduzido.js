import { useMutation } from "@tanstack/react-query";
import { patchBemProduzido } from "../../../../../services/escolas/BensProduzidos.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const usePatchBemProduzido = () => {
  const mutationPatch = useMutation({
    mutationFn: ({ uuid, payload }) => patchBemProduzido(uuid, payload),
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
