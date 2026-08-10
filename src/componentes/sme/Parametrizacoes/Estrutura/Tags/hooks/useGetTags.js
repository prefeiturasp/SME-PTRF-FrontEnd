import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTodasTags, getFiltrosTags } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetTags = ({ filters }) => {
    const hasFilters = filters?.filtrar_por_nome || filters?.filtrar_por_status;
    const shouldSkip = filters?.is_required_recurso_uuid && !filters?.recurso_uuid;

    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['tags', filters?.filtrar_por_nome, filters?.filtrar_por_status, filters?.recurso_uuid],
        queryFn: () => {
            if (shouldSkip) {
                return Promise.resolve([]);
            }
            if (hasFilters) {
                return getFiltrosTags(
                    filters?.filtrar_por_nome || '', 
                    filters?.filtrar_por_status || '',
                    filters?.recurso_uuid
                )
            }
            return getTodasTags(filters?.recurso_uuid)
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });
    const count = useMemo(() => data.length, [data]);
    return { isLoading: isFetching, isError, data, error, refetch, count }
}
