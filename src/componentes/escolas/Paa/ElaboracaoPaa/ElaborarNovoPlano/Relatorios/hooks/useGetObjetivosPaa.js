import { useQuery } from "@tanstack/react-query";
import { getObjetivosPaa } from "../../../../../../../services/escolas/Paa.service";

export const useGetObjetivosPaa = () => {
  const {
    isLoading,
    isFetching,
    isError,
    data = [],
    error,
    refetch,
  } = useQuery(["objetivosPaa"], () => getObjetivosPaa(), {
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: true,
  });

  return {
    isLoading,
    isFetching,
    isError,
    data,
    error,
    refetch,
  };
};
