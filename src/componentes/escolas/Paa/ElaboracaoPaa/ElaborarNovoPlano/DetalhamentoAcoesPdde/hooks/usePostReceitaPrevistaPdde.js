import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { postReceitaPrevistaPDDE } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { useMutationConfirmavel } from "../../../../../../../hooks/Globais/useMutationConfirmavel";

export const usePostReceitaPrevistaPdde = (setModalForm) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const mutationPost = useMutationConfirmavel({
    mutationFn: (payload) => postReceitaPrevistaPDDE(payload),
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
          "Criação de Receita Prevista PDDE realizada com sucesso.",
        );
      },
      onError: () => {
        toastCustom.ToastCustomError(
          "Ops!",
          "Não foi possível criar a Receita Prevista PDDE",
        );
      },
    },
  });

  return { mutationPost };
};
