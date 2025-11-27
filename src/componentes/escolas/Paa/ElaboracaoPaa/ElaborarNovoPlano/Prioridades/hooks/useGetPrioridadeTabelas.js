import { useQuery } from "@tanstack/react-query";
import { getPrioridadesTabelas } from "../../../../../../../services/escolas/Paa.service";

export const useGetPrioridadeTabelas = () => {
  const {
    status,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery({
    queryKey: ["prioridades-tabelas"],
    queryFn: () => getPrioridadesTabelas(),
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
  });
  return {
    isLoading: status === "loading",
    isError,
    prioridadesTabelas: data.prioridades,
    recursos: data.recursos,
    tipos_aplicacao: data.tipos_aplicacao,
    error,
    refetch
  };
};
