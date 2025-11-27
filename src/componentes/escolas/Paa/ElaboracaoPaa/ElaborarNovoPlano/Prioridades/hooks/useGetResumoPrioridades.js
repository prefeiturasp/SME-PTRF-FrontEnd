import { useQuery } from "@tanstack/react-query";
import { getResumoPrioridades } from "../../../../../../../services/escolas/Paa.service";

export const useGetResumoPrioridades = () => {
  const {
    status,
    isFetching,
    isError,
    data = [],
    error,
    refetch,
  } = useQuery({
    queryKey: ["prioridades-resumo"],
    queryFn: () => getResumoPrioridades(),
    refetchOnWindowFocus: true
  });
  return {
    isLoading: status === 'loading',
    isFetching,
    isError,
    resumoPrioridades: data,
    error,
    refetch
  };
};
