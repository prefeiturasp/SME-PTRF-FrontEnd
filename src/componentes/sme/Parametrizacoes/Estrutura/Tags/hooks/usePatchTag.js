import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchAlterarTag } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchTag = (setModalForm) => {
    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({ UUID, payload }) => {
            return patchAlterarTag(UUID, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tags']).then()
            setModalForm({ open: false })
            toastCustom.ToastCustomSuccess(
                'Edição da etiqueta/tag realizado com sucesso.',
                `A etiqueta/tag foi editada no sistema com sucesso.`
            );
        },
        onError: (e) => {
            if (e.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Edição de etiqueta/tag não permitida.', e.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao atualizar etiqueta/tag', 'Houve um erro ao tentar completar a ação.')
            }
        },
    })
    return { mutationPatch }
}
