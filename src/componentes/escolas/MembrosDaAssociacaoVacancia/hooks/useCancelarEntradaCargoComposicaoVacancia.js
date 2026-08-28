import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchCancelarEntradaCargoComposicaoVacancia } from "../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../Globais/ToastCustom";
import { extraiMensagemDeErroVacancia } from "../utils/extraiMensagemDeErroVacancia";

export const useCancelarEntradaCargoComposicaoVacancia = () => {
    const queryClient = useQueryClient()

    const mutationCancelarEntradaCargoComposicaoVacancia = useMutation({
        mutationFn: ({uuid}) => patchCancelarEntradaCargoComposicaoVacancia(uuid),
        onSuccess: () => {
            queryClient.invalidateQueries(['cargos-da-composicao-vacancia']).then()
            queryClient.invalidateQueries(['status-cadastro-associacao']).then()
            toastCustom.ToastCustomSuccess('Entrada cancelada com sucesso.', 'O ocupante do cargo foi removido.')
        },
        onError: (error) => {
            toastCustom.ToastCustomError('Erro ao cancelar entrada.', extraiMensagemDeErroVacancia(error))
        },
        onSettled: () => {},
    })
    return {mutationCancelarEntradaCargoComposicaoVacancia}
}