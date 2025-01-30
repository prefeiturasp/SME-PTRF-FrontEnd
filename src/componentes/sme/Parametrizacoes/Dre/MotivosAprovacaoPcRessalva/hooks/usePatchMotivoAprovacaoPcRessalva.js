import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMotivosAprovacaoPcRessalva } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchMotivoAprovacaoPcRessalva = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(MotivosAprovacaoPcRessalvaContext)

    const mutationPatch = useMutation({
        mutationFn: ({uuidMotivoAprovacaoPcRessalva, payload}) => {
            return patchMotivosAprovacaoPcRessalva(uuidMotivoAprovacaoPcRessalva, payload)
        },
        onSuccess: (data) => {
            console.log("Motivo de PC aprovada com ressalva editado com sucesso.", data)
            // Refaz a lista de motivos de PC aprovada com ressalva
            queryClient.invalidateQueries(['motivos-aprovacao-pc-ressalva']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Edição do motivo de PC aprovada com ressalva realizada com sucesso', `O motivo de PC aprovada com ressalva foi editado com sucesso.`)
        },
        onError: (error) => {
            if (error && error.response && error.response.data && error.response.data.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao atualizar o motivo de PC aprovada com ressalva',error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao atualizar o motivo de PC aprovada com ressalva', `Não foi possível atualizar o motivo de PC aprovada com ressalva`)
            }
            console.log("Erro ao editar o motivo de PC aprovada com ressalva", error)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPatch}
}