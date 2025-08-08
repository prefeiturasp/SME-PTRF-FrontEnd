import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchBemProduzido } from "../../../../../services/escolas/BensProduzidos.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const usePatchBemProduzido = () => {
  const queryClient = useQueryClient();
  const mutationPatch = useMutation({
    mutationFn: ({ uuid, payload }) => patchBemProduzido(uuid, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["bem-produzido-detail", data.uuid]);
      toastCustom.ToastCustomSuccess("Bem produzido salvo com sucesso.");
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao salvar bem produzido.");
    },
  });

  return { mutationPatch };
};
