import { useQuery } from "@tanstack/react-query";
import { getDatasDeAlteracaoDaComposicaoVacancia } from "../../../../services/MandatosVacancia.service";

export const useGetDatasDeAlteracaoDaComposicaoVacancia = (composicao_uuid) => {
    const { isFetching, isError, data = [], error } = useQuery({
        queryKey: ['datas-de-alteracao-composicao-vacancia', composicao_uuid],
        queryFn: () => getDatasDeAlteracaoDaComposicaoVacancia(composicao_uuid),
        enabled: !!composicao_uuid,
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    return { isLoading: isFetching, isError, data, error }
}