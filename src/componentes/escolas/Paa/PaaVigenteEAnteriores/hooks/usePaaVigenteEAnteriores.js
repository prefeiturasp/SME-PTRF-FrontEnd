import { useQuery } from "@tanstack/react-query";
import { getPaaVigenteEAnteriores } from "../../../../../services/escolas/Paa.service";

export const usePaaVigenteEAnteriores = (associacaoUuid) => {
  const {
    data = {},
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery(
    ["paaVigenteEAnteriores", associacaoUuid],
    () => getPaaVigenteEAnteriores(associacaoUuid),
    {
      enabled: !!associacaoUuid,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
    }
  );

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
