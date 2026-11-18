import { useQuery } from "@tanstack/react-query";
import { getRecursosPropriosPrevistos } from "../../../../../../../../services/escolas/Paa.service";
import { getPaaAtivoUuid } from "../../../../../../../../utils/paaAtivoStorage";

const getPaaUuid = () => getPaaAtivoUuid();

export const useGetRecursosPropriosPrevistos = () => {
  const paaUuid = getPaaUuid();

  return useQuery({
    queryKey: ["recursos-proprios-previstos", paaUuid],
    queryFn: () => getRecursosPropriosPrevistos(paaUuid),
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: true,
    enabled: Boolean(paaUuid),
  });
};
