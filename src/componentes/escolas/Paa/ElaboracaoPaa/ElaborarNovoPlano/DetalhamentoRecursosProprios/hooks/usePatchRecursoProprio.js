import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { patchRecursoProprioPaa } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { useMutationConfirmavel } from "../../../../../../../hooks/Globais/useMutationConfirmavel";

export const usePatchRecursoProprio = (handleCloseFieldsToEdit) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const mutationPatch = useMutationConfirmavel({
    mutationFn: ({ uuid, payload }) => patchRecursoProprioPaa(uuid, payload),
    dispatch,
    confirmField: "confirmar_limpeza_prioridades_paa",
    modalConfig: {
      title: "Alteração das prioridades cadastradas",
      isDanger: true,
    },
    mutationOptions: {
      onSuccess: (data) => {
        toastCustom.ToastCustomSuccess("Recurso Próprio editado com sucesso.");
        queryClient.invalidateQueries(["recursos-proprios"]);
        queryClient.invalidateQueries(["totalizador-recurso-proprio"]);
        handleCloseFieldsToEdit(data);
      },
      onError: () => {
        toastCustom.ToastCustomError("Houve um erro ao editar recurso.");
      },
    },
  });

  return { mutationPatch };
};
