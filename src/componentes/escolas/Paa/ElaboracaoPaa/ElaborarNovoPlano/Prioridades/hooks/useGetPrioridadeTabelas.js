import { useQuery } from "@tanstack/react-query";
import { getPrioridadesTabelas } from "../../../../../../../services/escolas/Paa.service";

export const useGetPrioridadeTabelas = ({paa_uuid}) => {
  const { isFetching, isError, data = {}, error, refetch } = useQuery({
    queryKey: ["prioridades-tabelas"],
    queryFn: () => getPrioridadesTabelas(paa_uuid),
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
  });
  return {
    isLoading: isFetching,
    isError,
    prioridadesTabelas: data.prioridades,
    recursos: data.recursos,
    tipos_aplicacao: data.tipos_aplicacao,
    outros_recursos: data.outros_recursos,
    error,
    refetch
  };
};
