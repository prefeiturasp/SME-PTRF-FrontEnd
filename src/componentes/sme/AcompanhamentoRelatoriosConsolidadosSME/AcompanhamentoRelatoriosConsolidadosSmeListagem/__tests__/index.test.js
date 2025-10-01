import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { AcompanhamentoRelatorioConsolidadosSmeListagem } from '../index';

jest.mock('../../../../../services/dres/Dashboard.service', () => ({
    getPeriodos: jest.fn()
}));

jest.mock('../../../../../services/sme/Parametrizacoes.service', () => ({
    getTabelaAssociacoes: jest.fn()
}));

jest.mock('../../../../../services/sme/DashboardSme.service', () => ({
    getListaRelatoriosConsolidados: jest.fn()
}));

jest.mock('../../../../../paginas/PaginasContainer', () => ({
    PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>
}));

jest.mock('../Cabecalho', () => ({
    Cabecalho: ({ periodos, periodoEscolhido, handleChangePeriodos }) => (
        <div data-testid="cabecalho">
            <select
                data-testid="select-periodo"
                value={periodoEscolhido || ''}
                onChange={(e) => handleChangePeriodos(e.target.value)}
            >
                {periodos && periodos.map(periodo => (
                    <option key={periodo.uuid} value={periodo.uuid}>{periodo.nome}</option>
                ))}
            </select>
        </div>
    )
}));

jest.mock('../FormFiltros', () => ({
    FormFiltros: ({
        stateFiltros,
        selectedStatusPc,
        handleChangeFiltros,
        handleChangeSelectStatusPc,
        handleLimpaFiltros,
        handleSubmitFiltros
    }) => (
        <div data-testid="form-filtros">
            <input
                data-testid="filtro-dre"
                value={stateFiltros.filtrar_por_dre}
                onChange={(e) => handleChangeFiltros('filtrar_por_dre', e.target.value)}
            />
            <button data-testid="btn-limpar" onClick={handleLimpaFiltros}>Limpar</button>
            <button data-testid="btn-filtrar" onClick={handleSubmitFiltros}>Filtrar</button>
        </div>
    )
}));

jest.mock('../../../../../utils/Loading', () => {
    return function Loading() {
        return <div data-testid="loading">Carregando...</div>;
    };
});

jest.mock('../../../../Globais/Mensagens/MsgImgLadoDireito', () => ({
    MsgImgLadoDireito: ({ texto }) => (
        <div data-testid="msg-sem-dados">{texto}</div>
    )
}));

const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => mockUseParams(),
    Link: ({ children, to, ...props }) => <a href={to.pathname || to} {...props}>{children}</a>
}));

jest.mock('../ListaRelatorios', () => ({
    ListaRelatorios: ({ relatoriosConsolidados, statusSmeTemplate, acoesTemplate }) => (
        <div data-testid="lista-relatorios">
            {relatoriosConsolidados.map((relatorio, idx) => (
                <div key={idx} data-testid={`relatorio-${idx}`}>
                    {relatorio.nome}
                    {statusSmeTemplate && (
                        <div data-testid={`status-${idx}`}>{statusSmeTemplate(relatorio)}</div>
                    )}
                    {acoesTemplate && (
                        <div data-testid={`acoes-${idx}`}>{acoesTemplate(relatorio)}</div>
                    )}
                </div>
            ))}
        </div>
    )
}));

import { getPeriodos } from '../../../../../services/dres/Dashboard.service';
import { getTabelaAssociacoes } from '../../../../../services/sme/Parametrizacoes.service';
import { getListaRelatoriosConsolidados } from '../../../../../services/sme/DashboardSme.service';

