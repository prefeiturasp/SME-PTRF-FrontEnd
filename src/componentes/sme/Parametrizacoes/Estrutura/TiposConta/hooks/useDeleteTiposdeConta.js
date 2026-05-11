import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTipoConta } from "../../../../../../services/sme/Parametrizacoes.service"; 
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteTipodeConta = (setShowModalConfirmDeleteTipoConta, setShowModalForm) => {
    const queryClient = useQueryClient();

    const mutationDelete = useMutation({
        mutationFn: (uuidTipoConta) => {
            return deleteTipoConta(uuidTipoConta);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tiposConta']).then();
            setShowModalConfirmDeleteTipoConta(false);
            toastCustom.ToastCustomSuccess(
              'Remoção do tipo de conta efetuada com sucesso.', 
              'O tipo de conta foi removido do sistema com sucesso.'
            )
            setShowModalForm(false);
        },
        onError: (e) => {
            setShowModalConfirmDeleteTipoConta(false);
            toastCustom.ToastCustomError('Erro na remoção do tipo de conta.', e.response.data.erro ? e.response.data.erro : 'O tipo de conta não foi removido do sistema.')
        },
    });

    return { mutationDelete };
}