import { useQuery } from "@tanstack/react-query";
import { getPaaVigente } from '../../../../../../../services/sme/Parametrizacoes.service';

export const useGetPaaVigente = (associacaoUuid) => {
  const {
    isLoading,
    isFetching,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery(
    ["paaVigente", associacaoUuid], 
    () => getPaaVigente(associacaoUuid), 
    {
      keepPreviousData: false,
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      enabled: !!associacaoUuid,
    }
  );

  return { 
    isLoading, 
    isFetching, 
    isError, 
    paaVigente: data, 
    error, 
    refetch 
  };
};
