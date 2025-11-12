import { useQuery } from "@tanstack/react-query";
import { getRecursosPropriosPrevistos } from "../../../../../../../../services/escolas/Paa.service";

const getPaaUuid = () => localStorage.getItem("PAA");

export const useGetRecursosPropriosPrevistos = () => {
  const paaUuid = getPaaUuid();

  return useQuery(
    ["recursos-proprios-previstos", paaUuid],
    () => getRecursosPropriosPrevistos(paaUuid),
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: true,
      enabled: Boolean(paaUuid),
    }
  );
};
