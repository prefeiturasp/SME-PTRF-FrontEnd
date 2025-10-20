import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchAtividadesEstatutarias } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { AtividadesEstatutariasContext } from "../context/index";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatch = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm, setBloquearBtnSalvarForm} = useContext(AtividadesEstatutariasContext)

    const mutationPatch = useMutation({
        mutationFn: ({uuid, payload}) => {
            return patchAtividadesEstatutarias(uuid, payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['atividades-estatutarias']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess('Edição salva', 'A edição foi salva com sucesso!');
        },
        onError: (e) => {
            if(e.response && e?.response?.data){
                toastCustom.ToastCustomError(
                    'Erro!',
                    e.response.data?.mensagem || e.response.data?.detail || 'Não foi possível alterar atividade estatutária.')
            } else {
                toastCustom.ToastCustomError('Erro!', `Não foi possível alterar atividade estatutária.`)
            }
            console.error(e)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false)
        },
    })
    return {mutationPatch}
}