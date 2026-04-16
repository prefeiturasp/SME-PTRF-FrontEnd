import { useQuery } from "@tanstack/react-query";
import { getPaaVigenteEAnteriores } from "../../../../../services/escolas/Paa.service";

export const usePaaVigenteEAnteriores = (associacaoUuid) => {
  const {
    data = {},
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["paaVigenteEAnteriores", associacaoUuid],
    queryFn: () => getPaaVigenteEAnteriores(associacaoUuid),
    enabled: !!associacaoUuid,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });

  return {
    data,
    isLoading: isPending,
    isError,
    error,
    refetch,
  };
};
