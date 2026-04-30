import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTodosPeriodos } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetPeriodos = (filters) => {
    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['periodos', filters.recurso_uuid],
        queryFn: ()=> {
            if (filters.is_required_recurso_uuid && !filters.recurso_uuid) {
                return Promise.resolve([]);
            }

            return getTodosPeriodos(filters.filtrar_por_referencia, filters.recurso_uuid)
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });
    const count = useMemo(() => data.length, [data]);
    return {isLoading: isFetching, isError, data, error, refetch, count}
}