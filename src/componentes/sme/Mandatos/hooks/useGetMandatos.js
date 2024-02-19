import {getMandatos} from "../../../../services/Mandatos.service";
import {useQuery} from "@tanstack/react-query";
import {useContext, useMemo} from "react";
import {MandatosContext} from "../context/Mandatos";

export const useGetMandatos = () => {

    const {filter, currentPage} = useContext(MandatosContext)

    const { isLoading, isError, data = {count: 0, results: []}, error, refetch, isFetching } = useQuery(
        ['mandatos-list', filter, currentPage],
        ()=> getMandatos(filter, currentPage),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );

    const totalMandatos = useMemo(() => data.results.length, [data]);
    const count = useMemo(() => data.count, [data]);

    return {isLoading, isError, data, error, refetch, totalMandatos, count, isFetching}

}