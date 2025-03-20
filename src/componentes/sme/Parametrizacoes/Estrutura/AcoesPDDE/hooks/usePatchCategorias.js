import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchAcoesPDDECategorias } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";


export const usePatchCategorias = (uuid, payload) => {
    const queryClient = useQueryClient()
   
    const mutationPatch = useMutation({
        mutationFn: ({uuid, payload}) => {
            return patchAcoesPDDECategorias(uuid, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categorias']).then()
            toastCustom.ToastCustomSuccess('Edição da Categoria de Ação PDDE realizada com sucesso', 'Edição da Categoria de Ação PDDE realizada com sucesso')
        },
        onError: (e) => {
            toastCustom.ToastCustomError('Erro ao atualizar Categoria de Ação PDDE', 'Não foi possível atualizar a Categoria de Ação PDDE')
            console.log('Erro ao atualizar Categoria de Ação PDDE', 'Não foi possível atualizar a Categoria de Ação PDDE')
        },
    })
    return {mutationPatch}
}