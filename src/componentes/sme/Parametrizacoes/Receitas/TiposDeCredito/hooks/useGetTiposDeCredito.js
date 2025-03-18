import { getTiposDeCredito } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetTiposDeCredito = (filter, currentPage) => {

    const { isLoading, isError, data = {count: 0, results: []}, error, refetch } = useQuery(
        ['tipos-de-credito-list', filter, currentPage],
        ()=> getTiposDeCredito(filter, currentPage),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );

    const totalTiposDeCredito = useMemo(() => data.results.length, [data]);
    const count = useMemo(() => data.count, [data]);

    /* console.log("GET TIPOS DE CREDITO", data) */

    return {isLoading, isError, data, error, refetch, totalTiposDeCredito, count}

}