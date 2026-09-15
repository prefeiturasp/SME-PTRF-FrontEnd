import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { Filtros } from '../index';
import { getTagInformacao } from '../../../../../../../services/escolas/Despesas.service';
import { getTagsConferenciaLancamento } from '../../../../../../../services/dres/PrestacaoDeContas.service';

jest.mock('../../../../../../../services/escolas/Despesas.service', () => ({
    getTagInformacao: jest.fn(),
}));

jest.mock('../../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getTagsConferenciaLancamento: jest.fn(),
}));

let mockCapturedProps = null;
jest.mock('../FiltroRecolhido', () => ({
    FiltroRecolhido: (props) => {
        mockCapturedProps = props;
        return <div data-testid="filtro-recolhido" />;
    },
}));
jest.mock('../FiltroExpandido', () => ({
    FiltroExpandido: (props) => {
        mockCapturedProps = props;
        return <div data-testid="filtro-expandido" />;
    },
}));

const filtrosIniciais = {
    filtrar_por_acao: 'acao-1',
    filtrar_por_lancamento: '',
    filtrar_por_data_inicio: '',
    filtrar_por_data_fim: '',
    filtrar_por_nome_fornecedor: '',
    filtrar_por_numero_de_documento: '',
    filtrar_por_tipo_de_documento: '',
    filtrar_por_tipo_de_pagamento: '',
    filtrar_por_conferencia: [],
    filtrar_por_informacao: [],
};

