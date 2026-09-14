import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMandatoVacancia } from "../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../Globais/ToastCustom";

export const usePatchMandatoVacancia = () => {
    const queryClient = useQueryClient();

    const mutationPatch = useMutation({
        mutationFn: ({ uuidMandato, payload }) => patchMandatoVacancia(uuidMandato, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mandatos-vacancia-list'] });
            queryClient.invalidateQueries({ queryKey: ['mandato-mais-recente-vacancia'] });
            toastCustom.ToastCustomSuccess(
                'Edição do período de mandato realizada com sucesso',
                'O período de mandato foi editado com sucesso.'
            );
        },
    });

    return { mutationPatch };
}
