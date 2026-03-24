import { useQuery } from "@tanstack/react-query";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { getPaa } from "../../../../../services/sme/Parametrizacoes.service";
import { useParams } from "react-router-dom";
import { ASSOCIACAO_UUID } from "../../../../../services/auth.service";

import { useEffect } from "react";

export const useGetPaa = (paaUuid = null) => {
  const { uuid_paa } = useParams();

  const uuid = paaUuid || uuid_paa;
  const associacaoUUID = localStorage.getItem(ASSOCIACAO_UUID);

  const query = useQuery({
    queryKey: ["get-paa", uuid],
    queryFn: () => getPaa(uuid, associacaoUUID),
    enabled: !!uuid,
    keepPreviousData: true,
    staleTime: 5000,
    refetchOnWindowFocus: true,
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
      console.log("AQUI: ", response);
      localStorage.setItem("PAA", response.uuid);
      localStorage.setItem("DADOS_PAA", JSON.stringify(response));
    }
  }, [query.isSuccess]);

  return {
    isLoading: query.isFetching,
    isError: query.isError,
    paaDados: query.data,
    error: query.error,
    refetch: query.refetch,
  };
};
