import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchReceitaPrevistaPDDE } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePatchReceitaPrevistaPdde = (setModalForm) => {
    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({uuid, payload}) => {
            return patchReceitaPrevistaPDDE(uuid, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['acoes']).then()
            setModalForm({open: false})
            toastCustom.ToastCustomSuccess(
                'Sucesso', 'Edição da Receita Prevista PDDE realizado com sucesso.'
            );
        },
        onError: (e) => {
            toastCustom.ToastCustomError('Ops!', 'Não foi possível atualizar a Receita Prevista PDDE')
        },
    })
    return {mutationPatch}
}