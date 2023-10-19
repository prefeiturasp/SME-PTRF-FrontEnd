import {useMutation, useQueryClient} from "@tanstack/react-query";
import { patchDesabilitarAcesso } from "../../../../services/GestaoDeUsuarios.service";
import {toastCustom} from "../../../Globais/ToastCustom";

export const useDesabilitarAcesso = () => {
    const queryClient = useQueryClient()
    
    const mutationDesabilitarAcesso = useMutation({
        mutationFn: ({payload}) => {
            return patchDesabilitarAcesso(payload)
        },
        onSuccess: (response) => {
            console.log("Acesso desabilitado com sucesso ", response)
            // Refaz a lista
            queryClient.invalidateQueries(['unidades-usuario-list']).then()
            toastCustom.ToastCustomColorInfo(`${response.data.mensagem}`, '', '#de9524', '#de9524')
        },
        onError: (error) => {
            console.log("Erro ao desabilitar acesso ", error.response)
            toastCustom.ToastCustomError('Erro ao desativar acesso')
        },
    })
    return {mutationDesabilitarAcesso}
}