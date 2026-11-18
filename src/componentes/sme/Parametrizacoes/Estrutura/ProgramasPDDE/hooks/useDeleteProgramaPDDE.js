import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProgramaPDDE } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteProgramaPDDE = (onSuccessCallback) => {
    const queryClient = useQueryClient();

    const mutationDelete = useMutation({
        mutationFn: (uuid) => {
            return deleteProgramaPDDE(uuid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['programas-pdde']}).then();
            onSuccessCallback && onSuccessCallback()
            toastCustom.ToastCustomSuccess("Sucesso.", "O Programa foi removido do sistema com sucesso.")
        },
        onError: (e) => {
            toastCustom.ToastCustomError(
                "Ops!",
                e?.response?.data?.mensagem || e?.response?.data?.detail || "Não foi possível excluir o Programa."
            );
        },
    });

    return { mutationDelete };
}
