import { useQuery } from "@tanstack/react-query";
import { getFontesRecursos } from "../../../../../../../services/escolas/Paa.service";
import { useMemo } from "react";

export const useGetFontesRecursos = () => {
  const {
    isLoading,
    isError,
    data = [],
    error,
    refetch,
  } = useQuery(["fontes-recursos"], () => getFontesRecursos(), {
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnReconnect: false,
  });
  const count = useMemo(() => data.count, [data]);
  return { isLoading, isError, data, error, count, refetch };
};
