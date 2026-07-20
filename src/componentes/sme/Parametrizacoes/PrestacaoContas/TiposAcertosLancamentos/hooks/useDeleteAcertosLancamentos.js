import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAcertosLancamentos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { AcertosLancamentosContext } from "../context/AcertosLancamentos";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteAcertosLancamentos = () => {

    const queryClient = useQueryClient();
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(AcertosLancamentosContext);

    const mutationDelete = useMutation({
        mutationFn: (uuid) => {
            return deleteAcertosLancamentos(uuid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['acertos-lancamentos-list']).then();
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess('Remoção do tipo de acerto em lançamento efetuado com sucesso.', `O tipo de acerto em lançamento foi removido do sistema com sucesso.`);
        },
        onError: (error) => {
            let mensagem = error.response?.data?.mensagem ? error.response.data.mensagem : 'Não foi possível apagar o tipo de acerto em lançamento';
            toastCustom.ToastCustomError('Erro ao remover tipo de acerto em lançamento', mensagem)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return { mutationDelete };
}
