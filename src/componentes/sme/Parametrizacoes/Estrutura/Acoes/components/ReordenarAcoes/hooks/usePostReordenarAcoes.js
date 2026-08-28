import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { postNovaOrdemAcoes } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { useNavigate } from "react-router-dom";

export const usePostReordenarAcoes = (setModalFormConfirmAlterOrdenacao, recursoUuid) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate();

    const mutationPost = useMutation({
        mutationFn: postNovaOrdemAcoes,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['acoes_ordenadas']).then()
            setModalFormConfirmAlterOrdenacao(false);

            navigate('/parametro-acoes', {
                state: { recurso_uuid: recursoUuid },
                replace: true
            }); // Volta para a página de parametrização de ações após o sucesso
            
            toastCustom.ToastCustomSuccess('Ordenação alterada com sucesso!', 'A ordenação na página de resumo dos recursos da UE foi atualizada.')
        },
        onError: (e) => {
            if (e.response?.data?.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao reordenar ações', e.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao reordenar ações', `Não foi possível reordenar as ações`)
            }
        },
    })
    return { mutationPost }
}
