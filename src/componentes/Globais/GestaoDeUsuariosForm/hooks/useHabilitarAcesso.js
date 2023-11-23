import {useMutation, useQueryClient} from "@tanstack/react-query";
import { patchHabilitarAcesso } from "../../../../services/GestaoDeUsuarios.service";
import {toastCustom} from "../../../Globais/ToastCustom";

export const useHabilitarAcesso = () => {
    const queryClient = useQueryClient()
    
    const mutationHabilitarAcesso = useMutation({
        mutationFn: ({payload}) => {
            return patchHabilitarAcesso(payload)
        },
        onSuccess: (response) => {
            console.log("Acesso habilitado com sucesso ", response)
            // Refaz a lista
            queryClient.invalidateQueries(['unidades-usuario-list']).then()
            toastCustom.ToastCustomSuccess(`${response.data.mensagem}`, ``)
            queryClient.invalidateQueries(['grupos-disponiveis-acesso-usuario'])
        },
        onError: (error) => {
            console.log("Erro ao habilitar acesso ", error.response)
            toastCustom.ToastCustomError('Erro ao ativar acesso')
        },
    })
    return {mutationHabilitarAcesso}
}