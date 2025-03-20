import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAcoesPDDECategorias } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";


export const usePostCategorias = (payload) => {
    const queryClient = useQueryClient()
    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postAcoesPDDECategorias(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['categorias']).then()
            toastCustom.ToastCustomSuccess('Categoria de Ação PDDE criada com sucesso', 'Categoria de Ação PDDE criada com sucesso')
        },
        onError: (e) => {
            console.log('Erro ao criar Categoria de Ação PDDE', `Não foi possível criar a Categoria de Ação PDDE`)
            toastCustom.ToastCustomError('Erro ao criar Categoria de Ação PDDE', 'Não foi possível criar a Categoria de Ação PDDE')
        },
    })
    return {mutationPost}

}