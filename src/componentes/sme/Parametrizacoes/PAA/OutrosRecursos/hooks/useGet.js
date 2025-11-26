import { getOutrosRecursos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { OutrosRecursosPaaContext } from "../context/index";

export const useGet = () => {

    const {filter, currentPage, rowsPerPage} = useContext(OutrosRecursosPaaContext)

    const { isLoading, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['outros-recursos', filter, currentPage, rowsPerPage],
        queryFn: ()=> getOutrosRecursos(filter, currentPage, rowsPerPage),
        keepPreviousData: true,
        staleTime: 5000,
        refetchOnWindowFocus: false,
    });

    const count = useMemo(() => data.count, [data]);
    const total = useMemo(() => data.results.length, [data]);

    return {isLoading, isError, data, error, refetch, count, total}

}