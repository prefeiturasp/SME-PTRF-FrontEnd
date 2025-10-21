import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchObjetivosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { ObjetivosPaaContext } from "../context/index";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatch = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(ObjetivosPaaContext)

    const mutationPatch = useMutation({
        mutationFn: ({uuid, payload}) => {
            return patchObjetivosPaa(uuid, payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['objetivos-paa']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Edição salva', 'A edição foi salva com sucesso!');
        },
        onError: (e) => {
            if(e.response && e?.response?.data){
                toastCustom.ToastCustomError(
                    'Erro!',
                    e.response.data?.mensagem || e.response.data?.detail || 'Não foi possível alterar objetivo.')
            } else {
                toastCustom.ToastCustomError('Erro!', `Não foi possível alterar objetivo.`)
            }
            console.error(e)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPatch}
}