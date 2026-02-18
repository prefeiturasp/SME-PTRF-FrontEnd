import { useQuery } from "@tanstack/react-query";
import { getPlanoOrcamentario } from "../../../../../../../../services/escolas/Paa.service";

export const useGetPlanoOrcamentario = (paaUuid, options = {}) => {
  const {
    status,
    isFetching,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery({
    queryKey: ["plano-orcamentario", paaUuid],
    queryFn: () => getPlanoOrcamentario(paaUuid),
    keepPreviousData: true,
    staleTime: 5000,
    refetchOnWindowFocus: true,
    enabled: !!paaUuid && (options.enabled !== false),
    ...options,
  });

  return {
    isLoading: status === "loading",
    isFetching,
    isError,
    data,
    error,
    refetch,
  };
};
