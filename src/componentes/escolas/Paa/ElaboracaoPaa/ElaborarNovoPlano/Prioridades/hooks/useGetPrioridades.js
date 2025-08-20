import { useQuery } from "@tanstack/react-query";
import { getPrioridades } from "../../../../../../../services/escolas/Paa.service";


export const useGetPrioridades = (filtros, page) => {
  const {
    isLoading,
    isFetching,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery(
    ["prioridades", page], 
    () => getPrioridades(filtros, page), 
    {
      keepPreviousData: false,
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      enabled: true,
    }
  );

  const dadosProcessados = (data?.results || []).map(item => ({
    ...item,
    acao: item?.acao_associacao_objeto?.nome || item?.acao_pdde_objeto?.nome || "Recurso Próprio",
    valor_total: parseFloat(item.valor_total)
  }));
  return { isLoading, isFetching, isError, prioridades: dadosProcessados, quantidade: data.count, error, refetch };
};
