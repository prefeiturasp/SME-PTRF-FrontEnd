import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchReceitasPrevistasPaa } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePatchReceitasPrevistasPaa = (onClose) => {
  const queryClient = useQueryClient();

  const mutationPatch = useMutation({
    mutationFn: ({ uuid, payload }) => patchReceitasPrevistasPaa(uuid, payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("Recurso editado com sucesso.");
      queryClient.invalidateQueries(["acoes-associacao"]);
      onClose && onClose();
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao editar recurso.");
    },
  });

  return { mutationPatch };
};
