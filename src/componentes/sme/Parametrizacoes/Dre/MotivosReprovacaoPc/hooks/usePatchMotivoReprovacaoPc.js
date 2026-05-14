import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMotivosReprovacaoPc } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useMotivosReprovacaoPcContext } from "./useMotivoReprovacaoContext";

export const usePatchMotivoReprovacaoPc = () => {

    const queryClient = useQueryClient()
    const { handleCloseModalForm, setBloquearBtnSalvarForm } = useMotivosReprovacaoPcContext();

    const mutationPatch = useMutation({
        mutationFn: ({uuidMotivoReprovacaoPc, payload}) => {
            return patchMotivosReprovacaoPc(uuidMotivoReprovacaoPc, payload)
        },
        onSuccess: (data) => {
            // Refaz a lista de motivos de PC reprovada
            queryClient.invalidateQueries(['motivos-reprovacao-pc']).then()
            handleCloseModalForm()
            toastCustom.ToastCustomSuccess('Motivo de reprovação de PC atualizada', `O motivo de reprovação de PC foi atualizada com sucesso.`)
        },
        onError: (error) => {
            if (error?.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao atualizar o motivo de reprovação de PC',error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao atualizar o motivo de reprovação de PC', `Não foi possível atualizar o motivo de reprovação de PC`)
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPatch}
}