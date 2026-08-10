import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { postCreateTag } from "../../../../../../services/sme/Parametrizacoes.service";

export const usePostTag = (setModalForm) => {
    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: ({ payload }) => {
            return postCreateTag(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['tags']).then()
            setModalForm({ open: false })
            toastCustom.ToastCustomSuccess('Inclusão de etiqueta/tag realizada com sucesso.', `A etiqueta/tag foi adicionada ao sistema com sucesso.`)
        },
        onError: (e) => {
            if (e.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao criar etiqueta/tag', e.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao criar etiqueta/tag', `Não foi possível criar a etiqueta/tag`)
            }
        },
    })
    return { mutationPost }
}
