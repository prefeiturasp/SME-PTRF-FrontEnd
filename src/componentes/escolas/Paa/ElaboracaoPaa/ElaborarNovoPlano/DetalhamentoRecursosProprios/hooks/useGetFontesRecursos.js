import { useQuery } from "@tanstack/react-query";
import { getFontesRecursos } from "../../../../../../../services/escolas/Paa.service";

export const useGetFontesRecursos = () => {
  const { isLoading, isError, data, error, refetch } = useQuery(
    ["fontes-recursos"],
    () => getFontesRecursos(),
    {
      keepPreviousData: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
  return { isLoading, isError, data, error, refetch };
};
