import { useQuery } from "@tanstack/react-query";
import { getObjetivosPaa } from "../../../../../../../services/escolas/Paa.service";

export const useGetObjetivosPaa = () => {
  const {
    status,
    isFetching,
    isError,
    data = [],
    error,
    refetch,
  } = useQuery({
    queryKey: ["objetivosPaa"],
    queryFn: () => getObjetivosPaa(),
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: true,
  });

  return {
    isLoading: status === "loading",
    isFetching,
    isError,
    data,
    error,
    refetch,
  };
};
