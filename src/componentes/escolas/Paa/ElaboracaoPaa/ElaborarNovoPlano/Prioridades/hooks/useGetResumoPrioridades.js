import { useQuery } from "@tanstack/react-query";
import { getResumoPrioridades } from "../../../../../../../services/escolas/Paa.service";

export const useGetResumoPrioridades = () => {
  const {
    isLoading,
    isFetching,
    isError,
    data = [],
    error,
    refetch,
  } = useQuery(["prioridades-resumo"], () => getResumoPrioridades(), {
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true
  });
  return {
    isLoading,
    isFetching,
    isError,
    resumoPrioridades: data,
    error,
    refetch
  };
};
