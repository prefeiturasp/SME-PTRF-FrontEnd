import {useMutation, useQueryClient} from "@tanstack/react-query";
import { viabilizarAcessoSuporteV2 } from "../../../services/auth.service";
import { toastCustom } from "../ToastCustom";

export const useAdicionarSuporte = () => {
    const queryClient = useQueryClient()
    
    const mutationAdicionarSuporte = useMutation({
        mutationFn: ({usuario, payload}) => {
            return viabilizarAcessoSuporteV2(usuario, payload)
        },
        onSuccess: (response) => {
            toastCustom.ToastCustomSuccess("Suporte adicionado", "Unidade de suporte adicionada com sucesso.")           
            queryClient.invalidateQueries(['unidades-em-suporte-list']).then()
        },
        onError: (error) => {
            if(error.response.data.erro && error.response.data.mensagem){
                toastCustom.ToastCustomError(error.response.data.erro, error.response.data.mensagem);
            } else {
                toastCustom.ToastCustomError('Erro ao adicionar suporte.')
            }
        },
    })
    return {mutationAdicionarSuporte}
}