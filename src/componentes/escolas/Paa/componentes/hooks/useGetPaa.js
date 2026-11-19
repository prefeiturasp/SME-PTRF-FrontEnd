import { useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { getPaa } from "../../../../../services/sme/Parametrizacoes.service";
import { gravarPaaAtivo } from "../../../../../utils/paaAtivoStorage";

export const useGetPaa = (paaUuid) => {
  const query = useQuery({
    queryKey: ["retrieve-paa", paaUuid],
    queryFn: () => getPaa(paaUuid),
    placeholderData: keepPreviousData,
    staleTime: 60000, // 1 minuto — dados não são refetchados automaticamente neste período
    gcTime: 60000, // 1 minuto — dados permanecem no cache após o componente ser desmontado
    // refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    enabled: !!paaUuid,
  });

  const { isError, error, isSuccess, data} = query;

  useEffect(() => {
    if (isError) {
      toastCustom.ToastCustomError(
        "Não foi possível carregar o PAA",
        error?.response?.data?.mensagem || "Verifique se ele existe ou tente novamente.",
      );
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      gravarPaaAtivo(data);
    }
  }, [isSuccess, data]);

  return query;
};
