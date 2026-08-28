import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchCorrigirSaidaCargoComposicaoVacancia } from "../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../Globais/ToastCustom";
import { extraiMensagemDeErroVacancia } from "../utils/extraiMensagemDeErroVacancia";

export const useCorrigirSaidaCargoComposicaoVacancia = () => {
    const queryClient = useQueryClient()

    const mutationCorrigirSaidaCargoComposicaoVacancia = useMutation({
        mutationFn: ({uuid, data_saida}) => {
            return patchCorrigirSaidaCargoComposicaoVacancia(uuid, data_saida)
        },
        onSuccess: (data) => {
            console.log("Data de saída corrigida com sucesso ", data)
            queryClient.invalidateQueries(['cargos-da-composicao-vacancia']).then()
            queryClient.invalidateQueries(['status-cadastro-associacao']).then()
            toastCustom.ToastCustomSuccess('Data de saída corrigida com sucesso.', `A data de saída do membro foi atualizada.`)
        },
        onError: (error) => {
            console.log("Erro ao corrigir data de saída ", error.response)
            toastCustom.ToastCustomError('Erro ao corrigir data de saída.', extraiMensagemDeErroVacancia(error))
        },
        onSettled: () => {
        },
    })
    return {mutationCorrigirSaidaCargoComposicaoVacancia}
}