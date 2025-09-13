import { useQuery } from "@tanstack/react-query";
import { getBemProduzidosComAdquiridos } from "../../../../../services/escolas/BensProduzidos.service";

export const useGetBemProduzidosComAdquiridos = (filtros, page, visao_dre = false) => {
  const { isLoading, isFetching, isError, data, error, refetch } = useQuery(
    ["list-bemproduzidos-e-adquiridos", page, visao_dre],
    () => getBemProduzidosComAdquiridos(filtros, page, visao_dre),
    {
      keepPreviousData: false,
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      enabled: true,
    }
  );

  const isLoadingOrFetching = isLoading || isFetching;

  return { isLoading: isLoadingOrFetching, isError, data, error, refetch };
};
