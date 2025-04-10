import { useQuery } from "@tanstack/react-query";
import { getRecursosProprios } from "../../../../../../../services/escolas/Paa.service";
import { useMemo } from "react";

export const useGetRecursosProprios = (associacaoUUID, page = 1) => {
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
      cacheTime: 0,
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      enabled: !!associacaoUUID,
    }
  );
  const count = useMemo(() => data.count, [data]);
  return { isLoading, isError, data, error, count, refetch };
};
