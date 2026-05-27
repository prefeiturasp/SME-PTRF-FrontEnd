import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDetalheTipoCredito } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useDetalhesTiposCreditoContext } from "./useDetalhesTiposCreditoContext";

export const usePostDetalhesTiposCredito = () => {

    const queryClient = useQueryClient()
    const { setBloquearBtnSalvarForm, handleCloseModalForm } = useDetalhesTiposCreditoContext();

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postDetalheTipoCredito(payload)
        },
        onSuccess: (data) => {
            // Refaz a lista de detalhes de tipos de crédito para atualizar a listagem com o novo registro adicionado
            queryClient.invalidateQueries(['detalhes-tipos-credito']).then()
            handleCloseModalForm()
            toastCustom.ToastCustomSuccess('Detalhe de tipo de crédito adicionado', `O detalhe de tipo de crédito foi adicionado com sucesso.`)
        },
        onError: (error) => {
            if (error?.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao adicionar o detalhe de tipo de crédito', error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao adicionar o detalhe de tipo de crédito', `Não foi possível adicionar o detalhe de tipo de crédito`)
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPost}
}