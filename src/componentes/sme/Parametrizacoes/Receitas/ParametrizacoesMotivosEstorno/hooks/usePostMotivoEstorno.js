import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { postCreateMotivoEstorno } from "../../../../../../services/sme/Parametrizacoes.service";
import { useMotivosEstornoContext } from "./useMotivosEstornoContext";

export const usePostMotivoEstorno = () => {
    const queryClient = useQueryClient();
    const { handleCloseModalForm } = useMotivosEstornoContext();

    const mutationPost = useMutation({
        mutationFn: ({ payload }) => {
            return postCreateMotivoEstorno(payload);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["motivos-estorno"]).then();
            handleCloseModalForm();
            toastCustom.ToastCustomSuccess(
                "Inclusão de motivo de estorno realizado com sucesso.",
                "O motivo do estorno foi adicionado ao sistema com sucesso.",
            );
        },
        onError: (e) => {
            const errorMsg = e.response.data?.non_field_errors
                ? "Já existe um motivo de estorno com esse nome"
                : "Houve um erro ao tentar fazer essa atualização.";
            toastCustom.ToastCustomError(errorMsg);
        },
    });
    return { mutationPost };
};
