import { useQuery } from "@tanstack/react-query";
import { getBemProduzidosComAdquiridos } from "../../../../../services/escolas/BensProduzidos.service";

export const useGetBemProduzidosComAdquiridos = (filtros, page, visao_dre = false, associacaoUuid = null) => {
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ["list-bemproduzidos-e-adquiridos", page, visao_dre, associacaoUuid],
    queryFn: () => getBemProduzidosComAdquiridos(filtros, page, visao_dre, associacaoUuid),
    keepPreviousData: false,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  return { isLoading: isFetching, isError, data, error, refetch };
};
