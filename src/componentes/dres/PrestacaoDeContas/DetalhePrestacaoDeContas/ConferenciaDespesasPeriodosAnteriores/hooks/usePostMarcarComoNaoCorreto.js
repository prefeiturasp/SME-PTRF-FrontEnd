import {useMutation, useQueryClient} from "@tanstack/react-query";
import { postLancamentosParaConferenciaMarcarNaoConferido } from "../../../../../../services/dres/PrestacaoDeContas.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostMarcarComoNaoCorreto = () => {
    const queryClient = useQueryClient()

    const mutationPostMarcarComoNaoCorreto = useMutation({
        mutationFn: ({prestacaoDeContasUUID, payload}) => {
            return postLancamentosParaConferenciaMarcarNaoConferido(prestacaoDeContasUUID, payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['despesas-periodos-anteriores-para-conferencia']).then()
            // toastCustom.ToastCustomSuccess('Ação realizada com sucesso.')
        },
        onError: (error) => {
            console.log("Erro ao marcar como correto ", error.response)
        },
        onSettled: () => {
        },
    })
    return {mutationPostMarcarComoNaoCorreto}
}