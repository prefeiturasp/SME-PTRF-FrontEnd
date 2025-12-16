import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchPeriodosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatch = ({
    onSuccessPatch=()=>{},
    onErrorPatch=()=>{},
}) => {

    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({uuid, payload}) => {
            return patchPeriodosPaa(uuid, payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['periodos-paa']).then()
            onSuccessPatch?.(data)
            toastCustom.ToastCustomSuccess('Edição do período realizada com sucesso.');
        },
        onError: (e) => {
            if(e.response && e?.response?.data && e?.response?.data?.non_field_errors){
                toastCustom.ToastCustomError('Erro ao atualizar período', e.response.data.non_field_errors)
            } else if(e.response && e?.response?.data && e?.response?.data?.mensagem){
                toastCustom.ToastCustomError('Erro ao atualizar período', e.response.data.mensagem)
            } else {
                toastCustom.ToastCustomError('Erro ao atualizar período', `Não foi possível atualizar o período`)
            }
            onErrorPatch?.(e)
        },
    })
    return {mutationPatch}
}