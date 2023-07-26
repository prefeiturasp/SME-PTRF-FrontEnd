import {useMutation, useQueryClient} from "@tanstack/react-query";
import {patchMandato} from "../../../../services/Mandatos.service";
import {useContext} from "react";
import {MandatosContext} from "../context/Mandatos";
import {toastCustom} from "../../../Globais/ToastCustom";

export const usePatchMandato = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setShowModalInfo, setTextoModalInfo, setTituloModalInfo} = useContext(MandatosContext)

    const mutationPatch = useMutation({
        mutationFn: ({uuidMandato, payload}) => {
            return patchMandato(uuidMandato, payload)
        },
        onSuccess: (data) => {
            console.log("Mandato editado com sucesso ", data)
            // Refaz a lista de mandatos
            queryClient.invalidateQueries(['mandatos-list']).then()
            // Mensagens
            setShowModalForm(false)
            setShowModalInfo(false)
            setTextoModalInfo('')
            setTituloModalInfo('')
            toastCustom.ToastCustomSuccess('Edição do período de mandato realizada com sucesso', `O período de mandato foi editado com sucesso.`)
        },
        onError: (error) => {
            console.log("Erro ao editar mandato ", error.response)
            // Mensagens
            setShowModalInfo(true)
            setTituloModalInfo('Erro ao editar período de mandado')
            setTextoModalInfo(error.response.data.detail)
        }
    })
    return {mutationPatch}
}