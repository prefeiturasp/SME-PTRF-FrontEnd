import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { MotivosEstornoContext } from "../context/MotivosEstorno";
import { postCreateMotivoEstorno } from "../../../../../../services/sme/Parametrizacoes.service";

export const usePostMotivoEstorno = () => {

    const queryClient = useQueryClient()
    const {setShowModalForm} = useContext(MotivosEstornoContext)

    const mutationPost = useMutation({
        mutationFn: ({payload}) => {
            return postCreateMotivoEstorno(payload)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['motivos-estorno']).then()
            setShowModalForm(false)
            toastCustom.ToastCustomSuccess(
                'Inclusão de motivo de estorno realizado com sucesso.',
                'O motivo do estorno foi adicionado ao sistema com sucesso.'
            );
        },
        onError: (e) => {
            const errorMsg = e.response.data?.non_field_errors
            ? 'Já existe um motivo de estorno com esse nome'
            : 'Houve um erro ao tentar fazer essa atualização.';
            toastCustom.ToastCustomError(errorMsg)
        },
    })
    return {mutationPost}
}