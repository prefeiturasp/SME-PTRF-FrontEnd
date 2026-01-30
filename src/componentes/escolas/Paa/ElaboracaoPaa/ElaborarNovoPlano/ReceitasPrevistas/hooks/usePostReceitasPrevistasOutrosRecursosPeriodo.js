import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { postReceitasPrevistasOutrosRecursosPeriodo } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { useMutationConfirmavel } from "../../../../../../../hooks/Globais/useMutationConfirmavel";

export const usePostReceitasPrevistasOutrosRecursos = (onClose) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const mutationPost = useMutationConfirmavel({
    mutationFn: ({ payload }) =>
      postReceitasPrevistasOutrosRecursosPeriodo(payload),
    dispatch,
    confirmField: "confirmar_limpeza_prioridades_paa",
    modalConfig: {
      title: "Alteração das prioridades cadastradas",
      isDanger: true,
    },
    mutationOptions: {
      onSuccess: () => {
        toastCustom.ToastCustomSuccess("Recurso editado com sucesso.");
        queryClient.invalidateQueries(
          "receitas-previstas-outros-recursos-periodo",
        );
        onClose && onClose();
      },
      onError: () => {
        toastCustom.ToastCustomError("Houve um erro ao editar recurso.");
      },
    },
  });

  return { mutationPost };
};
