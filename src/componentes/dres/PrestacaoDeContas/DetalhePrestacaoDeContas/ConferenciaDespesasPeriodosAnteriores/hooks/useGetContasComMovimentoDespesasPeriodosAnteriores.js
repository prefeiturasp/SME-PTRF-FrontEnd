import { useQuery } from "@tanstack/react-query";
import { getContasComMovimentoDespesasPeriodosAnteriores } from "../../../../../../services/dres/PrestacaoDeContas.service";

export const useGetContasComMovimentoDespesasPeriodosAnteriores = (prestacaoDeContasUUID) => {
    const { isLoading, isError, data = [], error, refetch} = useQuery(
        ['contas-com-movimentos-despesas-periodos-anteriores-para-conferencia', 
        prestacaoDeContasUUID,
        ],
        () => getContasComMovimentoDespesasPeriodosAnteriores(prestacaoDeContasUUID),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );

    return {isLoading, isError, data, error, refetch}
}