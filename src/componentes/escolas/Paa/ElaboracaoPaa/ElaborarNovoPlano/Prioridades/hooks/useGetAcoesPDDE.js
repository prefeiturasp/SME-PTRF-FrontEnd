import { useQuery } from "@tanstack/react-query";
import { getAcoesPDDE } from "../../../../../../../services/sme/Parametrizacoes.service";

export const useGetAcoesPDDE = ({ enabled }) => {
  const {
    isFetching,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery({
    queryKey: ["acoes-pdde"],
    queryFn: () => getAcoesPDDE("", "",1, 100),
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    enabled: enabled
});

  return { isLoading: isFetching, isError, acoesPdde: data, error, refetch };
};
