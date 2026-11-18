import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postProgramaPDDE } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostProgramaPDDE = (onSuccessCallback) => {
    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postProgramaPDDE(payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['programas-pdde']}).then()
            onSuccessCallback && onSuccessCallback()
            toastCustom.ToastCustomSuccess('Sucesso.', 'O Programa foi adicionado ao sistema com sucesso.')
        },
        onError: (e) => {
            if (e?.response?.data?.erro === "Duplicated") {
                toastCustom.ToastCustomError('Ops!', 'Programa já existe.')
            } else {
                toastCustom.ToastCustomError('Ops!', 'Não foi possível criar o Programa.')
            }
        },
    })
    return {mutationPost}
}
