import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchContasAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useContasDasAssociacoesContext } from "./useContasDasAssociacoesContext";

export const usePatchContaAssociacao = () => {
    const queryClient = useQueryClient();
    const { setBloquearBtnSalvarForm, handleCloseModalForm } = useContasDasAssociacoesContext();

    const mutationPatch = useMutation({
        mutationFn: ({uuidContaAssociacao, payload}) => {
            return patchContasAssociacoes(uuidContaAssociacao, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['contas-associacoes']).then();
            handleCloseModalForm();
            toastCustom.ToastCustomSuccess(
                "Edição da conta da associação realizada com sucesso.",
                "A conta da associação foi editada no sistema com sucesso."
            );
        },
        onError: (error) => {
            if (error?.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError("Erro ao atualizar conta de associação", error.response.data.non_field_errors);
            } else {
                toastCustom.ToastCustomError("Erro ao atualizar conta de associação", "Tente novamente.");
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return {mutationPatch};
}
