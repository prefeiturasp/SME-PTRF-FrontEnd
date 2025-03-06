import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postEspecificacoesMateriaisServicos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { MateriaisServicosContext } from "../context/MateriaisServicos";

import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePost = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(MateriaisServicosContext)

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postEspecificacoesMateriaisServicos(payload)
        },
        onSuccess: (data) => {

            queryClient.invalidateQueries(['especificacoes-materiais-servicos-list']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Inclusão da especificação realizada com sucesso', `A especificação foi adicionada com sucesso.`)
        },
        onError: (error) => {
            let mensagem = `Não foi possível criar a especificação.`
            let data = error.response.data

            mensagem = data?.mensagem ?? mensagem
            toastCustom.ToastCustomError('Erro ao criar a especificação', mensagem)
            console.error("Erro ao criar a especificação", error.response)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPost}
}
