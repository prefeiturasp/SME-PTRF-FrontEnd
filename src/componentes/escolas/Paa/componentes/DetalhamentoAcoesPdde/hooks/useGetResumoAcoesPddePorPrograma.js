import { useQuery } from "@tanstack/react-query";
import { getResumoAcoesPddePorPrograma } from "../../../../../../services/escolas/Paa.service";

export const useGetResumoAcoesPddePorPrograma = () => {
  const { isFetching, data = [], error, refetch } = useQuery({
    queryKey: ["resumo-acoes-pdde-programa"],
    queryFn: () => getResumoAcoesPddePorPrograma(),
    refetchOnWindowFocus: true,
  });
  return { isLoading: isFetching, dados: data, error, refetch };
};
