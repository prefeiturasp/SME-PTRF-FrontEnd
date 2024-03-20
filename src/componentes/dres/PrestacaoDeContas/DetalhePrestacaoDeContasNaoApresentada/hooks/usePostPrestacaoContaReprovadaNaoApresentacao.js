import {useMutation} from "@tanstack/react-query";
import {postPrestacaoContaReprovadaNaoApresentacao} from "../../../../../services/dres/PrestacaoDeContasReprovadaNaoApresentacao.service";
import {toastCustom} from "../../../../Globais/ToastCustom";

// Preparação para react-router-dom-v6
import {useNavigate} from "react-router-dom-v5-compat";

export const usePostPrestacaoContaReprovadaNaoApresentacao = () => {
    const navigate = useNavigate();

    const mutationPostPrestacaoContaReprovadaNaoApresentacao = useMutation({
        mutationFn: ({payload}) => {
            return postPrestacaoContaReprovadaNaoApresentacao(payload)
        },
        onSuccess: (data) => {
            localStorage.removeItem('prestacao_de_contas_nao_apresentada');
            toastCustom.ToastCustomSuccess('Status alterado com sucesso', `Prestação de contas concluída como "Reprovada"`)
            navigate(`/dre-detalhe-prestacao-de-contas-reprovada-nao-apresentacao/${data.data.uuid}/`)
        },
        onError: (error) => {
            console.log("Erro Prestacao de Contas Reprovada por não Apresentação ", error.response)
            let msg_erro = ""
            if (error.response.data.non_field_errors && error.response.data.non_field_errors.length > 0){
                error.response.data.non_field_errors.map((msg)=>
                    msg_erro += msg
                )
            }else {
                msg_erro = error.response.data.detail
            }
            toastCustom.ToastCustomError('Erro ao criar Prestacao de Contas Reprovada por não Apresentação.', `${msg_erro}`)
        },
        onSettled: () => {
        },
    })
    return {mutationPostPrestacaoContaReprovadaNaoApresentacao}
}