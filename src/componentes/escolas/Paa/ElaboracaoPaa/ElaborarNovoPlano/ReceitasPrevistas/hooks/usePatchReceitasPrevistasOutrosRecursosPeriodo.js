import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchReceitasPrevistasOutrosRecursosPeriodo } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePatchReceitasPrevistasOutrosRecursosPeriodo = (onClose) => {
  const queryClient = useQueryClient();

  const mutationPatch = useMutation({
    mutationFn: ({ uuid, payload }) =>
      patchReceitasPrevistasOutrosRecursosPeriodo(uuid, payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("Recurso editado com sucesso.");
      queryClient.invalidateQueries(
        "receitas-previstas-outros-recursos-periodo"
      );
      onClose && onClose();
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao editar recurso.");
    },
  });

  return { mutationPatch };
};
