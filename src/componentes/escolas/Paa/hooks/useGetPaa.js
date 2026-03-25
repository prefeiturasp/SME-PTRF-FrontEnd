import { useQuery } from "@tanstack/react-query";
import { getPaa } from "../../../../services/escolas/Paa.service";

export const useGetPaa = (paaUuid) => {
  const query = useQuery({
        queryKey: ["retrieve-paa", paaUuid],
        queryFn: () => getPaa(paaUuid),
        keepPreviousData: true,
        staleTime: 60000, // 1 minuto — dados não são refetchados automaticamente neste período
        gcTime: 60000,   // 1 minuto — dados permanecem no cache após o componente ser desmontado
        // refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        enabled: !!paaUuid,
    });
    if (!query.isError && query.data){
        localStorage.setItem("PAA", query.data.uuid);
        localStorage.setItem("DADOS_PAA", JSON.stringify(query.data));
    }
    return query;
};
