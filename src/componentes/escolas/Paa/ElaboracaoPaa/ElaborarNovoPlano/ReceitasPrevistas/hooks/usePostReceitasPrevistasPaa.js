import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { postReceitasPrevistasPaa } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { useMutationConfirmavel } from "../../../../../../../hooks/Globais/useMutationConfirmavel";

export const usePostReceitasPrevistasPaa = (onClose) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const mutationPost = useMutationConfirmavel({
    mutationFn: ({ payload }) => postReceitasPrevistasPaa(payload),
    dispatch,
    confirmField: "confirmar_limpeza_prioridades_paa",
    modalConfig: {
      title: "Alteração das prioridades cadastradas",
      isDanger: true,
    },
    mutationOptions: {
      onSuccess: () => {
        toastCustom.ToastCustomSuccess("Recurso criado com sucesso.");
        queryClient.invalidateQueries(["receitas-previstas-paa"]);
        onClose && onClose();
      },
      onError: () => {
        toastCustom.ToastCustomError("Houve um erro ao criar recurso.");
      },
    },
  });

  return { mutationPost };
};
