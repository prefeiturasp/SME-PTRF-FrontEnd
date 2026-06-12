import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { postAddAcaoAssociacao } from "../../../../../../services/sme/Parametrizacoes.service";

export const usePostAcaoAssociacao = (setIsOpenModalForm) => {
    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: ({ payload }) => {
            return postAddAcaoAssociacao(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['acoes-associacoes-parametrizacoes']).then()
            setIsOpenModalForm(false)
            toastCustom.ToastCustomSuccess('Ação da associação adicionada!', 'A ação da associação foi adicionada com sucesso.')
        },
        onError: (e) => {
            if (e.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao adicionar ação da associação.', e.response?.data?.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao adicionar ação da associação', 'Não foi possível adicionar a ação da associação')
            }
        },
    })
    return {mutationPost}
}