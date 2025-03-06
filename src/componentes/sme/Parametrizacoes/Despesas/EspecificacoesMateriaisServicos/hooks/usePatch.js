import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchEspecificacoesMateriaisServicos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { MateriaisServicosContext } from "../context/MateriaisServicos";

import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatch = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(MateriaisServicosContext)

    const mutationPatch = useMutation({
        mutationFn: ({uuid, payload}) => {
            return patchEspecificacoesMateriaisServicos(uuid, payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['especificacoes-materiais-servicos-list']).then()
            setShowModalForm(false)
            let mensagem = `A especificação foi editada com sucesso.`;
            toastCustom.ToastCustomSuccess('Edição da especificação realizada com sucesso', mensagem)
        },
        onError: (error) => {

            let mensagem = `Não foi possível editar a especificação`
            let data = error.response.data

            mensagem = data?.mensagem ?? mensagem

            toastCustom.ToastCustomError('Erro ao editar a especificação', mensagem)
            console.log("Erro ao editar a especificação", error.response)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPatch}
}
