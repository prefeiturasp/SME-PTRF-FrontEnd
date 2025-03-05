import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUpdatePeriodo } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchPeriodo = (setModalForm) => {
    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({UUID, payload}) => {
            return patchUpdatePeriodo(UUID, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['periodos']).then()
            setModalForm({open: false})
            toastCustom.ToastCustomSuccess(
                'Edição do período realizado com sucesso.'
            );
        },
        onError: (e) => {
            toastCustom.ToastCustomError('Erro ao atualizar período', 'Não foi possível atualizar o período')
        },
    })
    return {mutationPatch}
}