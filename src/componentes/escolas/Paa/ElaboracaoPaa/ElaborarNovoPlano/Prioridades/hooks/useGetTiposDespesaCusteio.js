import { useQuery } from "@tanstack/react-query";
import { getTodosTiposDeCusteio } from "../../../../../../../services/sme/Parametrizacoes.service";

export const useGetTiposDespesaCusteio = () => {
  const {
    status,
    isError,
    data = {},
    error,
    refetch,
  } = useQuery({
    queryKey: ["tipos-despesa-custeio"],
    queryFn: () => getTodosTiposDeCusteio(),
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
  });
  return { isLoading: status === "loading", isError, tipos_despesa_custeio: data, error, refetch };
};
