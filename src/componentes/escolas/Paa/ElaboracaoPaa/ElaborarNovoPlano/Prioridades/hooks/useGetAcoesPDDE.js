import { useQuery } from "@tanstack/react-query";
import { getAcoesPDDE } from "../../../../../../../services/sme/Parametrizacoes.service";

export const useGetAcoesPDDE = ({ enabled }) => {
  const {
    status,
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

  return { isLoading: status === "loading", isError, acoesPdde: data, error, refetch };
};
