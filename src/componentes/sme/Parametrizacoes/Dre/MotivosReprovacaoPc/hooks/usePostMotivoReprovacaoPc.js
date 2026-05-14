import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMotivoReprovacaoPc } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useMotivosReprovacaoPcContext } from "./useMotivoReprovacaoContext";

export const usePostMotivoReprovacaoPc = () => {

    const queryClient = useQueryClient()
    const { setBloquearBtnSalvarForm, handleCloseModalForm } = useMotivosReprovacaoPcContext();

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postMotivoReprovacaoPc(payload)
        },
        onSuccess: (data) => {
            // Refaz a lista de motivos de PC reprovada
            queryClient.invalidateQueries(['motivos-reprovacao-pc']).then()
            handleCloseModalForm()
            toastCustom.ToastCustomSuccess('Motivo de reprovação adicionado', `O motivo de reprovação de PC foi adicionado com sucesso.`)
        },
        onError: (error) => {
            if (error?.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao adicionar o motivo de reprovação de PC', error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao adicionar o motivo de reprovação de PC', `Não foi possível adicionar o motivo de PC reprovada`)
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPost}
}