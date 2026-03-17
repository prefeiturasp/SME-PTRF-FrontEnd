import { useQuery } from "@tanstack/react-query";
import { getPaaVigente } from '../../../../../../../services/sme/Parametrizacoes.service';

export const useGetPaaVigente = (associacaoUuid) => {
  const {
    isFetching,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery({
    queryKey: ["paaVigente", associacaoUuid],
    queryFn: () => getPaaVigente(associacaoUuid),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    enabled: !!associacaoUuid,
  });

  return {
    isLoading: isFetching,
    isFetching,
    isError,
    paaVigente: data,
    error,
    refetch
  };
};
