import { useQuery } from "@tanstack/react-query";
import { getAtividadesEstatutariasTabelas } from "../../../../../../../../services/sme/Parametrizacoes.service";

export const useGetAtividadesEstatutariasTabelas = () => {
  const query = useQuery({
    queryKey: ["atividades-estatutarias-tabelas"],
    queryFn: getAtividadesEstatutariasTabelas,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  return query;
};
