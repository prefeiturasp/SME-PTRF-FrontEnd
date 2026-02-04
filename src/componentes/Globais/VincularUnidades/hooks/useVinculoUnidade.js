import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toastCustom} from "../../../Globais/ToastCustom";

export const useVincularUnidade = (apiService, onSuccess) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({uuid, unidade_uuid, payload}) => {
            return apiService(uuid, unidade_uuid, payload)
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
            //
        },
    });
}
export const useVincularUnidadeEmLote = (apiService, onSuccess) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({uuid, unidade_uuids, payload}) => {
            return apiService(uuid, {unidade_uuids, ...payload})
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
            //
        },
    });
}

export const useDesvincularUnidade = (apiService, onSuccess) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({uuid, unidade_uuid, payload}) => {
            return apiService(uuid, unidade_uuid, payload)
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
            if(error?.response?.status === 404){
                queryClient.invalidateQueries({ queryKey: [`unidades-vinculadas`, variables.uuid], exact: false });
                queryClient.invalidateQueries({ queryKey: [`unidades-nao-vinculadas`, variables.uuid], exact: false });
            }
        },
    });
}

export const useDesvincularUnidadeEmLote = (apiService, onSuccess) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({uuid, unidade_uuids, payload}) => {
            return apiService(uuid, {unidade_uuids, ...payload})
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

            if(error?.response?.status === 404){
                queryClient.invalidateQueries({ queryKey: [`unidades-vinculadas`, variables.uuid], exact: false });
                queryClient.invalidateQueries({ queryKey: [`unidades-nao-vinculadas`, variables.uuid], exact: false });
            }
        },
    });
}

export const useVincularTodasUnidades = (apiService, onSuccess) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({uuid}) => {
            return apiService(uuid)
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [`unidades-vinculadas`, variables.uuid], exact: false });
            queryClient.invalidateQueries({ queryKey: [`unidades-nao-vinculadas`, variables.uuid], exact: false });
            toastCustom.ToastCustomSuccess(
                "Sucesso!",
                data?.mensagem || "Todas unidades vinculadas com sucesso.")
            onSuccess?.()
        },
        onError: (error, variables) => {
            if(error?.response?.status === 404){
                queryClient.invalidateQueries({ queryKey: [`unidades-vinculadas`, variables.uuid], exact: false });
                queryClient.invalidateQueries({ queryKey: [`unidades-nao-vinculadas`, variables.uuid], exact: false });
            }
        },
    });

}