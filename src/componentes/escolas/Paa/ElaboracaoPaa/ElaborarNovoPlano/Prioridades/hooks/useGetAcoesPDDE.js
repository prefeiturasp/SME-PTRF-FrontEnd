import { useQuery } from "@tanstack/react-query";
import { getAcoesPDDE } from "../../../../../../../services/sme/Parametrizacoes.service";

export const useGetAcoesPDDE = ({ enabled }) => {
  const {
    isLoading,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery(["acoes-pdde"], () => getAcoesPDDE("", "",1, 100), {
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    enabled: enabled,
  });

  return { isLoading, isError, acoesPdde: data, error, refetch };
};
