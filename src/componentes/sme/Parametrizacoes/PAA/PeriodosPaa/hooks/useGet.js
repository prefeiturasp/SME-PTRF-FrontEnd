import { getPeriodosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { PeriodosPaaContext } from "../context/index";

export const useGet = () => {

    const {filter, currentPage, rowsPerPage} = useContext(PeriodosPaaContext)

    const { status, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['periodos-paa', filter, currentPage, rowsPerPage],
        queryFn: ()=> getPeriodosPaa(filter, currentPage, rowsPerPage),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true,
    });

    const count = useMemo(() => data.count, [data]);
    const total = useMemo(() => data.results.length, [data]);

    return {isLoading: status === 'loading', isError, data, error, refetch, count, total}

}