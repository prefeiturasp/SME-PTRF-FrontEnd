import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from 'react-router-dom';
import { postCargoComposicaoVacancia } from "../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../Globais/ToastCustom";
import { extraiMensagemDeErroVacancia } from "../utils/extraiMensagemDeErroVacancia";

export const usePostCargoComposicaoVacancia = () => {
    const queryClient = useQueryClient()
    // const navigate = useNavigate();

    const mutationPostCargoComposicaoVacancia = useMutation({
        mutationFn: ({payload}) => {
            return postCargoComposicaoVacancia(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['cargos-da-composicao-vacancia']).then()
            queryClient.invalidateQueries(['status-cadastro-associacao']).then()
            toastCustom.ToastCustomSuccess('Membro adicionado.', `O membro foi adicionado com sucesso.`)
            // navigate("/membros-da-associacao");
        },
        onError: (error) => {
            console.log("Erro ao criar Cargo da Composição ", error.response)
            toastCustom.ToastCustomError('Erro ao criar Cargo da Composição.', extraiMensagemDeErroVacancia(error))
        },
        onSettled: () => {
        },
    })
    return {mutationPostCargoComposicaoVacancia}
}