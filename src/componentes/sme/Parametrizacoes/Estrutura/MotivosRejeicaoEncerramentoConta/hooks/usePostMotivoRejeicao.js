import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMotivosRejeicaoEncerramentoConta } from "../../../../../../services/MotivosRejeicaoEncerramentoConta.service";
import { useContext } from "react";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostMotivoRejeicao = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(MotivosRejeicaoContext)

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postMotivosRejeicaoEncerramentoConta(payload)
        },
        onSuccess: (data) => {
            console.log("Motivo rejeição criado com sucesso.", data)
            // Refaz a lista de motivos de rejeição
            queryClient.invalidateQueries(['motivos-rejeicao-list']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Inclusão do motivo de rejeição de encerramento de conta realizada com sucesso', `O motivo de rejeição foi adicionado com sucesso.`)
        },
        onError: (error) => {
            console.log("Erro ao criar o motivo de rejeição", error.response)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPost}
}