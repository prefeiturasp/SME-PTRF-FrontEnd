import { useQuery } from "@tanstack/react-query";
import { getTotalizadorRecursoProprio } from "../../../../../../../services/escolas/Paa.service";

export const useGetTotalizadorRecursoProprio = (associacaoUUID, paaUUID = null) => {
  const { status, isError, data, error, refetch } = useQuery({
    queryKey: ["totalizador-recurso-proprio", associacaoUUID, paaUUID],
    queryFn: () => getTotalizadorRecursoProprio(associacaoUUID, paaUUID),
    enabled: !!associacaoUUID,
  });

  return { isLoading: status === "loading", isError, data, error, refetch };
};
