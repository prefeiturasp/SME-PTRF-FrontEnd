import { getFiqueDeOlho } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetFiqueDeOlho = ({ filters }) => {
    const { isFetching, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['fique-de-olho-parametrizacoes', filters],
        queryFn: ()=> {
            if (filters?.is_required_recurso_uuid && !filters?.recurso_uuid) {
                return {count: 0, results: []}
            }

            return getFiqueDeOlho(filters)
        },
        keepPreviousData: false,
        staleTime: 5000,
        refetchOnWindowFocus: false,
        retry: 0,
    });

    const count = useMemo(() => data.count, [data]);

    return {isLoading: isFetching, isError, data, error, refetch, count}

}
