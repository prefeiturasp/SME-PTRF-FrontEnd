import { useQuery } from "@tanstack/react-query";
import { getTextosPaaUe } from '../../../../../../../services/escolas/PrestacaoDeContas.service';

export const useGetTextosPaa = () => {
  const {
    isLoading,
    isFetching,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery(
    ["textosPaaUe"], 
    () => getTextosPaaUe(), 
    {
      keepPreviousData: false,
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      enabled: true,
    }
  );

  return { 
    isLoading, 
    isFetching, 
    isError, 
    textosPaa: data, 
    error, 
    refetch 
  };
};
