import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEspecificacoesMateriaisServicos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDelete = () => {

    const queryClient = useQueryClient();
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(MateriaisServicosContext);

    const mutationDelete = useMutation({
        mutationFn: (uuid) => {
            return deleteEspecificacoesMateriaisServicos(uuid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['especificacoes-materiais-servicos-list']).then();
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess(
                'Exclusão de especificação realizada com sucesso',
                'A especificação foi excluída com sucesso.');
        },
        onError: (error) => {
            let data = error.response.data
            let mensagem = data.mensagem ? data.mensagem : 'Não foi possível excluir a especificação'
            toastCustom.ToastCustomError('Erro ao excluir a especificação', mensagem)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });
    return { mutationDelete };
}
