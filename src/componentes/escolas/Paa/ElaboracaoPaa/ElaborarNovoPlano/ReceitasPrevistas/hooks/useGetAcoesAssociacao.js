import { useQuery } from "@tanstack/react-query";
import { getAcoesAssociacao } from "../../../../../../../services/escolas/Associacao.service";

export const useGetAcoesAssociacao = () => {
  const {
    isLoading,
    isFetching,
    isError,
    data = { results: [] },
    error,
    refetch,
  } = useQuery(["acoes-associacao"], () => getAcoesAssociacao(), {
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
  return { isLoading, isError, data: data.results, error, refetch, isFetching };
};
