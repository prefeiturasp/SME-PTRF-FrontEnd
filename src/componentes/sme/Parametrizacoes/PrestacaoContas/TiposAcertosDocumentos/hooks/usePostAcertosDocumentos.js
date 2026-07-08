import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAddAcertosDocumentos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { AcertosDocumentosContext } from "../context/AcertosDocumentos";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostAcertosDocumentos = () => {

    const queryClient = useQueryClient()
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(AcertosDocumentosContext)

    const mutationPost = useMutation({
        mutationFn: ({ payload }) => {
            return postAddAcertosDocumentos(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['acertos-documentos-list']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Inclusão de tipo de acerto em documento realizado com sucesso.', `O tipo de acerto em documento foi adicionado ao sistema com sucesso.`)
        },
        onError: (error) => {
            if (error.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError(
                  'Erro ao criar tipo de acerto em documento', 
                  error.response?.data?.non_field_errors
                )
            } else if (error.response?.data?.detail) {
                toastCustom.ToastCustomError(
                  'Erro ao criar tipo de acerto em documento', 
                  error.response?.data?.detail
                )
            } else {
                toastCustom.ToastCustomError(
                  'Erro ao criar tipo de acerto em documento', 
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
