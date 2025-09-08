import { useQuery } from "@tanstack/react-query";
import { getProgramasPddeTotais } from "../../../../../../../services/escolas/Paa.service";

export const useGetProgramasPddeTotais = () => {
  const {
    isLoading,
    isError,
    data = { programas: [], total: {} },
    error,
    refetch,
  } = useQuery(["programas-pdde-totais"], () => getProgramasPddeTotais(0), {
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
  });
  return { isLoading, isError, programas: data.programas, total: data.total, error, refetch };
};
