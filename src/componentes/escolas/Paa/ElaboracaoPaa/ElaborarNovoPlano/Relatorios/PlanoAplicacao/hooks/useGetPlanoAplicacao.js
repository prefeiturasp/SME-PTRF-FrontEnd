import { useQuery } from "@tanstack/react-query";
import { getPlanoAplicacao } from "../../../../../../../../services/escolas/Paa.service";

export const useGetPlanoAplicacao = (paaUuid) => {
  const query = useQuery({
    queryKey: ["plano-aplicacao", paaUuid],
    queryFn: () => getPlanoAplicacao(paaUuid),
    enabled: !!paaUuid,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: true,
  });

  return query
};
