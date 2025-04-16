import { useQuery } from "@tanstack/react-query";
import { getTotalizadorRecursoProprio } from "../../../../../../../services/escolas/Paa.service";

export const useGetTotalizadorRecursoProprio = (associacaoUUID) => {
  const { isLoading, isError, data, error, refetch } = useQuery(
    ["totalizador-recurso-proprio", associacaoUUID],
    () => getTotalizadorRecursoProprio(associacaoUUID),
    {
      enabled: !!associacaoUUID,
    }
  );

  return { isLoading, isError, data, error, refetch };
};
