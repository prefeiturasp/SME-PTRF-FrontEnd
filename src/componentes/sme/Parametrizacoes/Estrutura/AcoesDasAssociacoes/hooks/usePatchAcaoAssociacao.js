import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putAtualizarAcaoAssociacao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchAcaoAssociacao = (setIsOpenModalForm) => {
    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({UUID, payload}) => {
            return putAtualizarAcaoAssociacao(UUID, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['acoes-associacoes-parametrizacoes']).then()
            setIsOpenModalForm(false)
            toastCustom.ToastCustomSuccess(
                'Ação da associação atualizada.',
                'A ação da associação foi atualizada com sucesso.'
            );
        },
        onError: (e) => {
            if (e.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao atualizar ação da associação.', e.response?.data?.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao atualizar ação da associação', 'Não foi possível atualizar a ação da associação')
            }
        },
    })
    return {mutationPatch}
}