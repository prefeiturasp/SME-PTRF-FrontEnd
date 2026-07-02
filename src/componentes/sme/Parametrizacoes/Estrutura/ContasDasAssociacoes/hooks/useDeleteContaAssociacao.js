import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContasAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useContasDasAssociacoesContext } from "./useContasDasAssociacoesContext";

export const useDeleteContaAssociacao = () => {
    const queryClient = useQueryClient();
    const { setBloquearBtnSalvarForm, handleCloseModalForm } = useContasDasAssociacoesContext();

    const mutationDelete = useMutation({
        mutationFn: (uuidContaAssociacao) => {
            return deleteContasAssociacoes(uuidContaAssociacao);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['contas-associacoes']).then();
            handleCloseModalForm();
            toastCustom.ToastCustomSuccess(
                "Remoção da conta da associação efetuada com sucesso.",
                "A conta da associação foi removida do sistema com sucesso."
            );
        },
        onError: (error) => {
            if (error?.response?.data?.mensagem) {
                toastCustom.ToastCustomError("Erro ao apagar conta de associação", error.response.data.mensagem);
            } else {
                toastCustom.ToastCustomError("Erro ao apagar conta de associação", "Tente novamente.");
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return {mutationDelete};
}
