import { useQuery } from "@tanstack/react-query";
import { getBemProduzidosComAdquiridos } from "../../../../../services/escolas/BensProduzidos.service";

export const useGetBemProduzidosComAdquiridos = (filtros, page, visao_dre = false) => {
  const { status, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ["list-bemproduzidos-e-adquiridos", page, visao_dre],
    queryFn: () => getBemProduzidosComAdquiridos(filtros, page, visao_dre),
    keepPreviousData: false,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const isLoadingOrFetching = status === "loading" || isFetching;

  return { isLoading: isLoadingOrFetching, isError, data, error, refetch };
};
