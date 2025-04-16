import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchAcoesPDDE } from "../../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePatchAcaoPdde = (setModalForm) => {
    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({uuid, payload}) => {
            return patchAcoesPDDE(uuid, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['acoes']).then()
            setModalForm({open: false})
            toastCustom.ToastCustomSuccess(
                'Sucesso', 'Edição da Ação PDDE realizado com sucesso.'
            );
        },
        onError: (e) => {
            toastCustom.ToastCustomError('Ops!', 'Não foi possível atualizar a Ação PDDE')
        },
    })
    return {mutationPatch}
}