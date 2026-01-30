import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { patchReceitasPrevistasOutrosRecursosPeriodo } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { useMutationConfirmavel } from "../../../../../../../hooks/Globais/useMutationConfirmavel";

export const usePatchReceitasPrevistasOutrosRecursosPeriodo = (onClose) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const mutationPatch = useMutationConfirmavel({
    mutationFn: ({ uuid, payload }) =>
      patchReceitasPrevistasOutrosRecursosPeriodo(uuid, payload),
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

  return { mutationPatch };
};
