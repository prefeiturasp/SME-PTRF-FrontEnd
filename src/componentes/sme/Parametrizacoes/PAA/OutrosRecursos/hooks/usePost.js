import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postOutrosRecursos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { OutrosRecursosPaaContext } from "../context/index";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePost = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(OutrosRecursosPaaContext)

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postOutrosRecursos(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries('outros-recursos')
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Sucesso!', `Recurso adicionado com sucesso.`)
        },
        onError: (e) => {
            if(e.response && e?.response?.data){
                toastCustom.ToastCustomError(
                    'Erro ao criar!',
                    e?.response?.data?.mensagem ||
                    e?.response?.data?.detail ||
                    e.response.data?.non_field_errors ||
                    `Não foi possível criar o Recurso`
                )
            } else {
                toastCustom.ToastCustomError('Erro ao criar!', `Não foi possível criar o Recurso.`)
            }
            console.error(e)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPost}
}