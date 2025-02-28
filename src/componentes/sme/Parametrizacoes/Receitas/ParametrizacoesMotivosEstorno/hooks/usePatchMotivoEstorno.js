import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchAlterarMotivoEstorno } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { MotivosEstornoContext } from "../context/MotivosEstorno";

export const usePatchMotivoEstorno = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm} = useContext(MotivosEstornoContext)

    const mutationPatch = useMutation({
        mutationFn: ({UUID, payload}) => {
            return patchAlterarMotivoEstorno(UUID, payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['motivos-estorno']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess(
                'Edição do motivo de estorno realizado com sucesso.',
                'O motivo de estorno foi editado no sistema com sucesso.'
            );
        },
        onError: (e) => {
            const errorMsg = e.response.data?.non_field_errors
            ? 'Já existe um motivo de estorno com esse nome'
            : 'Houve um erro ao tentar fazer essa atualização.';
            toastCustom.ToastCustomError(errorMsg)
        },
    })
    return {mutationPatch}
}