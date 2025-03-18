import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toastCustom} from "../../../../../../../Globais/ToastCustom";
import { vincularUnidadeTipoReceita, vincularUnidadeTipoReceitaEmLote } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { useDispatch } from "react-redux";
import { CustomModalConfirm } from "../../../../../../../Globais/Modal/CustomModalConfirm";

export const useVincularUnidade = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch();

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
            CustomModalConfirm({
                dispatch,
                title: "Restrição do tipo de crédito",
                message: error.response.data.mensagem,
                cancelText: "Ok",
                dataQa: "modal-restricao-vincular-unidade-ao-tipo-de-credito",
            });
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
            CustomModalConfirm({
                dispatch,
                title: "Restrição do tipo de crédito",
                message: error.response.data.mensagem,
                cancelText: "Ok",
                dataQa: "modal-restricao-vincular-unidade-ao-tipo-de-credito-em-lote",
            });
        },
    });

    return {mutationVincularUnidade, mutationVincularUnidadeEmLote}
}