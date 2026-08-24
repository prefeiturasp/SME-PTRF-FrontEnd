import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getListaDeAcoes, getAcoesFiltradas } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetAcoes = ({ filters }) => {
    const hasFilters = filters?.filtrar_por_nome;
    const shouldSkip = filters?.is_required_recurso_uuid && !filters?.recurso_uuid;

    // Verifica se o token existe antes de permitir a requisição
    const token = localStorage.getItem("TOKEN");
    const isAuthenticated = Boolean(token);

    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['acoes', filters?.filtrar_por_nome, filters?.recurso_uuid],
        queryFn: () => {
            if (hasFilters) {
                return getAcoesFiltradas(filters?.filtrar_por_nome, filters?.recurso_uuid)
            }
            return getListaDeAcoes(filters?.recurso_uuid)
        },
        enabled: isAuthenticated && !shouldSkip,
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });
    
    const count = useMemo(() => data.length, [data]);
    return { isLoading: isFetching, isError, data, error, refetch, count }
}
