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
            toastCustom.ToastCustomSuccess('Sucesso', 'Edição do Programa de Ação PDDE realizada com sucesso')
        },
        onError: (e) => {
            if (e.response && e.response.data && e.response.data.erro && e.response.data.erro === "Duplicated"){
                toastCustom.ToastCustomError('Ops!', 'Programa já existe.')
            }
            else{
                toastCustom.ToastCustomError('Ops!', 'Não foi possível atualizar o Programa de Ação PDDE')
            }
        },
    })
    return {mutationPatch}
}