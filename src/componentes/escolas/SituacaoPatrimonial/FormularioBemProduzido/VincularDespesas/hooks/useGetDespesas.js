import { useQuery } from "@tanstack/react-query";
import { getListaDespesasSituacaoPatrimonial } from "../../../../../../services/escolas/Despesas.service";

export const useGetDespesas = (filtros, page) => {
  const { status, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ["despesas-situacao-patrimonial", page],
    queryFn: () => getListaDespesasSituacaoPatrimonial(filtros, page),
    keepPreviousData: false,
    staleTime: 5 * 60 * 1000, // 5 minutos antes de ser considerado "stale"
    cacheTime: 10 * 60 * 1000, // 10 minutos antes de ser removido do cache
    refetchOnWindowFocus: false, // Evita refazer a requisição ao trocar de aba
  });

  const isLoadingOrFetching = status === "loading" || isFetching;

  return { isLoading: isLoadingOrFetching, isError, data, error, refetch };
};
