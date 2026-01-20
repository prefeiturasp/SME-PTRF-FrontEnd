import { useQuery } from "@tanstack/react-query";
import { getPrioridades } from "../../../../../../../services/escolas/Paa.service";


export const useGetPrioridades = (filtros, page) => {
  const {
    status,
    isFetching,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery({
    queryKey: ["prioridades", page],
    queryFn: () => getPrioridades(filtros, page), 
    keepPreviousData: false,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: true,
    enabled: true,
  });

  const dadosProcessados = (data?.results || []).map(item => ({
    ...item,
    acao: item?.acao_associacao_objeto?.nome ||
          item?.acao_pdde_objeto?.nome ||
          item?.outro_recurso_objeto?.nome ||
          (item?.recurso === "RECURSO_PROPRIO" ? "Recursos Próprios": ''), /** Considera em branco quando há inativação de Ação no PAA, permitindo ficar em branco na tabela, apena para exibição do botão "Informar Ação" para preenchimento*/
    valor_total: parseFloat(item.valor_total)
  }));
  return { isLoading: status === "loading", isFetching, isError, prioridades: dadosProcessados, quantidade: data.count, error, refetch };
};
