import { getUnidadesNaoVinculadasTipoReceita } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetUnidadesNaoVinculadas = (uuid, page, nome_ou_codigo = '', dre = '') => {
  const { isLoading, isFetching, isError, data, error, refetch } = useQuery(
    ["unidades-nao-vinculadas-tipo-receita", uuid],
    () => getUnidadesNaoVinculadasTipoReceita(uuid, nome_ou_codigo, dre, page),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
      enabled: uuid !== null && uuid !== undefined,
      refetchInterval: 50000,
    }
  );

  const isLoadingOrFetching = isLoading || isFetching;
  
  return { isLoading: isLoadingOrFetching, isError, data, error, refetch };
};
