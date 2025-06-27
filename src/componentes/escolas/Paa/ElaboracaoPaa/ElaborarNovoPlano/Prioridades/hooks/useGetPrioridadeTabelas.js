import { useQuery } from "@tanstack/react-query";
import { getPrioridadesTabelas } from "../../../../../../../services/escolas/Paa.service";

export const useGetPrioridadeTabelas = () => {
  const {
    isLoading,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery(["prioridades-tabelas"], () => getPrioridadesTabelas(), {
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
  });
  return { isLoading, isError, prioridades: data.prioridades, recursos: data.recursos, tipos_aplicacao: data.tipos_aplicacao, error, refetch };
};
