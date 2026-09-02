import { useQuery } from "@tanstack/react-query";
import { getTimelineCargoComposicaoVacancia } from "../../../../services/MandatosVacancia.service";

export const useGetTimelineCargoComposicaoVacancia = (composicao_uuid, cargo_associacao) => {
    const { isFetching, isError, data = [], error } = useQuery({
        queryKey: ['timeline-cargo-composicao-vacancia', composicao_uuid, cargo_associacao],
        queryFn: () => getTimelineCargoComposicaoVacancia(composicao_uuid, cargo_associacao),
        enabled: !!composicao_uuid && !!cargo_associacao,
        staleTime: 5000, // 5 segundos
    });

    return { isLoading: isFetching, isError, data, error }
}
