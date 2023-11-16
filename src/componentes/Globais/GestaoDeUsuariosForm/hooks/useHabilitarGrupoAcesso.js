import {useMutation, useQueryClient} from "@tanstack/react-query";
import {patchHabilitarGrupoAcesso} from "../../../../services/GestaoDeUsuarios.service";
import {toastCustom} from "../../../Globais/ToastCustom";

export const useHabilitarGrupoAcesso = () => {
    const queryClient = useQueryClient()
    
    const mutationHabilitarGrupoAcesso = useMutation({
        mutationFn: ({payload}) => {
            return patchHabilitarGrupoAcesso(payload)
        },
        onSuccess: (response) => {
            console.log("Grupo de acesso habilitado com sucesso ", response)
            // Refaz a lista
            queryClient.invalidateQueries(['grupos-disponiveis-acesso-usuario']).then()
            toastCustom.ToastCustomSuccess(`${response.data.mensagem}`, ``)
        },
        onError: (error) => {
            console.log("Erro ao habilitar grupo de acesso ", error.response)
            toastCustom.ToastCustomError('Erro ao ativar grupo de acesso')
        },
    })
    return {mutationHabilitarGrupoAcesso}
}