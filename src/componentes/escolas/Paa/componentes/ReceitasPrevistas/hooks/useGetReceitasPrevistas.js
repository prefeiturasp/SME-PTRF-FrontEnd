import { useQuery } from "@tanstack/react-query";
import { getPaaReceitasPrevistas } from "../../../../../../services/escolas/Paa.service";
import { getPaaAtivoUuid } from "../../../../../../utils/paaAtivoStorage";


export const useGetReceitasPrevistas = (options = {}) => {
  const getPaaUUID = () => getPaaAtivoUuid();
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
