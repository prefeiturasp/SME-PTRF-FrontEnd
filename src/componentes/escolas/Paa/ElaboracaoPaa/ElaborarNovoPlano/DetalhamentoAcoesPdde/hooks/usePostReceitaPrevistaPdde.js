import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postReceitaPrevistaPDDE } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePostReceitaPrevistaPdde = (setModalForm) => {
    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: (payload) => {
            return postReceitaPrevistaPDDE(payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['acoes']).then()
            setModalForm({open: false})
            toastCustom.ToastCustomSuccess(
                'Sucesso', 'Criação de Receita Prevista PDDE realizada com sucesso.'
            );
        },
        onError: (e) => {
            toastCustom.ToastCustomError('Ops!', 'Não foi possível atualizar a Receita Prevista PDDE')
        },
    })
    return {mutationPost}
}