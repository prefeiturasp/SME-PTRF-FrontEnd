import { useQuery } from "@tanstack/react-query";
import { getBemProduzidosComAdquiridos } from "../../../../../services/escolas/BensProduzidos.service";

export const useGetBemProduzidosComAdquiridos = (filtros, page) => {
  const { isLoading, isFetching, isError, data, error, refetch } = useQuery(
    ["list-bemproduzidos-e-adquiridos", page],
    () => getBemProduzidosComAdquiridos(filtros, page),
    {
      keepPreviousData: false,
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  const isLoadingOrFetching = isLoading || isFetching;

  return { isLoading: isLoadingOrFetching, isError, data, error, refetch };
};
