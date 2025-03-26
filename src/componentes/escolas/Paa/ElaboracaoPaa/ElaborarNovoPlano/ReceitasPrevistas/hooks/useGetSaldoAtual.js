import { useQuery } from "@tanstack/react-query";
import { getSaldoAtualPorAcaoAssociacao } from "../../../../../../../services/escolas/Paa.service";

export const useGetSaldoAtual = (acaoAssociacaoUUID) => {
  const { isLoading, isError, data, error, refetch } = useQuery(
    ["saldo-atual", acaoAssociacaoUUID],
    () => getSaldoAtualPorAcaoAssociacao(acaoAssociacaoUUID),
    {
      cacheTime: 0,
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      enabled: !!acaoAssociacaoUUID,
    }
  );
  return { isLoading, isError, data, error, refetch };
};
