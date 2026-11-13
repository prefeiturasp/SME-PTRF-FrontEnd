import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchProgramaPDDE } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchProgramaPDDE = (onSuccessCallback) => {
    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({uuid, payload}) => {
            return patchProgramaPDDE(uuid, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['programas-pdde']}).then()
            // O nome do programa é exibido na listagem de Ações PDDE
            queryClient.invalidateQueries({queryKey: ['acoes-pdde']}).then()
            onSuccessCallback && onSuccessCallback()
            toastCustom.ToastCustomSuccess('Sucesso.', 'Edição do Programa realizada com sucesso.')
        },
        onError: (e) => {
            if (e?.response?.data?.erro === "Duplicated") {
                toastCustom.ToastCustomError('Ops!', 'Programa já existe.')
            } else {
                toastCustom.ToastCustomError('Ops!', 'Não foi possível atualizar o Programa.')
            }
        },
    })
    return {mutationPatch}
}
