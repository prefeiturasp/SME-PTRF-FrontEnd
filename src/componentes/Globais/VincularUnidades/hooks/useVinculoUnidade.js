import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toastCustom} from "../../../Globais/ToastCustom";
import { useDispatch } from "react-redux";
import { CustomModalConfirm } from "../../../Globais/Modal/CustomModalConfirm";

export const useVincularUnidade = (apiService, onSuccess) => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: ({uuid, unidade_uuid}) => {
            return apiService(uuid, unidade_uuid)
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [`unidades-vinculadas`, variables.uuid], exact: false });
            queryClient.invalidateQueries({ queryKey: [`unidades-nao-vinculadas`, variables.uuid], exact: false });
            toastCustom.ToastCustomSuccess(
                "Sucesso!", 
                data?.mensagem || "Unidade vinculada com sucesso.")
            onSuccess?.()
        },
        onError: (error) => {
            CustomModalConfirm({
                dispatch,
                title: "Erro ao vincular unidade",
                message: error?.response?.data?.mensagem ||
                            error?.response?.data?.detail ||
                            error?.response?.data?.non_field_errors ||
                            error?.response?.data ||
                            "Falha ao tentar vincular unidade",
                cancelText: "Ok",
                dataQa: "modal-vincular-unidade",
            });
        },
    });
}
export const useVincularUnidadeEmLote = (apiService, onSuccess) => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: ({uuid, unidade_uuids}) => {
            return apiService(uuid, {unidade_uuids})
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [`unidades-vinculadas`, variables.uuid], exact: false });
            queryClient.invalidateQueries({ queryKey: [`unidades-nao-vinculadas`, variables.uuid], exact: false });
            toastCustom.ToastCustomSuccess(
                "Sucesso!",
                data?.mensagem || "Unidades vinculadas com sucesso.")
            onSuccess?.()
        },
        onError: (error) => {
            CustomModalConfirm({
                dispatch,
                title: "Erro ao vincular unidade",
                message: error?.response?.data?.mensagem ||
                            error?.response?.data?.detail ||
                            error?.response?.data?.non_field_errors ||
                            error?.response?.data ||
                            "Falha ao tentar vincular unidades em lote",
                cancelText: "Ok",
                dataQa: "modal-vincular-unidades-em-lote",
            });
        },
    });
}

export const useDesvincularUnidade = (apiService, onSuccess) => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: ({uuid, unidade_uuid}) => {
            return apiService(uuid, unidade_uuid)
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [`unidades-vinculadas`, variables.uuid], exact: false });
            queryClient.invalidateQueries({ queryKey: [`unidades-nao-vinculadas`, variables.uuid], exact: false });
            toastCustom.ToastCustomSuccess(
                "Sucesso!",
                data?.mensagem || "Unidade desvinculada com sucesso.")
            onSuccess?.()
        },
        onError: (error, variables) => {
            CustomModalConfirm({
                dispatch,
                title: "Erro ao desvincular unidade",
                message: error?.response?.data?.mensagem ||
                            error?.response?.data?.detail ||
                            error?.response?.data?.non_field_errors ||
                            error?.response?.data ||
                            "Falha ao tentar desvincular unidade",
                cancelText: "Ok",
                dataQa: "modal-erro-desvincular-unidade",
            });

            if(error?.response?.status === 404){
                queryClient.invalidateQueries({ queryKey: [`unidades-vinculadas`, variables.uuid], exact: false });
                queryClient.invalidateQueries({ queryKey: [`unidades-nao-vinculadas`, variables.uuid], exact: false });
            }
        },
    });
}

export const useDesvincularUnidadeEmLote = (apiService, onSuccess) => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: ({uuid, unidade_uuids}) => {
            return apiService(uuid, {unidade_uuids})
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [`unidades-vinculadas`, variables.uuid], exact: false });
            queryClient.invalidateQueries({ queryKey: [`unidades-nao-vinculadas`, variables.uuid], exact: false });
            toastCustom.ToastCustomSuccess(
                "Sucesso!",
                data?.mensagem || "Unidades desvinculadas com sucesso.")
            onSuccess?.()
        },
        onError: (error, variables) => {
            CustomModalConfirm({
                dispatch,
                title: "Erro ao desvincular unidade",
                message: error?.response?.data?.mensagem ||
                            error?.response?.data?.detail ||
                            error?.response?.data?.non_field_errors ||
                            error?.response?.data ||
                            "Falha ao tentar desvincular unidades em lote",
                cancelText: "Ok",
                dataQa: "modal-erro-desvincular-unidade-em-lote",
            });

            if(error?.response?.status === 404){
                queryClient.invalidateQueries({ queryKey: [`unidades-vinculadas`, variables.uuid], exact: false });
                queryClient.invalidateQueries({ queryKey: [`unidades-nao-vinculadas`, variables.uuid], exact: false });
            }
        },
    });

}