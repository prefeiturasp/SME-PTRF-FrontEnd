import { getAcoesPTRFPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGet = () => {

    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['acoes-ptrf-paa'],
        queryFn: ()=> getAcoesPTRFPaa(),
        keepPreviousData: true,
        staleTime: 5000,
        refetchOnWindowFocus: true,
    });

    const count = useMemo(() => data.length, [data]);
    const total = useMemo(() => data.length, [data]);

    return {isLoading: isFetching, isError, data, error, refetch, count, total}

}