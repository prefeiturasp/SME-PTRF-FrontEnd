import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMandatoVacancia } from "../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../Globais/ToastCustom";

export const useDeleteMandatoVacancia = () => {
    const queryClient = useQueryClient();

    const mutationDelete = useMutation({
        mutationFn: ({ uuid }) => deleteMandatoVacancia(uuid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mandatos-vacancia-list'] });
            queryClient.invalidateQueries({ queryKey: ['mandato-mais-recente-vacancia'] });
            toastCustom.ToastCustomSuccess(
                'Exclusão do período de mandato realizada com sucesso',
                'O período de mandato foi excluído com sucesso.'
            );
        },
    });

    return { mutationDelete };
}
