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
      refetchOnWindowFocus: true,
      enabled: true,
    }
  );

  const dadosProcessados = (data?.results || []).map(item => ({
    ...item,
    acao: item?.acao_associacao_objeto?.nome ||
          item?.acao_pdde_objeto?.nome ||
          (item?.recurso === "RECURSO_PROPRIO" ? "Recurso Próprio": ''), /** Considera em branco quando há inativação de Ação no PAA, permitindo ficar em branco na tabela, apena para exibição do botão "Informar Ação" para preenchimento*/
    valor_total: parseFloat(item.valor_total)
  }));
  return { isLoading, isFetching, isError, prioridades: dadosProcessados, quantidade: data.count, error, refetch };
};
