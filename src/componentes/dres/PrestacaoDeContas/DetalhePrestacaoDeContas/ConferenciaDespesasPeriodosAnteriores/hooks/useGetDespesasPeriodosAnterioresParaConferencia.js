import { useQuery } from "@tanstack/react-query";
import { getDespesasPeriodosAnterioresParaConferencia, getUltimaAnalisePc } from "../../../../../../services/dres/PrestacaoDeContas.service";

export const useGetDespesasPeriodosAnterioresParaConferencia = (setLancamentosParaConferencia, params) => {
    const {
        prestacaoDeContasUUID = '',
        analiseUUID = '',
        conta_uuid = '',
        filtrar_por_acao = '',
        filtrar_por_lancamento = '',
        ordenar_por_imposto = '',
        filtrar_por_data_inicio = '',
        filtrar_por_data_fim = '',
        filtrar_por_nome_fornecedor = '',
        filtrar_por_numero_de_documento = '',
        filtrar_por_tipo_de_documento = '',
        filtrar_por_tipo_de_pagamento = '',
        filtrar_por_informacoes = [],
        filtrar_por_conferencia = [],
        editavel = true
    } = params;

    const { status, isFetching, isError, data = [], error, refetch} = useQuery({
        queryKey: ['despesas-periodos-anteriores-para-conferencia', 
        prestacaoDeContasUUID,
        analiseUUID,
        conta_uuid,
        filtrar_por_acao,
        filtrar_por_lancamento,
        ordenar_por_imposto,
        filtrar_por_data_inicio,
        filtrar_por_data_fim,
        filtrar_por_nome_fornecedor,
        filtrar_por_numero_de_documento,
        filtrar_por_tipo_de_documento,
        filtrar_por_tipo_de_pagamento,
        filtrar_por_informacoes,
        filtrar_por_conferencia,
        ],
        queryFn: async () => {
            let _analiseUUID = analiseUUID;

            if (!editavel) {
                let _ultimaAnalise = await getUltimaAnalisePc(prestacaoDeContasUUID);
                _analiseUUID = _ultimaAnalise.uuid
            }
            
            const despesas = await getDespesasPeriodosAnterioresParaConferencia(
                prestacaoDeContasUUID,
                _analiseUUID,
                conta_uuid,
                filtrar_por_acao,
                filtrar_por_lancamento,
                ordenar_por_imposto,
                filtrar_por_data_inicio,
                filtrar_por_data_fim,
                filtrar_por_nome_fornecedor,
                filtrar_por_numero_de_documento,
                filtrar_por_tipo_de_documento,
                filtrar_por_tipo_de_pagamento,
                filtrar_por_informacoes,
                filtrar_por_conferencia
            )
            const _despesas = despesas.map((_despesa) => ({..._despesa, selecionado: false}))
            setLancamentosParaConferencia(_despesas)
            return despesas
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        enabled: prestacaoDeContasUUID !== '' && conta_uuid !== ''
    });

    return {isLoading: status === 'loading', isFetching, isError, data, error, refetch}
}