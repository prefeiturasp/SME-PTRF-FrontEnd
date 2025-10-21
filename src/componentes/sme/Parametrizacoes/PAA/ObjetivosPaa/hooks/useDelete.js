import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteObjetivosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { ObjetivosPaaContext } from "../context/index";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDelete = () => {

    const queryClient = useQueryClient();
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(ObjetivosPaaContext);

    const mutationDelete = useMutation({
        mutationFn: (uuid) => {
            return deleteObjetivosPaa(uuid);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(['objetivos-paa']).then();
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess(
                "Sucesso!", 
                response.mensagem || "Objetivo excluído com sucesso."
            )
        },
        onError: (error) => {
            if (error && error?.response && error?.response?.data) {
                toastCustom.ToastCustomError(
                    'Erro!',
                    error.response.data?.mensagem || error.response.data?.detail || 'Não foi possível excluir o objetivo.')
            } else {
                toastCustom.ToastCustomError('Erro!', 'Não foi possível excluir o objetivo.') 
            }
            console.error(error)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return { mutationDelete };
}
