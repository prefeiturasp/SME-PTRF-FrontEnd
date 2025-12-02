import { getAcoesPTRFPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { AcoesPTRFPaaContext } from "../context/index";

export const useGet = () => {

    const {filter, currentPage, rowsPerPage} = useContext(AcoesPTRFPaaContext)

    const { status, isError, data = [], error, refetch } = useQuery({
        queryKey: ['acoes-ptrf-paa', filter, currentPage, rowsPerPage],
        queryFn: ()=> getAcoesPTRFPaa(filter, currentPage, rowsPerPage),
        keepPreviousData: true,
        staleTime: 5000,
        refetchOnWindowFocus: true,
    });

    const count = useMemo(() => data.length, [data]);
    const total = useMemo(() => data.length, [data]);

    return {isLoading: status === 'loading', isError, data, error, refetch, count, total}

}