import { useQuery } from "@tanstack/react-query";
import { getFontesRecursos } from "../../../../../../services/escolas/Paa.service";

export const useGetFontesRecursos = () => {
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ["fontes-recursos"],
    queryFn: () => getFontesRecursos(),
    keepPreviousData: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  return { isLoading: isFetching, isError, data, error, refetch };
};
