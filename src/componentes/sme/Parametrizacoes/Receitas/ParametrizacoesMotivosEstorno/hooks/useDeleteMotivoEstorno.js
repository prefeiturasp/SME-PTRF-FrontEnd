import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMotivoEstorno } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

import { useMotivosEstornoContext } from "./useMotivosEstornoContext";

export const useDeleteMotivoEstorno = () => {
    const queryClient = useQueryClient();
    const { handleCloseModalForm } = useMotivosEstornoContext();

    const mutationDelete = useMutation({
        mutationFn: (uuidMotivoEstorno) => {
            return deleteMotivoEstorno(uuidMotivoEstorno);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["motivos-estorno"]).then();
            handleCloseModalForm();
            toastCustom.ToastCustomSuccess(
                "Remoção do motivo de estorno efetuado com sucesso.",
                "O motivo de estorno foi removido do sistema com sucesso.",
            );
        },
        onError: (e) => {
            if (e?.response?.data?.mensagem) {
                const errorMsg = e.response.data.mensagem;
                toastCustom.ToastCustomError(errorMsg);
            }
        },
    });

    return { mutationDelete };
};
