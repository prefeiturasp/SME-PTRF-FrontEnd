import { getTipoReceita } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTipoReceita = (uuid) => {
  const { isLoading, isError, data, error, refetch } = useQuery(
    ["tipo-receita", uuid],
    () => getTipoReceita(uuid),
    {
      cacheTime: 0,
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      enabled: !!uuid,
    }
  );

  return { isLoading, isError, data, error, refetch };
};
