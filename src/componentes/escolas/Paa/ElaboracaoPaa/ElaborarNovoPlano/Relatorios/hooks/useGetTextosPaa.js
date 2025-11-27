import { useQuery } from "@tanstack/react-query";
import { getTextosPaaUe } from '../../../../../../../services/escolas/PrestacaoDeContas.service';

export const useGetTextosPaa = () => {
  const {
    status,
    isFetching,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery({
    queryKey: ["textosPaaUe"],
    queryFn: () => getTextosPaaUe(), 
    keepPreviousData: false,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  return { 
    isLoading: status === "loading", 
    isFetching, 
    isError, 
    textosPaa: data, 
    error, 
    refetch 
  };
};
