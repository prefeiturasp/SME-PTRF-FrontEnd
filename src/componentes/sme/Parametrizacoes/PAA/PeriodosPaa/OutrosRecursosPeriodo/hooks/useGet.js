import { useContext, useMemo } from "react";
import { getOutrosRecursos, getOutrosRecursosPeriodoPaa } from "../../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { OutrosRecursosPeriodosPaaContext } from "../context";

export const useGetOutrosRecursosPeriodoPaa = (filtro) => {

    const { isFetching, isError, data={count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['outros-recursos-periodos-paa', JSON.stringify(filtro)],
        queryFn: ()=> getOutrosRecursosPeriodoPaa(filtro, 1, 1),
        keepPreviousData: true,
        staleTime: 5000,
        refetchOnWindowFocus: false,
    });

    return {isLoading: isFetching, isError, data, error, refetch}
}

export const useGetOutrosRecursos = () => {

    const {filter, currentPage, rowsPerPage} = useContext(OutrosRecursosPeriodosPaaContext)

    const { isFetching, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['outros-recursos', filter, currentPage, rowsPerPage],
        queryFn: ()=> getOutrosRecursos(filter, currentPage, rowsPerPage),
        keepPreviousData: true,
        staleTime: 5000,
        refetchOnWindowFocus: false,
    });
    const count = useMemo(() => data.count, [data]);
    const total = useMemo(() => data.results.length, [data]);

    return {isLoading: isFetching, isError, data, error, refetch, count, total}
}


