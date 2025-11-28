import { useQuery } from "@tanstack/react-query";
import { getBemProduzido } from "../../../../../services/escolas/BensProduzidos.service";

export const useGetBemProduzido = (uuid) => {
  const { status, isError, data, error, refetch } = useQuery({
    queryKey: ["bem-produzido-detail", uuid],
    queryFn: () => getBemProduzido(uuid),
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    enabled: !!uuid,
  });
  return { isLoading: status === "loading", isError, data, error, refetch };
};
