import { getAssociacoesPeloNome } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetAssociacoesPorNomeERecurso = (params) => {
    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['associacoes-por-nome-e-recurso'],
        queryFn: ()=> {
            if (!params?.recurso_uuid) {
                return Promise.resolve([]);
            }

            return getAssociacoesPeloNome(params?.nome, params?.recurso_uuid)
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    return {isLoading: isFetching, isError, data, error, refetch}

}