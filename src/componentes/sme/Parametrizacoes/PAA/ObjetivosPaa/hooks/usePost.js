import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postObjetivosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { ObjetivosPaaContext } from "../context/index";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePost = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(ObjetivosPaaContext)

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postObjetivosPaa(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['objetivos-paa']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Sucesso!', `Objetivo adicionado com sucesso.`)
        },
        onError: (e) => {
            if(e.response && e?.response?.data && e?.response?.data?.non_field_errors){
                toastCustom.ToastCustomError('Erro ao criar objetivo', e.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError(
                    'Erro!',
                    e?.response?.data?.mensagem || e?.response?.data?.detail || `Não foi possível criar o objetivo`
                )
            }
            console.error(e)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPost}
}