import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCriarAssociacao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostAssociacao = ({
    goToPageListagemAssociacoes,
}) => {

    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: (payload) => {
            return postCriarAssociacao(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['listagem-associacoes-parametrizacoes']).then()
            toastCustom.ToastCustomSuccess('Associacao cadastrada com sucesso')
            goToPageListagemAssociacoes()
        },
        onError: (error) => {
            if (error?.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao adicionar associação', error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao adicionar associação', `Não foi possível adicionar associação.`)
            }
        },
    })
    return {mutationPost}
}
