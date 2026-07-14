import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putAtualizarAcertosLancamentos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { AcertosLancamentosContext } from "../context/AcertosLancamentos";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchAcertosLancamentos = () => {

    const queryClient = useQueryClient()
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(AcertosLancamentosContext)

    const mutationPatch = useMutation({
        mutationFn: ({ uuid, payload }) => {
            return putAtualizarAcertosLancamentos(uuid, payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['acertos-lancamentos-list']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Edição do tipo de acerto em lançamento realizado com sucesso.', `O tipo de acerto em lançamento foi editado no sistema com sucesso.`)
        },
        onError: (error) => {
            if (error.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError(
                  'Erro ao editar tipo de acerto em lançamento', 
                  error.response?.data?.non_field_errors
                )
            } 
            else {
                toastCustom.ToastCustomError(
                  'Erro ao editar tipo de acerto em lançamento', 
                  `Não foi possível editar o tipo de acerto em lançamento`
                )
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return { mutationPatch }
}
