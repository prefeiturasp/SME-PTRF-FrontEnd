import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchAlterarMotivoEstorno } from "../../../../../../services/sme/Parametrizacoes.service";
import { useMotivosEstornoContext } from "./useMotivosEstornoContext";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchMotivoEstorno = () => {
    const queryClient = useQueryClient();
    const { handleCloseModalForm } = useMotivosEstornoContext();
    const mutationPatch = useMutation({
        mutationFn: ({ uuidMotivoEstorno, payload }) => {
            return patchAlterarMotivoEstorno(uuidMotivoEstorno, payload);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["motivos-estorno"]).then();
            handleCloseModalForm();
            toastCustom.ToastCustomSuccess(
                "Edição do motivo de estorno realizado com sucesso.",
                "O motivo de estorno foi editado no sistema com sucesso.",
            );
        },
        onError: (e) => {
            const errorMsg = e.response.data?.non_field_errors
                ? "Já existe um motivo de estorno com esse nome"
                : "Houve um erro ao tentar fazer essa atualização.";
            toastCustom.ToastCustomError(errorMsg);
        },
    });
    return { mutationPatch };
};
