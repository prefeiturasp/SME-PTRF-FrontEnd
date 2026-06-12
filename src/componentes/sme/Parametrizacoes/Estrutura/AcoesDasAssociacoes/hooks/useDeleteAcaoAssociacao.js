import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAcaoAssociacao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteAcaoAssociacao = (
    handleCloseModalConfirmDelete,
) => {
    const queryClient = useQueryClient();

    const mutationDelete = useMutation({
        mutationFn: ({ uuid, recurso_uuid }) => {
            return deleteAcaoAssociacao(uuid, recurso_uuid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['acoes-associacoes-parametrizacoes']).then();
            handleCloseModalConfirmDelete();
            toastCustom.ToastCustomSuccess(
                "Ação da associação excluída.", 
                "A ação da associação foi excluída com sucesso."
            )
        },
        onError: (e) => {
            if (e.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError("Exclusão não permitida", e.response?.data?.non_field_errors);
            } else {
                toastCustom.ToastCustomError("Exclusão não permitida", "Houve um erro ao tentar completar ação.");
            }
        },
    });

    return { mutationDelete };
}
