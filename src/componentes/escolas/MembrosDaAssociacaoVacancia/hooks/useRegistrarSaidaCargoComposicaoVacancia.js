import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRegistrarSaidaCargoComposicaoVacancia } from "../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../Globais/ToastCustom";
import { extraiMensagemDeErroVacancia } from "../utils/extraiMensagemDeErroVacancia";

export const useRegistrarSaidaCargoComposicaoVacancia = () => {
    const queryClient = useQueryClient()

    const mutationRegistrarSaidaCargoComposicaoVacancia = useMutation({
        mutationFn: ({uuid, data_saida}) => {
            return postRegistrarSaidaCargoComposicaoVacancia(uuid, data_saida)
        },
        onSuccess: (data) => {
            console.log("Saída registrada com sucesso ", data)
            queryClient.invalidateQueries(['cargos-da-composicao-vacancia']).then()
            queryClient.invalidateQueries(['status-cadastro-associacao']).then()
            toastCustom.ToastCustomSuccess('Saída registrada com sucesso.', `A saída do membro foi registrada com sucesso.`)
        },
        onError: (error) => {
            console.log("Erro ao registrar saída ", error.response)
            toastCustom.ToastCustomError('Erro ao registrar saída.', extraiMensagemDeErroVacancia(error))
        },
        onSettled: () => {
        },
    })
    return {mutationRegistrarSaidaCargoComposicaoVacancia}
}