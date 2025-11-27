import { useQuery } from "@tanstack/react-query";
import { getAcoesAssociacao } from "../../../../../../../services/escolas/Associacao.service";

export const useGetAcoesAssociacao = (options = {}) => {
  const {
    status,
    isFetching,
    isError,
    data = { results: [] },
    error,
    refetch,
  } = useQuery({
    queryKey: ["acoes-associacao"],
    queryFn: () => getAcoesAssociacao(null, 1000),
    keepPreviousData: true,
    staleTime: 5000,
    refetchOnWindowFocus: true,
    enabled: options.enabled !== false,
    ...options
  });
  return { isLoading: status === "loading", isError, data: data.results, error, refetch, isFetching };
};
