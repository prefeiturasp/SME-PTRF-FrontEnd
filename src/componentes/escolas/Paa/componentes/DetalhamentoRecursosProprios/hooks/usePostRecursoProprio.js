import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { postRecursoProprioPaa } from "../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useMutationConfirmavel } from "../../../../../../hooks/Globais/useMutationConfirmavel";

export const usePostRecursoProprio = (handleCloseFieldsToEdit) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const mutationPost = useMutationConfirmavel({
    mutationFn: ({ payload }) => postRecursoProprioPaa(payload),
    dispatch,
    confirmField: "confirmar_limpeza_prioridades_paa",
    modalConfig: {
      title: "Alteração das prioridades cadastradas",
      isDanger: true,
    },
    mutationOptions: {
      onSuccess: (data) => {
        toastCustom.ToastCustomSuccess("Recurso Próprio criado com sucesso.");
        queryClient.invalidateQueries({ queryKey: ["recursos-proprios"] });
        queryClient.invalidateQueries({ queryKey: ["totalizador-recurso-proprio"] });
        handleCloseFieldsToEdit(data);
      },
      onError: () => {
        toastCustom.ToastCustomError("Houve um erro ao criar recurso.");
      },
    },
  });

  return { mutationPost };
};
