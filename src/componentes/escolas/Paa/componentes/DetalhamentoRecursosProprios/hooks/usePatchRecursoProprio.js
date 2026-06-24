import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { patchRecursoProprioPaa } from "../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useMutationConfirmavel } from "../../../../../../hooks/Globais/useMutationConfirmavel";
import { getErrorMessage } from "../../../../../../utils/obtemMsgErroAxios";


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
        queryClient.invalidateQueries({ queryKey: ["recursos-proprios"] });
        queryClient.invalidateQueries({ queryKey: ["totalizador-recurso-proprio"] });
        // Quando Volta via recurso de location para Atividades previstas, o hook não dispara automaticamente
        queryClient.refetchQueries({ queryKey: ["recursos-proprios-previstos"], exact: false });
        handleCloseFieldsToEdit(data);
      },
      onError: (err) => {
        const mensagemErro = getErrorMessage(err, "Houve um erro ao editar recurso.");
        toastCustom.ToastCustomError(mensagemErro);       
      },
    },
  });

  return { mutationPatch };
};
