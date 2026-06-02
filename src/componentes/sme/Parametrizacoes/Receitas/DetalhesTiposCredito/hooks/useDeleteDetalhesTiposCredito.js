import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDetalheTipoCredito } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useDetalhesTiposCreditoContext } from "./useDetalhesTiposCreditoContext";

export const useDeleteDetalhesTiposCredito = () => {

    const queryClient = useQueryClient();
    const { handleCloseModalForm, setBloquearBtnSalvarForm } = useDetalhesTiposCreditoContext();

    const mutationDelete = useMutation({
        mutationFn: (uuidDetalheTipoCredito) => {
            return deleteDetalheTipoCredito(uuidDetalheTipoCredito);
        },
        onSuccess: () => {
            // Refaz a lista de detalhes de tipos de crédito
            queryClient.invalidateQueries(['detalhes-tipos-credito']).then();
            // Mensagens
            handleCloseModalForm();
            toastCustom.ToastCustomSuccess('Detalhe de tipo de crédito excluído', `O detalhe de tipo de crédito foi excluído com sucesso.`);
        },
        onError: (error) => {
            if (error?.response?.data?.mensagem) {
                toastCustom.ToastCustomError('Erro ao apagar o detalhe de tipo de crédito', error.response.data.mensagem)
            } else {
                toastCustom.ToastCustomError('Erro ao apagar o detalhe de tipo de crédito', `Não foi possível apagar o detalhe de tipo de crédito`)
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return { mutationDelete };
}