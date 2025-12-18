import { useMutation } from "@tanstack/react-query";
import { postOutroRecursoPeriodoPaa, postOutrosRecursosPeriodoPaaImportarUnidades } from "../../../../../../../services/sme/Parametrizacoes.service";
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


export const usePostOutroRecursoPeriodoImportarUnidades = () => {
    return useMutation({
        mutationFn: ({uuid, payload}) => {
            return postOutrosRecursosPeriodoPaaImportarUnidades(uuid, payload)
        },
        onSuccess: () => {
            toastCustom.ToastCustomSuccess(`Unidades vinculadas com sucesso!`);
        },
        onError: (e) => {
            toastCustom.ToastCustomError(
                `Erro!`,
                e.response?.data?.non_field_errors ||
                e.response?.data?.detail ||
                'Falha ao importar unidades.'
            )
        },
    })
}