import { getTabelaFiqueDeOlho } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTabelaFiqueDeOlho = () => {
    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['tabela-fique-de-olho-parametrizacoes'],
        queryFn: getTabelaFiqueDeOlho,
        keepPreviousData: false,
        staleTime: 5000,
        refetchOnWindowFocus: false,
        retry: 0,
    });

    return {isLoading: isFetching, isError, data, error, refetch}

}
