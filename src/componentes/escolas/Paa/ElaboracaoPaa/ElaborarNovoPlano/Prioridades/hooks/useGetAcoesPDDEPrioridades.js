import { useQuery } from "@tanstack/react-query";
import { getAcoesPDDEPrioridades } from "../../../../../../../services/escolas/Paa.service";

export const useGetAcoesPDDEPrioridades = ({ paa_uuid, options={} }) => {
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ["acoes-pdde-prioridades"],
    queryFn: () => getAcoesPDDEPrioridades(paa_uuid),
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    ...options
});

  return { isLoading: isFetching, isError, acoesPdde: data, error, refetch };
};
