import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAddAcertosLancamentos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { AcertosLancamentosContext } from "../context/AcertosLancamentos";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostAcertosLancamentos = () => {

    const queryClient = useQueryClient()
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(AcertosLancamentosContext)

    const mutationPost = useMutation({
        mutationFn: ({ payload }) => {
            return postAddAcertosLancamentos(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['acertos-lancamentos-list']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Inclusão de tipo de acerto em lançamento realizado com sucesso.', `O tipo de acerto em lançamento foi adicionado ao sistema com sucesso.`)
        },
        onError: (error) => {
            if (error.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError(
                  'Erro ao criar tipo de acerto em lançamento', 
                  error.response?.data?.non_field_errors
                )
            } else if (error.response?.data?.detail) {
                toastCustom.ToastCustomError(
                  'Erro ao criar tipo de acerto em lançamento', 
                  error.response?.data?.detail
                )
            } else {
                toastCustom.ToastCustomError(
                  'Erro ao criar tipo de acerto em lançamento', 
                  "Erro ao processar a solicitação."
                )
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return { mutationPost }
}
