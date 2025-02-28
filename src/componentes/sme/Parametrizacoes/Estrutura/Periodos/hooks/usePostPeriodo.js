import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { postCriarPeriodo } from "../../../../../../services/sme/Parametrizacoes.service";

export const usePostPeriodo = (setModalForm) => {
    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postCriarPeriodo(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['periodos']).then()
            setModalForm({open: false})
            toastCustom.ToastCustomSuccess('Inclusão de período realizado com sucesso.', `O período foi adicionado ao sistema com sucesso.`)
        },
        onError: (e) => {
            toastCustom.ToastCustomError('Erro ao criar período', `Não foi possível criar o período`)
        },
    })
    return {mutationPost}
}