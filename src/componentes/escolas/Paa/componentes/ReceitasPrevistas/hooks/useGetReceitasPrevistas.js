import { useQuery } from "@tanstack/react-query";
import { getPaaReceitasPrevistas } from "../../../../../../services/escolas/Paa.service";


export const useGetReceitasPrevistas = (options = {}) => {
  const getPaaUUID = () => localStorage.getItem("PAA");
  const {
    isFetching,
    isError,
    data = [],
    error,
    refetch,
  } = useQuery({
    queryKey: ["receitas-previstas-paa"],
    queryFn: () => getPaaReceitasPrevistas(getPaaUUID()),
    keepPreviousData: true,
    staleTime: 5000,
    refetchOnWindowFocus: true,
    enabled: options.enabled !== false,
    ...options
  });

  return { isLoading: isFetching, isError, data, error, refetch, isFetching };
};
