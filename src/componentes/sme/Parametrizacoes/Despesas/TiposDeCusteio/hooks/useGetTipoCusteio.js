import { getTipoCusteio } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTipoCusteio = (uuid) => {
  const { status, isError, data, error, refetch } = useQuery({
    queryKey: ["tipos-custeio", uuid],
    queryFn: () => getTipoCusteio(uuid),
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    enabled: !!uuid,
  });

  return { isLoading: status === "loading", isError, data, error, refetch };
};
