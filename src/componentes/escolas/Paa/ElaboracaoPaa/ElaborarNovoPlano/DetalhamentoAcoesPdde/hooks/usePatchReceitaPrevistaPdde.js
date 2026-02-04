import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { patchReceitaPrevistaPDDE } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { useMutationConfirmavel } from "../../../../../../../hooks/Globais/useMutationConfirmavel";

export const usePatchReceitaPrevistaPdde = (setModalForm) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const mutationPatch = useMutationConfirmavel({
    mutationFn: ({ uuid, payload }) => patchReceitaPrevistaPDDE(uuid, payload),
    dispatch,
    confirmField: "confirmar_limpeza_prioridades_paa",
    modalConfig: {
      title: "Alteração das prioridades cadastradas",
      isDanger: true,
    },
    mutationOptions: {
      onSuccess: () => {
        queryClient.invalidateQueries(["acoes"]).then();
        setModalForm({ open: false });
        toastCustom.ToastCustomSuccess(
          "Sucesso",
          "Edição da Receita Prevista PDDE realizado com sucesso.",
        );
      },
      onError: () => {
        toastCustom.ToastCustomError(
          "Ops!",
          "Não foi possível atualizar a Receita Prevista PDDE",
        );
      },
    },
  });
  return { mutationPatch };
};
