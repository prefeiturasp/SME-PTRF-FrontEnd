import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchFiqueDeOlho } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchFiqueDeOlho = ({
    handleCloseModalForm, setBloquearBtnSalvarForm
}) => {

    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({ uuid, texto, tipo_texto, recurso }) => {
            return patchFiqueDeOlho({ uuid, texto, tipo_texto, recurso })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['fique-de-olho-parametrizacoes']).then()
            handleCloseModalForm()
            toastCustom.ToastCustomSuccess('Texto do fique de olho atualizado', `O texto do fique de olho foi atualizado com sucesso.`)
        },
        onError: (error) => {
            if (error?.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao atualizar o texto do fique de olho',error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao atualizar o texto do fique de olho', `Não foi possível atualizar o texto do fique de olho`)
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPatch}
}
