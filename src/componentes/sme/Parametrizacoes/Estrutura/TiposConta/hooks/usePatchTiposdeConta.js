import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchTipoConta } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchTiposDeConta = (setShowModalForm) => {
    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({UUID, payload}) => {
            return patchTipoConta(UUID, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tiposContas']).then()
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess('Edição do tipo de conta realizada com sucesso.', 'O tipo de conta foi editado no sistema com sucesso.')
        },
        onError: (e) => {
            if (e.response.data && e.response.data.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao editar tipo de conta.', 'Já existe um tipo de conta com esse nome.')
            } else {
                toastCustom.ToastCustomError('Erro ao editar tipo de conta.', 'Houve um erro ao tentar editar o tipo de conta.')
            }
        },
    })
    return {mutationPatch}
}