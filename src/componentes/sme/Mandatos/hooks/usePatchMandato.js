import {useMutation, useQueryClient} from "@tanstack/react-query";
import {patchMandato} from "../../../../services/Mandatos.service";
import {useContext} from "react";
import {MandatosContext} from "../context/Mandatos";
import {toastCustom} from "../../../Globais/ToastCustom";

export const usePatchMandato = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setShowModalInfo, setTextoModalInfo, setTituloModalInfo, setBloquearBtnSalvarForm, setForceLoading} = useContext(MandatosContext)

    const mutationPatch = useMutation({
        mutationFn: ({uuidMandato, payload}) => {
            setForceLoading(true);
            return patchMandato(uuidMandato, payload)
        },
        onSuccess: (data) => {
            console.log("Mandato editado com sucesso ", data)
            // Refaz a lista de mandatos
            queryClient.invalidateQueries(['mandatos-list']).then()
            queryClient.invalidateQueries(['mandato-mais-recente']).then()
            // Mensagens
            setShowModalForm(false)
            setForceLoading(false);
            setShowModalInfo(false)
            setTextoModalInfo('')
            setTituloModalInfo('')
            toastCustom.ToastCustomSuccess('Edição do período de mandato realizada com sucesso', `O período de mandato foi editado com sucesso.`)
        },
        onError: (error) => {
            setForceLoading(false);
            console.log("Erro ao editar mandato ", error.response)
            // Mensagens
            setShowModalInfo(true)
            setTituloModalInfo('Erro ao editar período de mandado')
            setTextoModalInfo(error.response.data.detail)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPatch}
}