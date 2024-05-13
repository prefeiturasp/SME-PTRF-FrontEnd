import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRepasse } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { RepassesContext } from "../context/Repasse";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostRepasse = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(RepassesContext)

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postRepasse(payload)
        },
        onSuccess: (data) => {
            console.log("Repasse criado com sucesso.", data)

            queryClient.invalidateQueries(['repasses-list']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Inclusão do repasse realizado com sucesso', `O repasse foi adicionado com sucesso.`)
        },
        onError: (error) => {
            toastCustom.ToastCustomError('Erro ao criar o repasse', `Não foi possível criar o repasse.`)
            console.log("Erro ao criar o repasse", error.response)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPost}
}