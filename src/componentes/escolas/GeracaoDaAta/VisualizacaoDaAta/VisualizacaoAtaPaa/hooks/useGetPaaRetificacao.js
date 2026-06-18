import { useQuery } from "@tanstack/react-query";
import { getPaaRetificacao } from "../../../../../../services/escolas/Paa.service";

export const useGetPaaRetificacao = (paaUuid) => {
  const query = useQuery({
    queryKey: ["retrieve-paa-retificacao-ata", paaUuid],
    queryFn: () => getPaaRetificacao(paaUuid),
    keepPreviousData: true,
    staleTime: 3000,
    gcTime: 3000,
    enabled: !!paaUuid,
    retry: false,
  });

  return query;
};
