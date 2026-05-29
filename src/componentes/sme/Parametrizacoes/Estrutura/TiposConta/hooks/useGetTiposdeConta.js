import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTiposContas, getFiltroTiposContas } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetTiposContas = (filters) => {
    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['tiposContas', filters?.recurso_uuid, filters?.nome],
        queryFn: ()=> {
            // Se não houver recurso_uuid, retorna vazio
            if (!filters.recurso_uuid) {
                return Promise.resolve([]);
            }

            // Se houver nome, adiciona ao filtro
            if (filters.nome) {
                return getFiltroTiposContas(filters.nome, filters.recurso_uuid);
            }

            return getTiposContas(filters.recurso_uuid);
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });
    const count = useMemo(() => data.length, [data]);
    return {isLoading: isFetching, isError, data, error, refetch, count}
}