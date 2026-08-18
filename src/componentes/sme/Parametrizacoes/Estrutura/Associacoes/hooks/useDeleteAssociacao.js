import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAssociacao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteAssociacao = ({
    goToPageListagemAssociacoes,
}) => {

    const queryClient = useQueryClient();

    const mutationDelete = useMutation({
        mutationFn: (uuid) => {
            return deleteAssociacao(uuid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['listagem-associacoes-parametrizacoes']).then();
            toastCustom.ToastCustomSuccess('Associação excluída', `A associação foi excluída com sucesso.`);
            goToPageListagemAssociacoes()
        },
        onError: (error) => {
            if (error?.response?.data?.mensagem) {
                toastCustom.ToastCustomError('Erro ao excluir a associação', error.response.data.mensagem)
            } else {
                toastCustom.ToastCustomError('Erro ao excluir a associação', `Não foi possível excluir a associação`)
            }
        },
    });

    return { mutationDelete };
}
