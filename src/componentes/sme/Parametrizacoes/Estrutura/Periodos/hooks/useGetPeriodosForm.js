import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTodosPeriodos } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetPeriodosForm = ({ filters, is_enabled = false }) => {
    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['periodos-form'],
        queryFn: ()=> {
            if (filters?.is_required_recurso_uuid && !filters?.recurso_uuid) {
                return Promise.resolve([]);
            }

            return getTodosPeriodos('', filters?.recurso_uuid)
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: false, // Caso saia da aba e voltar ele refaz a requisição
        enabled: is_enabled
    });
    const count = useMemo(() => data.length, [data]);
    return {isLoading: isFetching, isError, data, error, refetch, count}
}