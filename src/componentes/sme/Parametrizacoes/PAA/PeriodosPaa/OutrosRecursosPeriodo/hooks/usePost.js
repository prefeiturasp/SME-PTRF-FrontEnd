import { useMutation } from "@tanstack/react-query";
import { postOutroRecursoPeriodoPaa } from "../../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePostOutroRecursoPeriodo = () => {

    return useMutation({
        mutationFn: ({payload}) => {
            return postOutroRecursoPeriodoPaa(payload)
        },
        onSuccess: () => {
            toastCustom.ToastCustomSuccess(`Recurso habilitado no período.`);
        },
        onError: (e) => {
            toastCustom.ToastCustomError(
                `Erro!`,
                e.response?.data?.non_field_errors ||
                e.response?.data?.detail ||
                e.response?.data?.mensagem ||
                e.response?.data?.periodo_paa ||
                e.response?.data?.outro_recurso ||
                'Falha ao habilitar recurso no período.'
            )
        },
    })
}