import { useQuery } from "@tanstack/react-query";
import { getTextosPaaUe } from '../../../../../../../services/escolas/PrestacaoDeContas.service';

export const useGetTextosPaa = () => {
  const {
    isFetching,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery({
    queryKey: ["textosPaaUe"],
    queryFn: () => getTextosPaaUe(),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  return {
    isLoading: isFetching,
    isFetching,
    isError,
    textosPaa: data,
    error,
    refetch
  };
};
