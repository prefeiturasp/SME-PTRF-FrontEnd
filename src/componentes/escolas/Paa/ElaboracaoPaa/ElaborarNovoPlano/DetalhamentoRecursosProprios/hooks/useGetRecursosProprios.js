import { useQuery } from "@tanstack/react-query";
import { getRecursosProprios } from "../../../../../../../services/escolas/Paa.service";
import { useMemo } from "react";

export const useGetRecursosProprios = (associacaoUUID, page, paaUUID = null) => {
  const {
    status,
    isError,
    data = { count: 0, results: [] },
    error,
    refetch,
  } = useQuery({
    queryKey: ["recursos-proprios", page, paaUUID],
    queryFn: () => getRecursosProprios(associacaoUUID, page, paaUUID),
    keepPreviousData: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!associacaoUUID,
  });
  const count = useMemo(() => data.count, [data]);
  return { isLoading: status === "loading", isError, data, error, count, refetch };
};
