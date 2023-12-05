import {useMutation} from "@tanstack/react-query";
import {patchStatusPresidenteAssociacao} from "../../../../services/escolas/Associacao.service";
import {toastCustom} from "../../../Globais/ToastCustom";

export const usePatchStatusPresidente = () => {
    const mutationPatchStatusPresidenteAssociacao = useMutation({
        mutationFn: ({uuidAssociacao, payload}) => {
            return patchStatusPresidenteAssociacao(uuidAssociacao, payload)
        },
        onSuccess: (data) => {
            console.log("Status Presidente da Associacao editado com sucesso", data)
        },
        onError: (error) => {
            console.log("Erro ao alterar Status Presidente da Associacao ", error.response)
            toastCustom.ToastCustomError('Erro ao alterar Status Presidente da Associacao', `Não foi possível alterar o Status do Presidente da Associacao `)
        },
        onSettled: () => {
        },
    })

    return {mutationPatchStatusPresidenteAssociacao}
}