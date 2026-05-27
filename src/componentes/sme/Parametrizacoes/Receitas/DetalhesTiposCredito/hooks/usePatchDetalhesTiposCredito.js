import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchDetalheTipoCredito } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useDetalhesTiposCreditoContext } from "./useDetalhesTiposCreditoContext";

export const usePatchDetalhesTiposCredito = () => {

    const queryClient = useQueryClient()
    const { handleCloseModalForm, setBloquearBtnSalvarForm } = useDetalhesTiposCreditoContext();

    const mutationPatch = useMutation({
        mutationFn: ({uuidDetalheTipoCredito, payload}) => {
            return patchDetalheTipoCredito(uuidDetalheTipoCredito, payload)
        },
        onSuccess: (data) => {
            // Refaz a lista de motivos de PC reprovada
            queryClient.invalidateQueries(['detalhes-tipos-credito']).then()
            handleCloseModalForm()
            toastCustom.ToastCustomSuccess('Detalhe de tipo de crédito atualizado', `O detalhe de tipo de crédito foi atualizado com sucesso.`)
        },
        onError: (error) => {
            if (error?.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao atualizar o detalhe de tipo de crédito',error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao atualizar o detalhe de tipo de crédito', `Não foi possível atualizar o detalhe de tipo de crédito`)
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPatch}
}