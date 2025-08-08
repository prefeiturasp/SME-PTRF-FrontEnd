import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchBemProduzidoRascunho } from "../../../../../services/escolas/BensProduzidos.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const usePatchBemProduzidoRascunho = () => {
  const queryClient = useQueryClient();
  const mutationPatch = useMutation({
    mutationFn: ({ uuid, payload }) => patchBemProduzidoRascunho(uuid, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["bem-produzido-detail", data.uuid]);
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
