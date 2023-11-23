import {useMutation, useQueryClient} from "@tanstack/react-query";
import {patchDesabilitarGrupoAcesso} from "../../../../services/GestaoDeUsuarios.service";
import {toastCustom} from "../../../Globais/ToastCustom";

export const useDesabilitarGrupoAcesso = () => {
    const queryClient = useQueryClient()
    
    const mutationDesabilitarGrupoAcesso = useMutation({
        mutationFn: ({payload}) => {
            return patchDesabilitarGrupoAcesso(payload)
        },
        onSuccess: (response) => {
            console.log("Grupo acesso desabilitado com sucesso ", response)
            // Refaz a lista
            queryClient.invalidateQueries(['grupos-disponiveis-acesso-usuario']).then()
            toastCustom.ToastCustomColorInfo(`${response.data.mensagem}`, '', '#de9524', '#de9524')
        },
        onError: (error) => {
            console.log("Erro ao desabilitar grupo de acesso ", error.response)
            toastCustom.ToastCustomError('Erro ao desativar grupo de acesso')
        },
    })
    return {mutationDesabilitarGrupoAcesso}
}