import { getUnidadesNaoVinculadasTipoCusteio } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetUnidadesNaoVinculadas = (uuid, page, nome_ou_codigo = "", dre = "") => {
  const { status, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ["unidades-nao-vinculadas-tipo-custeio", uuid],
    queryFn: () => getUnidadesNaoVinculadasTipoCusteio(uuid, nome_ou_codigo, dre, page),
    keepPreviousData: false,
    staleTime: 5 * 60 * 1000, // 5 minutos antes de ser considerado "stale"
    cacheTime: 10 * 60 * 1000, // 10 minutos antes de ser removido do cache
    refetchOnWindowFocus: false, // Evita refazer a requisição ao trocar de aba
    enabled: uuid !== null && uuid !== undefined,
  });

  const isLoadingOrFetching = status === "loading" || isFetching;

  return { isLoading: isLoadingOrFetching, isError, data, error, refetch };
};
