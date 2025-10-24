import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchExibirAcoesPTRFPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatch = () => {

    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({uuid, payload}) => {
            return patchExibirAcoesPTRFPaa(uuid, payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['acoes-ptrf-paa']).then()
            const status_exibir_paa = data.exibir_paa ? 'habilitada' : 'desabilitada'
            toastCustom.ToastCustomSuccess(
                `Ação ${status_exibir_paa}`, 
                `A Ação PTRF foi ${status_exibir_paa} com sucesso!`);
        },
        onError: (e) => {
            if(e.response && e?.response?.data){
                toastCustom.ToastCustomError(
                    'Erro!',
                    e.response.data?.mensagem || e.response.data?.detail || 'Não foi possível alternar exibição da Ação PTRF no PAA.')
            } else {
                toastCustom.ToastCustomError('Erro!', `Não foi possível alterar.`)
            }
            console.error(e)
        },
    })
    return {mutationPatch}
}