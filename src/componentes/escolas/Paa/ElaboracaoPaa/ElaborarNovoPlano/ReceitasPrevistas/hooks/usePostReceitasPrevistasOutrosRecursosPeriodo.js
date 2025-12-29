import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postReceitasPrevistasOutrosRecursosPeriodo } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePostReceitasPrevistasOutrosRecursos = (onClose) => {
  const queryClient = useQueryClient();
  const mutationPost = useMutation({
    mutationFn: ({ payload }) =>
      postReceitasPrevistasOutrosRecursosPeriodo(payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("Recurso criado com sucesso.");
      queryClient.invalidateQueries(
        "receitas-previstas-outros-recursos-periodo"
      );
      onClose && onClose();
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao criar recurso.");
    },
  });

  return { mutationPost };
};
