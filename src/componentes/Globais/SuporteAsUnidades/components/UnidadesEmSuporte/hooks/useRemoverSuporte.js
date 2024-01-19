import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toastCustom} from "../../../../ToastCustom";
import { encerrarAcessoSuporte } from "../../../../../../services/auth.service";

export const useRemoverSuporte = () => {
    const queryClient = useQueryClient()
    
    const mutationDesabilitarAcesso = useMutation({
        mutationFn: ({usuario, unidade_uuid}) => {
            return encerrarAcessoSuporte(usuario, unidade_uuid)
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(['unidades-em-suporte-list']).then()
            toastCustom.ToastCustomSuccess(response.data.mensagem)
        },
        onError: (error) => {
            toastCustom.ToastCustomError('Erro ao remover acesso')
        },
    })
    return {mutationDesabilitarAcesso}
}