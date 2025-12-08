import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePeriodosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDelete = () => {

    const queryClient = useQueryClient();

    const mutationDelete = useMutation({
        mutationFn: (uuid) => {
            return deletePeriodosPaa(uuid);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(['periodos-paa']).then();
            toastCustom.ToastCustomSuccess(
                "Remoção do período efetuada com sucesso.", 
                response.mensagem || "O período foi removido com sucesso."
            )
        },
        onError: (error) => {
            if (error && error.response && error.response.data && error.response.data.mensagem) {
                toastCustom.ToastCustomError('Erro ao remover período de PAA', error.response.data.mensagem)
            }else if (error && error.response && error.response.data && error.response.data.non_field_errors) {
                toastCustom.ToastCustomError('Erro ao remover período de PAA', error.response.data.non_field_errors)
            } else {
                toastCustom.ToastCustomError('Erro ao remover período de PAA', `Não foi possível excluir o período de PAA`)
            }
        },
    });

    return { mutationDelete };
}
