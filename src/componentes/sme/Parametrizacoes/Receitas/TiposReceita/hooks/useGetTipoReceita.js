import { getTipoReceita } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTipoReceita = (uuid) => {
  const { isLoading, isError, data, error, refetch } = useQuery(
    ["tipo-receita", uuid],
    () => getTipoReceita(uuid),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutos antes de ser considerado "stale"
      cacheTime: 10 * 60 * 1000, // 10 minutos antes de ser removido do cache
      refetchOnWindowFocus: false, // Evita refazer a requisição ao trocar de aba
      enabled: uuid !== null && uuid !== undefined,
    }
  );

  return { isLoading, isError, data, error, refetch };
};
