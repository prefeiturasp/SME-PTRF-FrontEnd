import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postPeriodosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePost = ({
    onSuccessPost=()=>{},
    onErrorPost=()=>{},
}) => {

    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postPeriodosPaa(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['periodos-paa']).then()
            onSuccessPost?.(data)
            toastCustom.ToastCustomSuccess('Inclusão de Período do PAA', `Período registrado na lista com sucesso.`)
        },
        onError: (e) => {
            if(e.response && e?.response?.data && e?.response?.data?.non_field_errors){
                toastCustom.ToastCustomError('Erro ao criar período', e.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao criar período', `Não foi possível criar o período`)
            }
            onErrorPost?.(e)
        },
    })
    return {mutationPost}
}