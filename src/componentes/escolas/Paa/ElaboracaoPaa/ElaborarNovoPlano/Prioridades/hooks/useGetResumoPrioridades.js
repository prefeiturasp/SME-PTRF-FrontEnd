import { useQuery } from "@tanstack/react-query";
import { getResumoPrioridades } from "../../../../../../../services/escolas/Paa.service";

export const useGetResumoPrioridades = () => {
  const {
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
    isLoading: isFetching,
    isFetching,
    isError,
    resumoPrioridades: data,
    error,
    refetch
  };
};
