import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { postAddAcao } from "../../../../../../services/sme/Parametrizacoes.service";

export const usePostAcao = (setModalForm) => {
    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: ({ payload }) => {
            return postAddAcao(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['acoes']).then()
            setModalForm({ open: false })
            toastCustom.ToastCustomSuccess('Ação criada com sucesso')
        },
        onError: (e) => {
            if (e.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao criar ação', e.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao criar ação', `Não foi possível criar a ação`)
            }
        },
    })
    return { mutationPost }
}
