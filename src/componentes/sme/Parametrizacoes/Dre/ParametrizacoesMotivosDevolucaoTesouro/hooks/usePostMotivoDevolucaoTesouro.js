import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMotivosDevolucaoTesouro } from "../../../../../../services/MotivosDevolucaoTesouro.service";
import { useContext } from "react";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostMotivoDevolucaoTesouro = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(MotivosDevolucaoTesouroContext)

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postMotivosDevolucaoTesouro(payload)
        },
        onSuccess: (data) => {
            console.log("Motivo de devolução ao tesouro criado com sucesso.", data)
            // Refaz a lista de motivos de de devolução ao tesouro
            queryClient.invalidateQueries(['motivos-devolucao-tesouro-list']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Inclusão do motivo de de devolução ao tesouro realizada com sucesso', `O motivo de de devolução ao tesouro foi adicionado com sucesso.`)
        },
        onError: (error) => {
            if (error && error.response && error.response.data && error.response.data.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao atualizar o motivo de de devolução ao tesouro',error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao criar o motivo de de devolução ao tesouro', `Não foi possível criar o motivo de de devolução ao tesouro`)
            }
            console.log("Erro ao criar o motivo de de devolução ao tesouro", error.response)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPost}
}