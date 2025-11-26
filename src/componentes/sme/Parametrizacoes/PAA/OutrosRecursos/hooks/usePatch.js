import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchOutrosRecursos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { OutrosRecursosPaaContext } from "../context/index";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatch = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(OutrosRecursosPaaContext)

    const mutationPatch = useMutation({
        mutationFn: ({uuid, payload}) => {
            return patchOutrosRecursos(uuid, payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries('outros-recursos')
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess(
                'Edição salva', 'A edição foi salva com sucesso!');
        },
        onError: (e) => {
            if(e.response && e?.response?.data){
                toastCustom.ToastCustomError(
                    'Erro ao alterar!',
                    e.response.data?.mensagem ||
                    e.response.data?.detail ||
                    e.response.data?.non_field_errors ||
                    'Não foi possível alterar o Recurso.'
                )
            } else {
                toastCustom.ToastCustomError('Erro!', `Não foi possível alterar o Recurso.`)
            }
            console.error(e)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPatch}
}