import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecursoProprioPaa } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const useDeleteRecursoProprio = () => {
  const queryClient = useQueryClient();

  const mutationDelete = useMutation({
    mutationFn: (uuid) => {
      return deleteRecursoProprioPaa(uuid);
    },
    onSuccess: () => {
      toastCustom.ToastCustomSuccess("Recurso próprio excluído com sucesso.");
      queryClient.invalidateQueries(["recursos-proprios"]);
      queryClient.invalidateQueries(["totalizador-recurso-proprio"]);
    },
    onError: (e) => {
      if (e.response && e.response.data && e.response.data.mensagem) {
        const errorMsg = e.response.data.mensagem;
        toastCustom.ToastCustomError(errorMsg);
      } else {
        toastCustom.ToastCustomError(
          "Houve um erro ao tentar excluir recurso próprio."
        );
      }
    },
  });

  return { mutationDelete };
};
