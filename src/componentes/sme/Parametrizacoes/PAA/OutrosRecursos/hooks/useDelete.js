import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOutrosRecursos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { OutrosRecursosPaaContext } from "../context/index";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDelete = ({
        onSuccessDelete=()=>{}
    }) => {

    const queryClient = useQueryClient();
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(OutrosRecursosPaaContext);

    const mutationDelete = useMutation({
        mutationFn: (uuid) => {
            return deleteOutrosRecursos(uuid);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries('outros-recursos');
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess(
                "Sucesso!", 
                response.mensagem || "Recurso excluído com sucesso."
            )
            onSuccessDelete?.()
        },
        onError: (error) => {
            if (error && error?.response && error?.response?.data) {
                toastCustom.ToastCustomError(
                    'Erro!',
                    error.response.data?.mensagem || error.response.data?.detail || 'Não foi possível excluir o Recurso.')
            } else {
                toastCustom.ToastCustomError('Erro!', 'Não foi possível excluir o Recurso.') 
            }
            console.error(error)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return { mutationDelete };
}
