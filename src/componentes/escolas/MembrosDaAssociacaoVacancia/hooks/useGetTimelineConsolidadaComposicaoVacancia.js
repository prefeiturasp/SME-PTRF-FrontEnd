import { useQuery } from "@tanstack/react-query";
import { getTimelineConsolidadaComposicaoVacancia } from "../../../../services/MandatosVacancia.service";

export const useGetTimelineConsolidadaComposicaoVacancia = (composicao_uuid) => {
    // queryKey sem `data`: a timeline completa não depende da data selecionada, então
    // navegar entre datas não dispara nenhuma requisição nova - só filtra em memória.
    const { isFetching, isError, data, error } = useQuery({
        queryKey: ['timeline-consolidada-composicao-vacancia', composicao_uuid],
        queryFn: () => getTimelineConsolidadaComposicaoVacancia(composicao_uuid),
        enabled: !!composicao_uuid,
        staleTime: 5000,
    });

    return { isLoading: isFetching, isError, data, error }
}
