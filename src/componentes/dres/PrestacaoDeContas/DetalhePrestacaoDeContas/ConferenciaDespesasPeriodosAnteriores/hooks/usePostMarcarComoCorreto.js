import {useMutation, useQueryClient} from "@tanstack/react-query";
import { postLancamentosParaConferenciaMarcarComoCorreto } from "../../../../../../services/dres/PrestacaoDeContas.service";

export const usePostMarcarComoCorreto = () => {
    const queryClient = useQueryClient()

    const mutationPostMarcarComoCorreto = useMutation({
        mutationFn: ({prestacaoDeContasUUID, payload}) => {
            return postLancamentosParaConferenciaMarcarComoCorreto(prestacaoDeContasUUID, payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['despesas-periodos-anteriores-para-conferencia']).then()
        },
        onError: (error) => {
            console.log("Erro ao marcar como correto ", error.response)
        },
        onSettled: () => {
        },
    })
    return {mutationPostMarcarComoCorreto}
}