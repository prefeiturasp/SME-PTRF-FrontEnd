import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postPeriodosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { PeriodosPaaContext } from "../context/index";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePost = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(PeriodosPaaContext)

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postPeriodosPaa(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['periodos-paa']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Inclusão de Período do PAA', `Período registrado na lista com sucesso.`)
        },
        onError: (e) => {
            if(e.response && e?.response?.data && e?.response?.data?.non_field_errors){
                toastCustom.ToastCustomError('Erro ao criar período', e.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao criar período', `Não foi possível criar o período`)
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPost}
}