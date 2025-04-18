import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { postAcoesPDDE } from "../../../../../../services/sme/Parametrizacoes.service";


export const usePostAcaoPDDE = (setModalForm) => {
    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postAcoesPDDE(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['acoes']).then()
            setModalForm({open: false})
            toastCustom.ToastCustomSuccess('Sucesso.', `A Ação PDDE foi adicionada ao sistema com sucesso.`)
        },
        onError: (e) => {
            toastCustom.ToastCustomError('Ops!', `Não foi possível criar a Ação PDDE`)
        },
    })
    return {mutationPost}
}