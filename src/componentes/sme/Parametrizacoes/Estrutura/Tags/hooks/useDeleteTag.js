import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTag } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteTag = (setModalForm) => {
    const queryClient = useQueryClient();

    const mutationDelete = useMutation({
        mutationFn: (uuid) => {
            return deleteTag(uuid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tags']).then();
            setModalForm({ open: false })
            toastCustom.ToastCustomSuccess(
                "Remoção da etiqueta/tag efetuada com sucesso.",
                "A etiqueta/tag foi removida do sistema com sucesso."
            )
        },
        onError: (e) => {
            if (e.response && e.response.data && e.response.data.detail) {
                toastCustom.ToastCustomError("Exclusão de etiqueta/tag não permitida.", e.response.data.detail);
            } else {
                toastCustom.ToastCustomError("Erro ao excluir etiqueta/tag", "Houve um erro ao tentar completar a ação.");
            }
        },
    });

    return { mutationDelete };
}
