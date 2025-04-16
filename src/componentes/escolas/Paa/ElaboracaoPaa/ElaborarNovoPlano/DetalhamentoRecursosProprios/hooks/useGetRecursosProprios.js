import { useQuery } from "@tanstack/react-query";
import { getRecursosProprios } from "../../../../../../../services/escolas/Paa.service";
import { useMemo } from "react";

export const useGetRecursosProprios = (associacaoUUID, page) => {
  const {
    isLoading,
    isError,
    data = { count: 0, results: [] },
    error,
    refetch,
  } = useQuery(
    ["recursos-proprios", page],
    () => getRecursosProprios(associacaoUUID, page),
    {
      keepPreviousData: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      enabled: !!associacaoUUID,
    }
  );
  const count = useMemo(() => data.count, [data]);
  return { isLoading, isError, data, error, count, refetch };
};
