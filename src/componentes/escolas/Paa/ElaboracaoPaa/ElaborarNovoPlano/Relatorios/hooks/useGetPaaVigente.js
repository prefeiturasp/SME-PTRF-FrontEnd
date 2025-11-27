import { useQuery } from "@tanstack/react-query";
import { getPaaVigente } from '../../../../../../../services/sme/Parametrizacoes.service';

export const useGetPaaVigente = (associacaoUuid) => {
  const {
    status,
    isFetching,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery({
    queryKey: ["paaVigente", associacaoUuid],
    queryFn: () => getPaaVigente(associacaoUuid),
    keepPreviousData: false,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    enabled: !!associacaoUuid,
  });

  return { 
    isLoading: status === "loading",
    isFetching, 
    isError, 
    paaVigente: data, 
    error, 
    refetch 
  };
};
