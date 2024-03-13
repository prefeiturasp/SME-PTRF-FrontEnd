import {useMutation} from "@tanstack/react-query";
import {
    postNotificarPrestacaoContaReprovadaNaoApresentacao,
} from "../../../../../services/dres/PrestacaoDeContasReprovadaNaoApresentacao.service";

export const usePostNotificarPrestacaoContaReprovadaNaoApresentacao = () => {
    const mutationPostNotificarPrestacaoContaReprovadaNaoApresentacao = useMutation({
        mutationFn: ({payload}) => {
            return postNotificarPrestacaoContaReprovadaNaoApresentacao(payload)
        },
        onSuccess: (data) => {
        },
        onError: (error) => {
            console.log("Erro Notificar Prestacao de Contas Reprovada por não Apresentação ", error.response)
        },
        onSettled: () => {
        },
    })
    return {mutationPostNotificarPrestacaoContaReprovadaNaoApresentacao}
}