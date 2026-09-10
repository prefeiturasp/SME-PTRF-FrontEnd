import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMandatoVacancia } from "../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../Globais/ToastCustom";

export const usePostMandatoVacancia = () => {
    const queryClient = useQueryClient();

    const mutationPost = useMutation({
        mutationFn: ({ payload }) => postMandatoVacancia(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mandatos-vacancia-list'] });
            queryClient.invalidateQueries({ queryKey: ['mandato-mais-recente-vacancia'] });
            toastCustom.ToastCustomSuccess(
                'Inclusão do período de mandato realizada com sucesso',
                'O período de mandato foi adicionado ao sistema com sucesso.'
            );
        },
    });

    return { mutationPost };
}
