import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAcao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteAcao = (setModalForm) => {
    const queryClient = useQueryClient();

    const mutationDelete = useMutation({
        mutationFn: (uuid) => {
            return deleteAcao(uuid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['acoes']).then();
            setModalForm({ open: false })
            toastCustom.ToastCustomSuccess('Ação excluída com sucesso');
        },
        onError: (e) => {
            if (e.response && e.response.data && e.response.data.detail) {
                toastCustom.ToastCustomError("Exclusão de ação não permitida", e.response.data.detail);
            } else if (e.response && e.response.data && e.response.data.mensagem) {
                toastCustom.ToastCustomError("Exclusão de ação não permitida", e.response.data.mensagem);
            } else {
                toastCustom.ToastCustomError("Erro ao excluir ação", "Houve um erro ao tentar completar a ação.");
            }
        },
    });

    return { mutationDelete };
}
