import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMotivosDevolucaoTesouro } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchMotivoDevolucaoTesouro = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(MotivosDevolucaoTesouroContext)

    const mutationPatch = useMutation({
        mutationFn: ({uuidMotivoDevolucaoTesouro, payload}) => {
            return patchMotivosDevolucaoTesouro(uuidMotivoDevolucaoTesouro, payload)
        },
        onSuccess: (data) => {
            console.log("Motivo de devolução ao tesouro editado com sucesso.", data)
            // Refaz a lista de motivos de devolução ao tesouro
            queryClient.invalidateQueries(['motivos-devolucao-tesouro-list']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Edição do motivo de devolução ao tesouro realizada com sucesso', `O motivo de devolução ao tesouro foi editado com sucesso.`)
        },
        onError: (error) => {
            if (error && error.response && error.response.data && error.response.data.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao atualizar o motivo de devolução ao tesouro',error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao atualizar o motivo de devolução ao tesouro', `Não foi possível atualizar o motivo de devolução ao tesouro`)
            }
            console.log("Erro ao editar o motivo de devolução ao tesouro", error)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPatch}
}