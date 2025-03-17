import { getTipoReceita } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTipoReceita = (uuid) => {
  const { isLoading, isError, data, error, refetch } = useQuery(
    ["tipo-receita", uuid],
    () => getTipoReceita(uuid),
    {
      keepPreviousData: true,
      staleTime: 5000, // 5 segundos
      refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
      enabled: uuid !== null,
    }
  );

  return { isLoading, isError, data, error, refetch };
};
