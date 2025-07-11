import { useQuery } from "@tanstack/react-query";
import { getBemProduzido } from "../../../../../services/escolas/BensProduzidos.service";

export const useGetBemProduzido = (uuid) => {
  const { isLoading, isError, data, error, refetch } = useQuery(
    ["bem-produzido-detail", uuid],
    () => getBemProduzido(uuid),
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
