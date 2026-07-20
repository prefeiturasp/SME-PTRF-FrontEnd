import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putAtualizarAcertosDocumentos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { AcertosDocumentosContext } from "../context/AcertosDocumentos";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchAcertosDocumentos = () => {

    const queryClient = useQueryClient()
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(AcertosDocumentosContext)

    const mutationPatch = useMutation({
        mutationFn: ({ uuid, payload }) => {
            return putAtualizarAcertosDocumentos(uuid, payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['acertos-documentos-list']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Edição do tipo de acerto em documento realizado com sucesso.', `O tipo de acerto em documento foi editado no sistema com sucesso.`)
        },
        onError: (error) => {
            if (error.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError(
                  'Erro ao editar tipo de acerto em documento', 
                  error.response?.data?.non_field_errors
                )
            } 
            else {
                toastCustom.ToastCustomError(
                  'Erro ao editar tipo de acerto em documento', 
                  `Não foi possível editar o tipo de acerto em documento`
                )
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return { mutationPatch }
}
