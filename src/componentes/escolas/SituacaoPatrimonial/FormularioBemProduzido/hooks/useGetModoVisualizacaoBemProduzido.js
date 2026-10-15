import { useQuery } from "@tanstack/react-query";
import { getModoVisualizacaoBemProduzido } from "../../../../../services/escolas/BensProduzidos.service";

export const useGetModoVisualizacaoBemProduzido = (uuid) => {
  const { isFetching, isError, data, error } = useQuery({
    queryKey: ["modo-visualizacao-bem-produzido", uuid],
    queryFn: () => getModoVisualizacaoBemProduzido(uuid),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!uuid,
  });
  return { isLoading: isFetching, isError, data, error };
};
