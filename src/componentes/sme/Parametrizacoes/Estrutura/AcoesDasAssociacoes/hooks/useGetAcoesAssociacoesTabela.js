import { useQuery } from "@tanstack/react-query";
import { getTabelaAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetAcoesAssociacoesTabela = ({ filters }) => {
    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['acoes-associacoes-tabela-parametrizacoes', filters?.recurso_uuid],
        queryFn: ()=> {
            if (filters?.is_required_recurso_uuid && !filters?.recurso_uuid) {
                return Promise.resolve({});
            }

            return getTabelaAssociacoes(filters.recurso_uuid);
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: false,
    });

    return {isLoading: isFetching, isError, data, error, refetch};
}