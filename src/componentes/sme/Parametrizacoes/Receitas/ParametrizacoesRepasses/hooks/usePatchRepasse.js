import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchRepasse } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { RepassesContext } from "../context/Repasse";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchRepasse = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(RepassesContext)

    const mutationPatch = useMutation({
        mutationFn: ({uuid_repasse, payload}) => {
            return patchRepasse(uuid_repasse, payload)
        },
        onSuccess: (data) => {
            console.log("Repasse editado com sucesso.", data)

            queryClient.invalidateQueries(['repasses-list']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Edição do repasse realizada com sucesso', `O repasse foi editado com sucesso.`)
        },
        onError: (error) => {
            toastCustom.ToastCustomError('Erro ao atualizar o repasse', `Não foi possível atualizar o repasse`)
            console.log("Erro ao editar o repasse", error.response)
            // Mensagens
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPatch}
}