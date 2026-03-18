import { useQuery } from "@tanstack/react-query";
import { iniciarAtaPaa } from "../../../../../../../services/escolas/AtasPaa.service";

export const useGetAtaPaaVigente = (paaUuid) => {
  const {
    isFetching,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery({
    queryKey: ["ataPaaVigente", paaUuid],
    queryFn: () => iniciarAtaPaa(paaUuid),
    keepPreviousData: false,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    enabled: !!paaUuid,
  });

  return {
    isLoading: isFetching,
    isFetching,
    isError,
    ataPaa: data,
    error,
    refetch,
  };
};
