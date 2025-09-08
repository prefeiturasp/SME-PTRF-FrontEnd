import { useQuery } from "@tanstack/react-query";
import { getAcoesAssociacao } from "../../../../../../../services/escolas/Associacao.service";

export const useGetAcoesAssociacao = (options = {}) => {
  const {
    isLoading,
    isFetching,
    isError,
    data = { results: [] },
    error,
    refetch,
  } = useQuery(["acoes-associacao"], () => getAcoesAssociacao(null, 1000), {
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: options.enabled !== false,
    ...options
  });
  return { isLoading, isError, data: data.results, error, refetch, isFetching };
};
