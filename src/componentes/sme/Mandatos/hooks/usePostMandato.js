import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postMandato} from "../../../../services/Mandatos.service";
import {useContext} from "react";
import {MandatosContext} from "../context/Mandatos";
import {toastCustom} from "../../../Globais/ToastCustom";

export const usePostMandato = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setShowModalInfo, setTextoModalInfo, setTituloModalInfo, setBloquearBtnSalvarForm, setForceLoading} = useContext(MandatosContext)

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postMandato(payload)
        },
        onSuccess: (data) => {
            console.log("Mandato criado com sucesso ", data)
            // Refaz a lista de mandatos
            queryClient.invalidateQueries(['mandatos-list']).then()
            queryClient.invalidateQueries(['mandato-mais-recente']).then()
            setForceLoading(false);
            setShowModalForm(false)
            setShowModalInfo(false)
            setTextoModalInfo('')
            setTituloModalInfo('')
            toastCustom.ToastCustomSuccess('Inclusão do período de mandato realizada com sucesso', `O período de mandato foi adicionado ao sistema com sucesso.`)
        },
        onError: (error) => {
            console.log("Erro ao criar mandato ", error.response)
            setShowModalInfo(true)
            setTituloModalInfo('Erro ao cadastrar período de mandato')
            setTextoModalInfo(error.response.data.detail)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPost}
}