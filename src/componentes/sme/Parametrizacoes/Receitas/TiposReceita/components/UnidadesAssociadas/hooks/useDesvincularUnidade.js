import {useMutation, useQueryClient} from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {toastCustom} from "../../../../../../../Globais/ToastCustom";
import { desvincularUnidadeTipoReceita, desvincularUnidadeTipoReceitaEmLote } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { CustomModalConfirm } from "../../../../../../../Globais/Modal/CustomModalConfirm";

export const useDesvincularUnidade = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch();

    const mutationDesvincularUnidade = useMutation({
        mutationFn: ({uuid, unidadeUUID}) => {
            return desvincularUnidadeTipoReceita(uuid, unidadeUUID)
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(['unidades-vinculadas-tipo-receita'])
            toastCustom.ToastCustomSuccess("Sucesso!", "Unidade desvinculada ao tipo de crédito com sucesso.")
        },
        onError: (error) => {
            CustomModalConfirm({
                dispatch,
                title: "Restrição do tipo de crédito",
                message: error.response.data.mensagem,
                cancelText: "Ok",
                dataQa: "modal-restricao-desvincular-unidade-ao-tipo-de-credito",
            });
        },
    });

    const mutationDesvincularUnidadeEmLote = useMutation({
        mutationFn: ({uuid, unidadeUUID}) => {
            return desvincularUnidadeTipoReceitaEmLote(uuid, {unidade_uuids: unidadeUUID})
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(['unidades-vinculadas-tipo-receita'])
            toastCustom.ToastCustomSuccess("Sucesso!", "Unidades desvinculadas ao tipo de crédito com sucesso.")
        },
        onError: (error) => {
            CustomModalConfirm({
                dispatch,
                title: "Restrição do tipo de crédito",
                message: error.response.data.mensagem,
                cancelText: "Ok",
                dataQa: "modal-restricao-desvincular-unidade-em-lote-ao-tipo-de-credito",
            });
        },
    });

    return {mutationDesvincularUnidade, mutationDesvincularUnidadeEmLote}
}