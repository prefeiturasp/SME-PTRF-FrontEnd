import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchCancelarSaidaCargoComposicaoVacancia } from "../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../Globais/ToastCustom";
import { extraiMensagemDeErroVacancia } from "../utils/extraiMensagemDeErroVacancia";

export const useCancelarSaidaCargoComposicaoVacancia = () => {
    const queryClient = useQueryClient()

    const mutationCancelarSaidaCargoComposicaoVacancia = useMutation({
        mutationFn: ({uuid}) => {
            return patchCancelarSaidaCargoComposicaoVacancia(uuid)
        },
        onSuccess: (data) => {
            console.log("Saída cancelada com sucesso ", data)
            queryClient.invalidateQueries(['cargos-da-composicao-vacancia']).then()
            queryClient.invalidateQueries(['status-cadastro-associacao']).then()
            toastCustom.ToastCustomSuccess('Saída cancelada com sucesso.', `O membro voltou a ocupar o cargo normalmente.`)
        },
        onError: (error) => {
            console.log("Erro ao cancelar saída ", error.response)
            toastCustom.ToastCustomError('Erro ao cancelar saída.', extraiMensagemDeErroVacancia(error))
        },
        onSettled: () => {
        },
    })
    return {mutationCancelarSaidaCargoComposicaoVacancia}
}