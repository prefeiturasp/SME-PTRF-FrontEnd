import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postContasAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useContasDasAssociacoesContext } from "./useContasDasAssociacoesContext";

export const usePostContaAssociacao = () => {
    const queryClient = useQueryClient();
    const { setBloquearBtnSalvarForm, handleCloseModalForm } = useContasDasAssociacoesContext();

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postContasAssociacoes(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['contas-associacoes']).then();
            handleCloseModalForm();
            toastCustom.ToastCustomSuccess(
                "Inclusão de conta da associação realizada com sucesso.",
                "A conta da associação foi adicionada ao sistema com sucesso."
            );
        },
        onError: (error) => {
            if (error?.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError("Erro ao criar conta de associação", error.response.data.non_field_errors);
            } else {
                toastCustom.ToastCustomError("Erro ao criar conta de associação", "Tente novamente.");
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return {mutationPost};
}
