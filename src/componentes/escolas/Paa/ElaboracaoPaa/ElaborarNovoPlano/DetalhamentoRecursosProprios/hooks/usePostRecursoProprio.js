import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRecursoProprioPaa } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePostRecursoProprio = (handleCloseFieldsToEdit) => {
  const queryClient = useQueryClient();

  const mutationPost = useMutation({
    mutationFn: ({ payload }) => postRecursoProprioPaa(payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("Recurso Próprio criado com sucesso.");
      queryClient.invalidateQueries(["recursos-proprios"]);
      queryClient.invalidateQueries(["totalizador-recurso-proprio"]);
      handleCloseFieldsToEdit(data);
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao criar recurso.");
    },
  });

  return { mutationPost };
};
