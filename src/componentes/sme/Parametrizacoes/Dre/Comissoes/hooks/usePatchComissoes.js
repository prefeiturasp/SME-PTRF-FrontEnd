import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchComissao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useComissoesContext } from "./useComissoesContext";

export const usePatchComissao = () => {

    const queryClient = useQueryClient()
    const { handleCloseModalForm, setBloquearBtnSalvarForm } = useComissoesContext();

    const mutationPatch = useMutation({
        mutationFn: ({uuidComissao, payload}) => {
            return patchComissao(uuidComissao, payload)
        },
        onSuccess: (data) => {
            // Refaz a lista de comissões
            queryClient.invalidateQueries(['comissoes']).then()
            handleCloseModalForm()
            toastCustom.ToastCustomSuccess('Comissão atualizada', `A comissão foi atualizada com sucesso.`)
        },
        onError: (error) => {
            if (error?.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao atualizar a comissão',error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao atualizar a comissão', `Não foi possível atualizar a comissão`)
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPatch}
}