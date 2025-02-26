import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMotivoEstorno } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { MotivosEstornoContext } from "../context/MotivosEstorno";

export const useDeleteMotivoEstorno = () => {

    const queryClient = useQueryClient();
    const { setShowModalForm } = useContext(MotivosEstornoContext);

    const mutationDelete = useMutation({
        mutationFn: (uuidMotivoEstorno) => {
            return deleteMotivoEstorno(uuidMotivoEstorno);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['motivos-estorno']).then();
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess(
                'Remoção do motivo de estorno efetuado com sucesso.', 
                'O motivo de estorno foi removido do sistema com sucesso.'
            )
        },
        onError: (e) => {
            if (e.response && e.response.data && e.response.data.mensagem) {
                const errorMsg = e.response.data.mensagem;
                toastCustom.ToastCustomError(errorMsg);
            }
        },
    });

    return { mutationDelete };
}
