import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComissao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useComissoesContext } from "./useComissoesContext";

export const usePostComissoes = () => {

    const queryClient = useQueryClient()
    const { setBloquearBtnSalvarForm, handleCloseModalForm } = useComissoesContext();

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postComissao(payload)
        },
        onSuccess: (data) => {
            // Refaz a lista de comissões
            queryClient.invalidateQueries(['comissoes']).then()
            handleCloseModalForm()
            toastCustom.ToastCustomSuccess('Comissão adicionada', `A comissão foi adicionada com sucesso.`)
        },
        onError: (error) => {
            if (error?.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao adicionar a comissão', error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao adicionar a comissão', `Não foi possível adicionar a comissão`)
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPost}
}