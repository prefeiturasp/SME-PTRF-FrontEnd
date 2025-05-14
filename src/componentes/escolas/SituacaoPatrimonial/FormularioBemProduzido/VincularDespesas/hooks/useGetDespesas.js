import { useQuery } from "@tanstack/react-query";
import { getListaDespesasComFiltros } from "../../../../../../services/escolas/Despesas.service";

export const useGetDespesas = (filtros, page) => {
  const { isLoading, isFetching, isError, data, error, refetch } = useQuery(
    ["despesas-situacao-patrimonial", page],
    () => getListaDespesasComFiltros(filtros, page),
    {
      keepPreviousData: false,
      staleTime: 5 * 60 * 1000, // 5 minutos antes de ser considerado "stale"
      cacheTime: 10 * 60 * 1000, // 10 minutos antes de ser removido do cache
      refetchOnWindowFocus: false, // Evita refazer a requisição ao trocar de aba
    }
  );

  const isLoadingOrFetching = isLoading || isFetching;

  return { isLoading: isLoadingOrFetching, isError, data, error, refetch };
};
