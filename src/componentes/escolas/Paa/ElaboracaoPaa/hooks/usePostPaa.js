import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { postPaa } from "../../../../../services/sme/Parametrizacoes.service";
import { gravarPaaAtivo } from "../../../../../utils/paaAtivoStorage";

export const usePostPaa = () => {
    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postPaa(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['paa']).then()
            toastCustom.ToastCustomSuccess('Sucesso.', `O PAA foi adicionado ao sistema com sucesso.`)
            gravarPaaAtivo(data);
        },

        onError: (e) => {
            const mensagem = e?.response?.data?.non_field_errors
                            || e?.response?.data?.mensagem
                            || `Não foi possível criar o PAA`;

            toastCustom.ToastCustomError('Ops!', mensagem);
        },
    })
    return {mutationPost}
}