import { getTabelaAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTabelaAssociacaoListagem = () => {
    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['tabela-associacoes-parametrizacoes'],
        queryFn: () => getTabelaAssociacoes(),
        keepPreviousData: false,
        staleTime: 5000,
        refetchOnWindowFocus: false,
        retry: 0,
    });

    return {isLoading: isFetching, isError, data, error, refetch}

}
