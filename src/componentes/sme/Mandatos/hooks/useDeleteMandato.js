import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteMandato} from "../../../../services/Mandatos.service";
import {useContext} from "react";
import {useDispatch} from "react-redux";
import {MandatosContext} from "../context/Mandatos";
import {toastCustom} from "../../../Globais/ToastCustom";
import {ModalInfo as CustomModalInfo} from "../../../Globais/Modal/ModalInfo";

export const useDeleteMandato = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient()
    const {setShowModalForm} = useContext(MandatosContext)

    const mutationDelete = useMutation({
        mutationFn: ({uuid}) => {
            return deleteMandato(uuid)
        },
        onSuccess: () => {
            // Refaz a lista de mandatos
            queryClient.invalidateQueries(['mandatos-list']).then()
            queryClient.invalidateQueries(['mandato-mais-recente']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Exclusão do período de mandato realizada com sucesso', `O período de mandato foi excluído com sucesso.`)
        },
        onError: (error) => {
            const mensgaem = error.response.data && error.response.data['mensagem'] ? error.response.data['mensagem'] : 'Houve um erro ao tentar deletar período de mandato.'
            CustomModalInfo({
                dispatch,
                title: 'Não foi possível deletar período de mandato.',
                message: mensgaem
            })
        }
    })
    return {mutationDelete}
}