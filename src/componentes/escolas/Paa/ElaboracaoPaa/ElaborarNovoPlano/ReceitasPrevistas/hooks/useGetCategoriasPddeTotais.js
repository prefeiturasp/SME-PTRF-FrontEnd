import { useQuery } from "@tanstack/react-query";
import { getCategoriasPddeTotais } from "../../../../../../../services/escolas/Paa.service";

export const useGetCategoriasPddeTotais = () => {
  const {
    isLoading,
    isError,
    data = { categorias: [], total: {} },
    error,
    refetch,
  } = useQuery(["categorias-pdde-totais"], () => getCategoriasPddeTotais(), {
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
  });
  return { isLoading, isError, categorias: data.categorias, total: data.total, error, refetch };
};
