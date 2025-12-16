import { useMemo } from "react";
import { getOutrosRecursos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetFiltrosOutrosRecursos = () => {

    const { isFetching, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['periodos-outros-recursos'],
        queryFn: ()=> getOutrosRecursos({}, 1, 100),
        keepPreviousData: true,
        staleTime: 5000,
        refetchOnWindowFocus: false,
    });

    const count = useMemo(() => data.count, [data]);
    const total = useMemo(() => data.results.length, [data]);

    return {isLoading: isFetching, isError, data, error, refetch, count, total}

}