describe('Filtros (ConferenciaDespesasPeriodosAnteriores)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedProps = null;
        getTagInformacao.mockResolvedValue(['tag1']);
        getTagsConferenciaLancamento.mockResolvedValue(['conf1']);
    });

    it('renderiza o FiltroRecolhido por padrão e carrega as tags ao montar', async () => {
        render(<Filtros tabelasDespesa={[]} filters={filtrosIniciais} onChangeFiltersState={jest.fn()} />);

        expect(screen.getByTestId('filtro-recolhido')).toBeInTheDocument();
        expect(screen.queryByTestId('filtro-expandido')).not.toBeInTheDocument();
        await waitFor(() => expect(getTagInformacao).toHaveBeenCalled());
        expect(getTagsConferenciaLancamento).toHaveBeenCalled();
    });

    it('renderiza o FiltroExpandido quando btnMaisFiltros é ativado, com as listas de tags carregadas', async () => {
        render(<Filtros tabelasDespesa={[]} filters={filtrosIniciais} onChangeFiltersState={jest.fn()} />);
        expect(screen.getByTestId('filtro-recolhido')).toBeInTheDocument();

        act(() => {
            mockCapturedProps.setBtnMaisFiltros(true);
        });

        expect(screen.getByTestId('filtro-expandido')).toBeInTheDocument();
        await waitFor(() => expect(mockCapturedProps.listaTagInformacao).toEqual(['tag1']));
        expect(mockCapturedProps.listaTagsConferencia).toEqual(['conf1']);
    });

    it('limpaFiltros restaura o estado padrão e propaga para onChangeFiltersState', async () => {
        const onChangeFiltersState = jest.fn();
        render(<Filtros tabelasDespesa={[]} filters={filtrosIniciais} onChangeFiltersState={onChangeFiltersState} />);

        await act(async () => {
            await mockCapturedProps.limpaFiltros();
        });

        expect(onChangeFiltersState).toHaveBeenCalledWith(expect.objectContaining({
            filtrar_por_acao: '',
            filtrar_por_conferencia: [],
            filtrar_por_informacao: [],
        }));
    });

    it('handleSubmitFiltros envia o estado atual dos filtros', async () => {
        const onChangeFiltersState = jest.fn();
        render(<Filtros tabelasDespesa={[]} filters={filtrosIniciais} onChangeFiltersState={onChangeFiltersState} />);
        await waitFor(() => expect(getTagInformacao).toHaveBeenCalled());

        act(() => {
            mockCapturedProps.handleSubmitFiltros();
        });

        expect(onChangeFiltersState).toHaveBeenCalledWith(filtrosIniciais);
    });

    it('handleChangeFiltros atualiza um campo específico do estado', async () => {
        render(<Filtros tabelasDespesa={[]} filters={filtrosIniciais} onChangeFiltersState={jest.fn()} />);
        await waitFor(() => expect(getTagInformacao).toHaveBeenCalled());

        act(() => {
            mockCapturedProps.handleChangeFiltros('filtrar_por_nome_fornecedor', 'Fornecedor Y');
        });

        expect(mockCapturedProps.stateFiltros.filtrar_por_nome_fornecedor).toBe('Fornecedor Y');
        expect(mockCapturedProps.stateFiltros.filtrar_por_acao).toBe('acao-1');
    });

    it('handleChangeFiltroInformacoes e handleChangeFiltroConferencia atualizam as respectivas listas', async () => {
        render(<Filtros tabelasDespesa={[]} filters={filtrosIniciais} onChangeFiltersState={jest.fn()} />);
        await waitFor(() => expect(getTagInformacao).toHaveBeenCalled());

        act(() => {
            mockCapturedProps.setBtnMaisFiltros(true);
        });
        act(() => {
            mockCapturedProps.handleChangeFiltroInformacoes(['info-1', 'info-2']);
        });
        expect(mockCapturedProps.stateFiltros.filtrar_por_informacoes).toEqual(['info-1', 'info-2']);

        act(() => {
            mockCapturedProps.handleChangeFiltroConferencia(['conf-x']);
        });
        expect(mockCapturedProps.stateFiltros.filtrar_por_conferencia).toEqual(['conf-x']);
    });

    it('handleClearDate limpa apenas as datas de início e fim', async () => {
        render(<Filtros tabelasDespesa={[]} filters={filtrosIniciais} onChangeFiltersState={jest.fn()} />);
        await waitFor(() => expect(getTagInformacao).toHaveBeenCalled());

        act(() => {
            mockCapturedProps.setBtnMaisFiltros(true);
        });
        act(() => {
            mockCapturedProps.handleChangeFiltros('filtrar_por_data_inicio', '2024-01-01');
        });
        act(() => {
            mockCapturedProps.handleClearDate();
        });

        expect(mockCapturedProps.stateFiltros.filtrar_por_data_inicio).toBe('');
        expect(mockCapturedProps.stateFiltros.filtrar_por_data_fim).toBe('');
        expect(mockCapturedProps.stateFiltros.filtrar_por_acao).toBe('acao-1');
    });

    it('formatDate converte datas com hífen para um objeto moment', async () => {
        render(<Filtros tabelasDespesa={[]} filters={filtrosIniciais} onChangeFiltersState={jest.fn()} />);
        await waitFor(() => expect(getTagInformacao).toHaveBeenCalled());
        act(() => {
            mockCapturedProps.setBtnMaisFiltros(true);
        });

        const formatado = mockCapturedProps.formatDate('2024-05-06');
        expect(formatado.format('YYYY-MM-DD')).toBe('2024-05-06');
    });

    it('loga erro no console quando a busca de tag informação falha', async () => {
        const originalError = console.error;
        console.error = jest.fn();
        getTagInformacao.mockRejectedValue(new Error('falha'));

        render(<Filtros tabelasDespesa={[]} filters={filtrosIniciais} onChangeFiltersState={jest.fn()} />);

        await waitFor(() => expect(console.error).toHaveBeenCalledWith(
            'Erro ao carregar tag informação', expect.any(Error)
        ));

        console.error = originalError;
    });

    it('loga erro no console quando a busca de tags de conferência falha', async () => {
        const originalError = console.error;
        console.error = jest.fn();
        getTagsConferenciaLancamento.mockRejectedValue(new Error('falha'));

        render(<Filtros tabelasDespesa={[]} filters={filtrosIniciais} onChangeFiltersState={jest.fn()} />);

        await waitFor(() => expect(console.error).toHaveBeenCalledWith(
            'Erro ao carregar tags de conferência de lançamento', expect.any(Error)
        ));

        console.error = originalError;
    });
});
