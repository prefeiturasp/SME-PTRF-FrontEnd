import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTodosPeriodos } from "../../services/sme/Parametrizacoes.service";

export const useGetPeriodos = (filters) => {
  const {
    isLoading,
    isError,
    data = [],
    error,
    refetch,
  } = useQuery(
    ["periodos"],
    () => getTodosPeriodos(filters.filtrar_por_referencia),
    {
      keepPreviousData: true,
      staleTime: 5000, // 5 segundos
      refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    }
  );
  const count = useMemo(() => data.length, [data]);
  return { isLoading, isError, data, error, refetch, count };
};
