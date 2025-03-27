import { useQuery } from "@tanstack/react-query";
import { getAcoesAssociacao } from "../../../../../../../services/escolas/Associacao.service";

export const useGetAcoesAssociacao = () => {
  const {
    isLoading,
    isError,
    data = { results: [] },
    error,
    refetch,
  } = useQuery(["acoes-associacao"], () => getAcoesAssociacao(), {
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
  });
  return { isLoading, isError, data: data.results, error, refetch };
};
