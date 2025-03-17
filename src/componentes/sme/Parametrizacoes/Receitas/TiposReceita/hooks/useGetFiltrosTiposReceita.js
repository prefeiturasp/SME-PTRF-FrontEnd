import { getFiltrosTipoReceita } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetFiltrosTiposReceita = () => {
  const {
    isLoading,
    isError,
    data = {
      tipos_contas: [],
      tipos: [],
      aceita: [],
      detalhes: [],
    },
    error,
    refetch,
  } = useQuery(["tipos-conta"], () => getFiltrosTipoReceita(), {
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
  });

  return { isLoading, isError, data, error, refetch };
};
