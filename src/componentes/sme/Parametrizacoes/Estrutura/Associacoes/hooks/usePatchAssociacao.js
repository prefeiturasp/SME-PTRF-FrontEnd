import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUpdateAssociacao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchAssociacao = ({
    goToPageListagemAssociacoes
}) => {

    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({ uuid, data }) => {
            return patchUpdateAssociacao(uuid, data)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['listagem-associacoes-parametrizacoes']).then()
            toastCustom.ToastCustomSuccess('Associacao atualizada', `A associacao foi atualizada com sucesso.`)
            goToPageListagemAssociacoes()
        },
        onError: (error) => {
            if (error?.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao atualizar a associação',error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao atualizar a associação', `Não foi possível atualizar a associação.`)
            }
        },
    })
    return {mutationPatch}
}
