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
    keepPreviousData: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const count = useMemo(() => data.count, [data]);
  return { isLoading, isError, data, error, count, refetch };
};
