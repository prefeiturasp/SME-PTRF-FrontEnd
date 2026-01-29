import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { deleteRecursoProprioPaa } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { useMutationConfirmavel } from "../../../../../../../hooks/Globais/useMutationConfirmavel";

export const useDeleteRecursoProprio = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const mutationDelete = useMutationConfirmavel({
    mutationFn: (uuid) => deleteRecursoProprioPaa(uuid),
    dispatch,
    confirmField: "confirmar_limpeza_prioridades_paa",
    modalConfig: {
      title: "Alteração das prioridades cadastradas",
      isDanger: true,
    },
    mutationOptions: {
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
            "Houve um erro ao tentar excluir recurso próprio.",
          );
        }
      },
    },
  });

  return { mutationDelete };
};
