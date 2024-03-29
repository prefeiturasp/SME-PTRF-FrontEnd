import {useMutation, useQueryClient} from "@tanstack/react-query";
import {putCargoComposicao} from "../../../../services/Mandatos.service";
import {toastCustom} from "../../../Globais/ToastCustom";

export const usePutCargoDaComposicao = () => {
    const queryClient = useQueryClient()

    const mutationPutCargoDaComposicao = useMutation({
        mutationFn: ({uuidCargoComposicao, payload}) => {
            return putCargoComposicao(uuidCargoComposicao, payload)
        },
        onSuccess: (data) => {
            console.log("Cargo Composição alterado com sucesso ", data)
            // Refaz a lista de cargos-da-composicao
            queryClient.invalidateQueries(['cargos-da-composicao']).then()
            queryClient.invalidateQueries(['status-cadastro-associacao']).then()

            if(data.data.substituido){
                toastCustom.ToastCustomSuccess('Membro removido com sucesso.', `O membro foi removido com sucesso.`)
            }
            else{
                toastCustom.ToastCustomSuccess('Membro alterado com sucesso.', `O membro foi alterado no sistema com sucesso.`)
            }
        },
        onError: (error) => {
            console.log("Erro ao alterar Cargo da Composição ", error.response)
            let msg_erro = ""
            if (error.response.data.non_field_errors && error.response.data.non_field_errors.length > 0){
                error.response.data.non_field_errors.map((msg)=>
                    msg_erro += msg
                )
            }else {
                msg_erro = error.response.data.detail
            }
            toastCustom.ToastCustomError('Erro ao alterar Cargo da Composição.', `${msg_erro}`)
        },
        onSettled: () => {
        },
    })
    return {mutationPutCargoDaComposicao}
}