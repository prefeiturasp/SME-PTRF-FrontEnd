import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { getPaa } from "../../../../../services/sme/Parametrizacoes.service";

export const useGetPaa = (paaUuid) => {
  const query = useQuery({
    queryKey: ["retrieve-paa", paaUuid],
    queryFn: () => getPaa(paaUuid),
    keepPreviousData: true,
    staleTime: 60000, // 1 minuto — dados não são refetchados automaticamente neste período
    gcTime: 60000, // 1 minuto — dados permanecem no cache após o componente ser desmontado
    // refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    enabled: !!paaUuid,
  });

  useEffect(() => {
    if (query.isError) {
      toastCustom.ToastCustomError(
        "Não foi possível carregar o PAA",
        "Verifique se ele existe ou tente novamente.",
      );
    }
  }, [query.isError]);

  useEffect(() => {
    if (query.isSuccess) {
      // OBS: código legado, terá que ser removido quando a componentização estiver completa.
      const response = query.data;
      localStorage.setItem("PAA", response.uuid);
      localStorage.setItem("DADOS_PAA", JSON.stringify(response));
    }
  }, [query.isSuccess]);

  return query;
};
