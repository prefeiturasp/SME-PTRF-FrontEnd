import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putAtualizarAcao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchAcao = (setModalForm) => {
    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({ UUID, payload }) => {
            return putAtualizarAcao(UUID, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['acoes']).then()
            setModalForm({ open: false })
            toastCustom.ToastCustomSuccess('Ação alterada com sucesso');
        },
        onError: (e) => {
            if (e.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao atualizar ação', e.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao atualizar ação', 'Houve um erro ao tentar completar a ação.')
            }
        },
    })
    return { mutationPatch }
}
