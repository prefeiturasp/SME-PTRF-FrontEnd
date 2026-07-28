import { useQuery } from "@tanstack/react-query";
import { getStatusDelecaoBemProduzido } from "../../../../../services/escolas/BensProduzidos.service";

export const useGetStatusDelecaoBemProduzido = (uuid) => {
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ["status-delecao-bem-produzido", uuid],
    queryFn: () => getStatusDelecaoBemProduzido(uuid),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!uuid,
  });
  return { isLoading: isFetching, isError, data, error, refetch };
};
