import { useQuery } from "@tanstack/react-query";
import { iniciarAtaPaa } from "../../../../../../../services/escolas/AtasPaa.service";

export const useGetAtaPaaVigente = (paaUuid) => {
  const {
    isLoading,
    isFetching,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery(
    ["ataPaaVigente", paaUuid],
    () => iniciarAtaPaa(paaUuid),
    {
      keepPreviousData: false,
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      enabled: !!paaUuid,
    }
  );

  return {
    isLoading,
    isFetching,
    isError,
    ataPaa: data,
    error,
    refetch,
  };
};