describe('AcompanhamentoRelatorioConsolidadosSmeListagem', () => {
    const mockPeriodos = [
        { uuid: 'periodo-1', nome: 'Período 1' },
        { uuid: 'periodo-2', nome: 'Período 2' }
    ];

    const mockDres = [
        { uuid: 'dre-1', nome: 'DRE 1' },
        { uuid: 'dre-2', nome: 'DRE 2' }
    ];

    const mockRelatorios = [
        {
            uuid_consolidado_dre: 'relatorio-1',
            nome: 'Relatório 1',
            status_sme: 'ANALISADO',
            status_sme_label: 'Relatório Analisado',
            pode_visualizar: true
        },
        {
            uuid_consolidado_dre: 'relatorio-2',
            nome: 'Relatório 2',
            status_sme: 'NAO_GERADO',
            status_sme_label: 'Não gerado',
            pode_visualizar: false
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        getPeriodos.mockResolvedValue(mockPeriodos);
        getTabelaAssociacoes.mockResolvedValue({ dres: mockDres });
        getListaRelatoriosConsolidados.mockResolvedValue(mockRelatorios);
        mockUseParams.mockReturnValue({});
    });

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <AcompanhamentoRelatorioConsolidadosSmeListagem />
            </BrowserRouter>
        );
    };

    test('deve renderizar o componente corretamente', async () => {
        renderComponent();

        expect(screen.getByText('Análise dos relatórios consolidados das DRES')).toBeInTheDocument();
        expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
        expect(screen.getByTestId('cabecalho')).toBeInTheDocument();
        expect(screen.getByTestId('form-filtros')).toBeInTheDocument();
    });

    test('deve mostrar loading inicialmente', () => {
        renderComponent();
        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    test('deve carregar períodos na inicialização', async () => {
        renderComponent();

        await waitFor(() => {
            expect(getPeriodos).toHaveBeenCalledTimes(1);
        });
    });

    test('deve carregar lista de DREs na inicialização', async () => {
        renderComponent();

        await waitFor(() => {
            expect(getTabelaAssociacoes).toHaveBeenCalledTimes(1);
        });
    });

    test('deve carregar relatórios consolidados após carregar período', async () => {
        renderComponent();

        await waitFor(() => {
            expect(getListaRelatoriosConsolidados).toHaveBeenCalledWith('periodo-1', null ?? undefined);;
        });
    });

    test('deve exibir lista de relatórios quando há dados', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('lista-relatorios')).toBeInTheDocument();
            expect(screen.getByTestId('relatorio-0')).toBeInTheDocument();
            expect(screen.getByTestId('relatorio-1')).toBeInTheDocument();
        });

        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    test('deve exibir mensagem quando não há relatórios', async () => {
        getListaRelatoriosConsolidados.mockResolvedValue([]);
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('msg-sem-dados')).toBeInTheDocument();
            expect(screen.getByText('Nenhum relatório retornado. Tente novamente com outros filtros')).toBeInTheDocument();
        });
    });

    test('deve usar período da URL quando fornecido', async () => {
        mockUseParams.mockReturnValue({ periodo_uuid: 'periodo-especifico' });
        renderComponent();

        await waitFor(() => {
            expect(getListaRelatoriosConsolidados).toHaveBeenCalledWith('periodo-especifico', null ?? undefined);;
        });
    });

    test('deve usar status da URL quando fornecido', async () => {
        mockUseParams.mockReturnValue({
            periodo_uuid: 'periodo-1',
            status_sme: 'ANALISADO'
        });
        renderComponent();

        await waitFor(() => {
            expect(getListaRelatoriosConsolidados).toHaveBeenCalledWith('periodo-1', 'ANALISADO');
        });
    });

    test('deve filtrar por status TODOS como null', async () => {
        mockUseParams.mockReturnValue({
            periodo_uuid: 'periodo-1',
            status_sme: 'TODOS'
        });
        renderComponent();

        await waitFor(() => {
            expect(getListaRelatoriosConsolidados).toHaveBeenCalledWith('periodo-1', null);;
        });
    });

    test('deve alterar período quando selecionado', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('select-periodo')).toBeInTheDocument();
        });

        const selectPeriodo = screen.getByTestId('select-periodo');
        fireEvent.change(selectPeriodo, { target: { value: 'periodo-2' } });

        await waitFor(() => {
            expect(getListaRelatoriosConsolidados).toHaveBeenCalledWith('periodo-2', null ?? undefined);;
        });
    });

    test('deve limpar filtros quando botão limpar é clicado', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('btn-limpar')).toBeInTheDocument();
        });

        const btnLimpar = screen.getByTestId('btn-limpar');
        fireEvent.click(btnLimpar);

        await waitFor(() => {
            expect(getListaRelatoriosConsolidados).toHaveBeenCalledWith('periodo-1', null ?? undefined);;
        });
    });

    test('deve aplicar filtros quando botão filtrar é clicado', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('btn-filtrar')).toBeInTheDocument();
        });

        // Simular mudança no filtro
        const filtroDre = screen.getByTestId('filtro-dre');
        fireEvent.change(filtroDre, { target: { value: 'dre-1' } });

        const btnFiltrar = screen.getByTestId('btn-filtrar');
        fireEvent.click(btnFiltrar);

        await waitFor(() => {
            expect(getListaRelatoriosConsolidados).toHaveBeenCalledWith(
                'periodo-1',
                null,
                'dre-1',
                ''
            );
        });
    });

    test('NAO_GERADO renderiza preto', async () => {
        renderComponent();
        expect(await screen.findByText('Não gerado')).toHaveClass('status-sme-preto');
    });

    test('ANALISADO renderiza verde', async () => {
        renderComponent();
        expect(await screen.findByText('Relatório Analisado')).toHaveClass('status-sme-verde');
    });

    test('acoesTemplate com link quando pode visualizar', async () => {
        renderComponent();
        const link = await screen.findByRole('link', { name: /visualizar/i });
        expect(link).toHaveAttribute('href', '/analise-relatorio-consolidado-dre-detalhe/relatorio-1');
    });

    test('acoesTemplate sem link quando não pode visualizar', async () => {
        renderComponent();
        const span = await screen.findByText((_, el) => el?.classList.contains('remove-pointer'));
        expect(span).toBeInTheDocument();
    });
});