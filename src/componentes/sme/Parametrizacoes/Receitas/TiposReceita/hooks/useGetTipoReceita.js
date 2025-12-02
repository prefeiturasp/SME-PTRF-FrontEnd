import { getTipoReceita } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTipoReceita = (uuid) => {
  const { status, isError, data, error, refetch } = useQuery({
    queryKey: ["tipo-receita", uuid],
    queryFn: () => getTipoReceita(uuid),
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    enabled: !!uuid,
  });

  return { isLoading: status === "loading", isError, data, error, refetch };
};
