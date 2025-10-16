import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAtividadesEstatutarias } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { AtividadesEstatutariasContext } from "../context/index";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDelete = () => {

    const queryClient = useQueryClient();
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(AtividadesEstatutariasContext);

    const mutationDelete = useMutation({
        mutationFn: (uuid) => {
            return deleteAtividadesEstatutarias(uuid);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(['atividades-estatutarias']).then();
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess(
                "Sucesso!", 
                response.mensagem || "Atividade Estatutária excluída com sucesso."
            )
        },
        onError: (error) => {
            if (error && error?.response && error?.response?.data) {
                toastCustom.ToastCustomError(
                    'Erro!',
                    error.response.data?.mensagem || error.response.data?.detail || 'Não foi possível excluir a atividade estatutária.')
            } else {
                toastCustom.ToastCustomError('Erro!', 'Não foi possível excluir a atividade estatutária.') 
            }
            console.error(error)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return { mutationDelete };
}
