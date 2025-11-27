import { useQuery } from "@tanstack/react-query";
import { getPAAsAnteriores } from "../../../../../../../services/sme/Parametrizacoes.service";

export const useGetPAAsAnteriores = () => {
  const {
    isFetching,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery({
    queryKey: ["paas-anteriores"],
    queryFn: () => getPAAsAnteriores(),
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    enabled: true,
});

  return { isFetching, isError, paas_anteriores: data, error, refetch };
};
