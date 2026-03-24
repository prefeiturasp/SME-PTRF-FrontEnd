import { useQuery } from "@tanstack/react-query";
import { getRecursosProprios } from "../../../../../../services/escolas/Paa.service";
import { useMemo } from "react";

// evita loop em cada renderização quando data(nos parâmetros) recebe estaticamente o dicionário abaixo
const DEFAULT_DATA = { count: 0, results: [] };

export const useGetRecursosProprios = (associacaoUUID, page, paaUUID = null) => {
  const {
    isFetching,
    isError,
    data = DEFAULT_DATA,
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
  return { isLoading: isFetching, isError, data, error, count, refetch };
};
