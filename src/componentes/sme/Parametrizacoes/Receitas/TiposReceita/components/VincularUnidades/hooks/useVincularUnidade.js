import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toastCustom} from "../../../../../../../Globais/ToastCustom";
import { vincularUnidadeTipoReceita, vincularUnidadeTipoReceitaEmLote } from "../../../../../../../../services/sme/Parametrizacoes.service";

export const useVincularUnidade = () => {
    const queryClient = useQueryClient()

    const mutationVincularUnidade = useMutation({
        mutationFn: ({uuid, unidadeUUID}) => {
            return vincularUnidadeTipoReceita(uuid, unidadeUUID)
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(['unidades-vinculadas-tipo-receita']);
            queryClient.invalidateQueries(['unidades-nao-vinculadas-tipo-receita']);
            toastCustom.ToastCustomSuccess("Sucesso!", "Unidade vinculada ao tipo de crédito com sucesso.")
        },
        onError: (error) => {
            toastCustom.ToastCustomError("Houve um erro ao vincular unidade ao tipo de crédito.")
        },
    });

    const mutationVincularUnidadeEmLote = useMutation({
        mutationFn: ({uuid, unidadeUUID}) => {
            return vincularUnidadeTipoReceitaEmLote(uuid, {unidade_uuids: unidadeUUID})
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(['unidades-vinculadas-tipo-receita']);
            queryClient.invalidateQueries(['unidades-nao-vinculadas-tipo-receita']);
            toastCustom.ToastCustomSuccess("Sucesso!", "Unidades vinculadas ao tipo de crédito com sucesso.")
        },
        onError: (error) => {
            toastCustom.ToastCustomError("Houve um erro ao vincular unidades em lote ao tipo de crédito.")
        },
    });

    return {mutationVincularUnidade, mutationVincularUnidadeEmLote}
}