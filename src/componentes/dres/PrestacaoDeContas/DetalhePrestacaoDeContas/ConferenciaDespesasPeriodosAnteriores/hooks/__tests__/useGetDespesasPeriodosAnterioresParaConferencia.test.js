import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetDespesasPeriodosAnterioresParaConferencia } from '../useGetDespesasPeriodosAnterioresParaConferencia';
import {
    getDespesasPeriodosAnterioresParaConferencia,
    getUltimaAnalisePc,
} from '../../../../../../../services/dres/PrestacaoDeContas.service';

jest.mock('../../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getDespesasPeriodosAnterioresParaConferencia: jest.fn(),
    getUltimaAnalisePc: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useGetDespesasPeriodosAnterioresParaConferencia', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('não dispara a busca quando prestacaoDeContasUUID ou conta_uuid estão vazios', () => {
        renderHook(
            () => useGetDespesasPeriodosAnterioresParaConferencia(jest.fn(), {}),
            { wrapper: createWrapper() }
        );
        expect(getDespesasPeriodosAnterioresParaConferencia).not.toHaveBeenCalled();
        expect(getUltimaAnalisePc).not.toHaveBeenCalled();
    });

    it('busca as despesas usando a analiseUUID informada quando editavel', async () => {
        getDespesasPeriodosAnterioresParaConferencia.mockResolvedValue([{ uuid: 'd1' }, { uuid: 'd2' }]);
        const setLancamentosParaConferencia = jest.fn();

        const { result } = renderHook(
            () => useGetDespesasPeriodosAnterioresParaConferencia(setLancamentosParaConferencia, {
                prestacaoDeContasUUID: 'pc-1',
                analiseUUID: 'analise-1',
                conta_uuid: 'conta-1',
                editavel: true,
            }),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getUltimaAnalisePc).not.toHaveBeenCalled();
        expect(getDespesasPeriodosAnterioresParaConferencia).toHaveBeenCalledWith(
            'pc-1', 'analise-1', 'conta-1', '', '', '', '', '', '', '', '', '', [], []
        );
        expect(setLancamentosParaConferencia).toHaveBeenCalledWith([
            { uuid: 'd1', selecionado: false },
            { uuid: 'd2', selecionado: false },
        ]);
        expect(result.current.data).toEqual([{ uuid: 'd1' }, { uuid: 'd2' }]);
    });

    it('busca a última análise antes de buscar as despesas quando não editavel', async () => {
        getUltimaAnalisePc.mockResolvedValue({ uuid: 'ultima-analise' });
        getDespesasPeriodosAnterioresParaConferencia.mockResolvedValue([]);
        const setLancamentosParaConferencia = jest.fn();

        const { result } = renderHook(
            () => useGetDespesasPeriodosAnterioresParaConferencia(setLancamentosParaConferencia, {
                prestacaoDeContasUUID: 'pc-1',
                conta_uuid: 'conta-1',
                editavel: false,
            }),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getUltimaAnalisePc).toHaveBeenCalledWith('pc-1');
        expect(getDespesasPeriodosAnterioresParaConferencia).toHaveBeenCalledWith(
            'pc-1', 'ultima-analise', 'conta-1', '', '', '', '', '', '', '', '', '', [], []
        );
        expect(setLancamentosParaConferencia).toHaveBeenCalledWith([]);
    });

    it('repassa os filtros informados para a busca de despesas', async () => {
        getDespesasPeriodosAnterioresParaConferencia.mockResolvedValue([]);

        const { result } = renderHook(
            () => useGetDespesasPeriodosAnterioresParaConferencia(jest.fn(), {
                prestacaoDeContasUUID: 'pc-1',
                analiseUUID: 'analise-1',
                conta_uuid: 'conta-1',
                filtrar_por_acao: 'acao-1',
                filtrar_por_lancamento: 'lanc-1',
                ordenar_por_imposto: true,
                filtrar_por_data_inicio: '2024-01-01',
                filtrar_por_data_fim: '2024-01-31',
                filtrar_por_nome_fornecedor: 'Fornecedor X',
                filtrar_por_numero_de_documento: '123',
                filtrar_por_tipo_de_documento: 'nota-fiscal',
                filtrar_por_tipo_de_pagamento: 'cheque',
                filtrar_por_informacoes: ['info-1'],
                filtrar_por_conferencia: ['conf-1'],
            }),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getDespesasPeriodosAnterioresParaConferencia).toHaveBeenCalledWith(
            'pc-1', 'analise-1', 'conta-1', 'acao-1', 'lanc-1', true, '2024-01-01', '2024-01-31',
            'Fornecedor X', '123', 'nota-fiscal', 'cheque', ['info-1'], ['conf-1']
        );
    });
});
