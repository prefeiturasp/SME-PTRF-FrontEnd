import { useQuery } from "@tanstack/react-query";
import { getTotalizadorRecursoProprio } from "../../../../../../../services/escolas/Paa.service";

export const useGetTotalizadorRecursoProprio = (page = 1) => {
  const {
    isLoading,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery(["totalizador-recurso-proprio"], () =>
    getTotalizadorRecursoProprio()
  );

  return { isLoading, isError, data, error, refetch };
};
