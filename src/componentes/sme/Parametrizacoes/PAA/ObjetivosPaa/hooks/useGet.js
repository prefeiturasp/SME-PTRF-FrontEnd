import { getObjetivosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { ObjetivosPaaContext } from "../context/index";

export const useGet = () => {

    const {filter, currentPage, rowsPerPage} = useContext(ObjetivosPaaContext)

    const { isLoading, isError, data = {count: 0, results: []}, error, refetch } = useQuery(
        ['objetivos-paa', filter, currentPage, rowsPerPage],
        ()=> getObjetivosPaa(filter, currentPage, rowsPerPage),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true,
        }
    );

    const count = useMemo(() => data.count, [data]);
    const total = useMemo(() => data.results.length, [data]);

    return {isLoading, isError, data, error, refetch, count, total}

}