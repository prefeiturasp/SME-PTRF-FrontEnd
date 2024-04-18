import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMotivosRejeicaoEncerramentoConta } from "../../../../../../services/MotivosRejeicaoEncerramentoConta.service";
import { useContext } from "react";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchMotivoRejeicao = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(MotivosRejeicaoContext)

    const mutationPatch = useMutation({
        mutationFn: ({uuidMotivoRejeicao, payload}) => {
            return patchMotivosRejeicaoEncerramentoConta(uuidMotivoRejeicao, payload)
        },
        onSuccess: (data) => {
            console.log("Motivo rejeição editado com sucesso.", data)
            // Refaz a lista de motivos de rejeição
            queryClient.invalidateQueries(['motivos-rejeicao-list']).then()
            // Mensagens
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Edição do motivo de rejeição de encerramento de conta realizada com sucesso', `O motivo de rejeição foi editado com sucesso.`)
        },
        onError: (error) => {
            toastCustom.ToastCustomError('Erro ao atualizar o motivo de rejeição', `Não foi possível atualizar o motivo de rejeição`)
            console.log("Erro ao editar o motivo de rejeição", error.response)
            // Mensagens
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPatch}
}