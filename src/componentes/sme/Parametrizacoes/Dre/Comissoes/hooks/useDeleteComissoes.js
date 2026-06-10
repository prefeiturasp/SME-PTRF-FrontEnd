import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComissao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useComissoesContext } from "./useComissoesContext";

export const useDeleteComissoes = () => {

    const queryClient = useQueryClient();
    const { handleCloseModalForm, setBloquearBtnSalvarForm } = useComissoesContext();

    const mutationDelete = useMutation({
        mutationFn: (uuidComissao) => {
            return deleteComissao(uuidComissao);
        },
        onSuccess: () => {
            // Refaz a lista de comissões
            queryClient.invalidateQueries(['comissoes']).then();
            // Mensagens
            handleCloseModalForm();
            toastCustom.ToastCustomSuccess('Comissão excluída', `A comissão foi excluída com sucesso.`);
        },
        onError: (error) => {
            if (error?.response?.data?.mensagem) {
                toastCustom.ToastCustomError('Erro ao apagar a comissão', error.response.data.mensagem)
            } else {
                toastCustom.ToastCustomError('Erro ao apagar a comissão', `Não foi possível apagar a comissão`)
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return { mutationDelete };
}
