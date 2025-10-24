import { useQuery } from "@tanstack/react-query";
import { getPaaReceitasPrevistas } from "../../../../../../../services/escolas/Paa.service";


export const useGetReceitasPrevistas = (options = {}) => {
  const getPaaUUID = () => localStorage.getItem("PAA");
  const {
    isLoading,
    isFetching,
    isError,
    data = [],
    error,
    refetch,
  } = useQuery(["receitas-previstas-paa"], () => getPaaReceitasPrevistas(getPaaUUID()), {
    keepPreviousData: true,
    staleTime: 5000,
    refetchOnWindowFocus: true,
    enabled: options.enabled !== false,
    ...options
  });

  return { isLoading, isError, data, error, refetch, isFetching };
};
