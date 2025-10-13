import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAtividadesEstatutarias } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { AtividadesEstatutariasContext } from "../context/index";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePost = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(AtividadesEstatutariasContext)

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postAtividadesEstatutarias(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['atividades-estatutarias']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Sucesso!', `Atividade Estatutária adicionada com sucesso.`)
        },
        onError: (e) => {
            if(e.response && e?.response?.data && e?.response?.data?.non_field_errors){
                toastCustom.ToastCustomError('Erro ao criar atividade estatutária', e.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError(
                    'Erro!',
                    e?.response?.data?.mensagem || 
                    e?.response?.data?.detail || 
                    `Não foi possível criar a atividade estatutária`
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