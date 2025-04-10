import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchRecursoProprioPaa } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePatchRecursoProprio = (handleCloseFieldsToEdit) => {
  const queryClient = useQueryClient();

  const mutationPatch = useMutation({
    mutationFn: ({ uuid, payload }) => patchRecursoProprioPaa(uuid, payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("Recurso Próprio editado com sucesso.");
      queryClient.invalidateQueries(["recursos-proprios"]);
      queryClient.invalidateQueries(["totalizador-recurso-proprio"]);
      handleCloseFieldsToEdit(data);
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao editar recurso.");
    },
  });

  return { mutationPatch };
};
