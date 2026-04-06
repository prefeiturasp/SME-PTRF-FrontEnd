import { useQuery } from "@tanstack/react-query";
import { getTotalizadorRecursoProprio } from "../../../../../../services/escolas/Paa.service";

export const useGetTotalizadorRecursoProprio = (associacaoUUID, paaUUID = null, config = {}) => {
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ["totalizador-recurso-proprio", associacaoUUID, paaUUID],
    queryFn: () => getTotalizadorRecursoProprio(associacaoUUID, paaUUID),
    enabled: !!associacaoUUID,
    ...config,
  });

  return { isLoading: isFetching, isError, data, error, refetch };
};
