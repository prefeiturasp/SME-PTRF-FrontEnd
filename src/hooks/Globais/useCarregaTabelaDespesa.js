import { useQuery } from "@tanstack/react-query";
import { getDespesasTabelas } from "../../services/escolas/Despesas.service";

export const useCarregaTabelaDespesa = (prestacaoDeContas = null) => {
  const associacaoUuid = prestacaoDeContas?.associacao?.uuid;

  const { data } = useQuery({
    queryKey: ["tabelas-despesa", associacaoUuid],
    queryFn: () => getDespesasTabelas(associacaoUuid),
    keepPreviousData: true,
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });

  return data;
};
