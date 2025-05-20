import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { postPaa } from "../../../../../services/sme/Parametrizacoes.service";


export const usePostPaa = () => {
    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postPaa(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['paa']).then()
            toastCustom.ToastCustomSuccess('Sucesso.', `O PAA foi adicionado ao sistema com sucesso.`)
        },
        onError: (e) => {
            toastCustom.ToastCustomError('Ops!', `Não foi possível criar o PAA`)
        },
    })
    return {mutationPost}
}