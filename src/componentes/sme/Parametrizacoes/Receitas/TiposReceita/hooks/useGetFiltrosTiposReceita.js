import { getFiltrosTipoReceita } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetFiltrosTiposReceita = () => {
  const {
    isLoading,
    isError,
    data = {
      tipos_contas: [],
      tipos: [],
      aceita: [],
      detalhes: [],
    },
    error,
    refetch,
  } = useQuery(["filtros-tipo-de-credito"], () => getFiltrosTipoReceita(), {
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutos antes de ser considerado "stale"
    cacheTime: 10 * 60 * 1000, // 10 minutos antes de ser removido do cache
    refetchOnWindowFocus: false, // Evita refazer a requisição ao trocar de aba
  });

  return { isLoading, isError, data, error, refetch };
};
