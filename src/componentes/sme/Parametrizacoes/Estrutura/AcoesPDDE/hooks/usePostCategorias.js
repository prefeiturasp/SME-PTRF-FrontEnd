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
            toastCustom.ToastCustomSuccess('Sucesso.', 'Categoria de Ação PDDE criada com sucesso')
        },
        onError: (e) => {
            if (e.response && e.response.data && e.response.data.erro && e.response.data.erro === "Duplicated"){
                toastCustom.ToastCustomError('Ops!', 'Categoria já existe.')
            }
            else{
                toastCustom.ToastCustomError('Ops!', 'Não foi possível criar a Categoria de Ação PDDE')
            }
        },
    })
    return {mutationPost}

}