import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMotivoAprovacaoPcRessalva } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostMotivoAprovacaoPcRessalva = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(MotivosAprovacaoPcRessalvaContext)

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postMotivoAprovacaoPcRessalva(payload)
        },
        onSuccess: (data) => {
            console.log("Motivo de PC aprovada com ressalva criado com sucesso.", data)
            // Refaz a lista de motivos de PC aprovada com ressalva
            queryClient.invalidateQueries(['motivos-aprovacao-pc-ressalva']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Inclusão do motivo de PC aprovada com ressalva realizada com sucesso', `O motivo de PC aprovada com ressalva foi adicionado com sucesso.`)
        },
        onError: (error) => {
            if (error && error.response && error.response.data && error.response.data.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao criar o motivo de PC aprovada com ressalva',error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao criar o motivo de PC aprovada com ressalva', `Não foi possível criar o motivo de PC aprovada com ressalva`)
            }
            console.log("Erro ao criar o motivo de PC aprovada com ressalva", error.response)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPost}
}