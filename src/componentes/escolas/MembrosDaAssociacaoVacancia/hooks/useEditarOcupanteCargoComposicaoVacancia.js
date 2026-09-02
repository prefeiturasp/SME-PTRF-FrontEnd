import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchEditarOcupanteCargoComposicaoVacancia } from "../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../Globais/ToastCustom";
import { extraiMensagemDeErroVacancia } from "../../MembrosDaAssociacaoVacancia/utils/extraiMensagemDeErroVacancia";

export const useEditarOcupanteCargoComposicaoVacancia = () => {
    const queryClient = useQueryClient()

    const mutationEditarOcupanteCargoComposicaoVacancia = useMutation({
        mutationFn: ({uuid, payload}) => {
            return patchEditarOcupanteCargoComposicaoVacancia(uuid, payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['cargos-da-composicao-vacancia']).then()
            toastCustom.ToastCustomSuccess('Membro alterado.', 'Os dados do membro foram atualizados com sucesso.')
        },
        onError: (error) => {
            toastCustom.ToastCustomError('Erro ao alterar membro.', extraiMensagemDeErroVacancia(error))
        },
        onSettled: () => {
        },
    })
    return {mutationEditarOcupanteCargoComposicaoVacancia}
}