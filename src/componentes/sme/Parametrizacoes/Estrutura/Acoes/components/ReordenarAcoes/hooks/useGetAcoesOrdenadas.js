import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getListaDeAcoesOrdenadasPorOrdemDeExibicao } from "../../../../../../../../services/sme/Parametrizacoes.service";

export const useGetAcoesOrdenadas = ({ filters }) => {
    const shouldSkip = !filters?.recurso_uuid;

    // Verifica se o token existe antes de permitir a requisição
    const token = localStorage.getItem("TOKEN");
    const isAuthenticated = Boolean(token);

    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['acoes_ordenadas', filters?.recurso_uuid],
        queryFn: () => {
            return getListaDeAcoesOrdenadasPorOrdemDeExibicao(filters?.recurso_uuid)
        },
        enabled: isAuthenticated && !shouldSkip,
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });
    
    const count = useMemo(() => data.length, [data]);
    return { isLoading: isFetching, isError, data, error, refetch, count }
}
