import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toastCustom} from "../../../../ToastCustom";
import { encerrarAcessoSuporte, encerrarAcessoSuporteEmLote } from "../../../../../../services/auth.service";

export const useRemoverSuporte = () => {
    const queryClient = useQueryClient()
    
    const mutationRemoverSuporte = useMutation({
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
    });

    const mutationRemoverSuporteEmLote = useMutation({
        mutationFn: ({usuario, unidade_uuids}) => {
            return encerrarAcessoSuporteEmLote(usuario, unidade_uuids)
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(['unidades-em-suporte-list']).then()
            toastCustom.ToastCustomSuccess(response.data.mensagem)
        },
        onError: (error) => {
            toastCustom.ToastCustomError('Erro ao remover acesso em lote')
        },
    });

    return {mutationRemoverSuporte, mutationRemoverSuporteEmLote}
}