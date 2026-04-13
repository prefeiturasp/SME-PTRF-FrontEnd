import { useQuery } from "@tanstack/react-query";
import { getProgramasPddeTotais } from "../../../../../../services/escolas/Paa.service";

export const useGetProgramasPddeTotais = (paa_uuid) => {

  const {
    isFetching,
    isError,
    data = { programas: [], total: {} },
    error,
    refetch,
  } = useQuery({
    queryKey: ["programas-pdde-totais"],
    queryFn: () => getProgramasPddeTotais(paa_uuid),
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
  });
  return { isLoading: isFetching, isError, programas: data.programas, total: data.total, error, refetch };
};
