import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFiqueDeOlho } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostFiqueDeOlho = ({
    handleCloseModalForm, setBloquearBtnSalvarForm
}) => {

    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: ({ texto, tipo_texto, recurso }) => {
            return postFiqueDeOlho({ texto, tipo_texto, recurso })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['fique-de-olho-parametrizacoes']).then()
            handleCloseModalForm()
            toastCustom.ToastCustomSuccess('Texto do fique de olho adicionado', `O texto do fique de olho foi adicionado com sucesso.`)
        },
        onError: (error) => {
            if (error?.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao adicionar o texto do fique de olho', error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao adicionar o texto do fique de olho', `Não foi possível adicionar o texto do fique de olho`)
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPost}
}
