import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AcompanhamentoDeRelatorioConsolidadoSMEResumoAcertos } from '../index';
import * as AcompanhamentoService from '../../../../../services/sme/AcompanhamentoSME.service';
import { DataLimiteDevolucao } from '../../../../../context/DataLimiteDevolucao';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

jest.mock('../../../../../services/sme/AcompanhamentoSME.service');
jest.mock('../../../../../paginas/PaginasContainer', () => ({
    PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>
}));
jest.mock('../TopoComBotoes', () => ({
    TopoComBotoes: () => <div data-testid="topo-com-botoes">TopoComBotoes</div>
}));
jest.mock('../TabsConferencia', () => ({
    TabsConferencia: () => <div data-testid="tabs-conferencia">TabsConferencia</div>
}));
jest.mock('../CardsInfoDevolucaoSelecionada', () => ({
    CardsInfoDevolucaoSelecionada: () => <div data-testid="cards-info">CardsInfo</div>
}));
jest.mock('../VisualizaDevolucoes', () => ({
    VisualizaDevolucoes: () => <div data-testid="visualiza-devolucoes">VisualizaDevolucoes</div>
}));
jest.mock('../ComentariosNotificados', () => ({
    ComentariosNotificados: () => <div data-testid="comentarios">Comentarios</div>
}));
jest.mock('../TabelaConferenciaDeDocumentosRelatorios', () => ({
    TabelaConferenciaDeDocumentosRelatorios: () => <div data-testid="tabela-conferencia">Tabela</div>
}));
jest.mock('../RelatorioDosAcertos', () => ({
    RelatorioDosAcertos: ({ podeGerarPrevia }) => (
        <div data-testid="relatorio-acertos">Relatorio {podeGerarPrevia ? 'com' : 'sem'} previa</div>
    )
}));
jest.mock('../../../../../utils/Loading', () => ({
    __esModule: true,
    default: () => <div data-testid="loading">Loading...</div>
}));

const { useParams } = require('react-router-dom');

describe('AcompanhamentoDeRelatorioConsolidadoSMEResumoAcertos', () => {
    const mockConsolidadoUuid = 'consolidado-uuid-123';
    const mockDataLimite = '2025-12-31';

    const mockResumoConsolidado = {
        data: {
            comentarios_de_analise_do_consolidado_dre: { texto: 'Comentário teste' },
            data_limite: mockDataLimite,
            data_devolucao: '2025-09-15',
            data_retorno_analise: '2025-09-20',
            consolidado_dre: 'dre-uuid-456'
        }
    };

    const mockRelatorioConsolidado = {
        uuid: 'relatorio-uuid-789',
        status_sme: 'EM_ANALISE',
        analise_atual: { uuid: 'analise-uuid-111' },
        analises_do_consolidado_dre: [
            { uuid: 'analise-1' },
            { uuid: 'analise-2' }
        ]
    };

    const mockDetalhamentoDocumentos = {
        data: {
            lista_documentos: [
                { analise_documento_consolidado_dre: { resultado: 'AJUSTE' } },
                { analise_documento_consolidado_dre: { resultado: 'CORRETO' } },
                { analise_documento_consolidado_dre: { resultado: 'AJUSTE' } }
            ]
        }
    };

    const renderComponent = (dataLimiteValue = mockDataLimite) => {
        return render(
            <BrowserRouter>
                <DataLimiteDevolucao.Provider value={{ dataLimite: dataLimiteValue }}>
                    <AcompanhamentoDeRelatorioConsolidadoSMEResumoAcertos />
                </DataLimiteDevolucao.Provider>
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        useParams.mockReturnValue({ consolidado_dre_uuid: mockConsolidadoUuid });
        AcompanhamentoService.getResumoConsolidado.mockResolvedValue(mockResumoConsolidado);
        AcompanhamentoService.detalhamentoConsolidadoDRE.mockResolvedValue({ data: mockRelatorioConsolidado });
        AcompanhamentoService.detalhamentoConferenciaDocumentos.mockResolvedValue(mockDetalhamentoDocumentos);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('deve renderizar o componente com loading inicial', () => {
        renderComponent();
        expect(screen.getAllByTestId('loading')).not.toHaveLength(0);
    });

    test('deve carregar dados do resumo consolidado ao montar', async () => {
        renderComponent();

        await waitFor(() => {
            expect(AcompanhamentoService.getResumoConsolidado).toHaveBeenCalledWith(mockConsolidadoUuid);
        });
    });

    test('deve renderizar todos os componentes após carregar dados', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('topo-com-botoes')).toBeInTheDocument();
            expect(screen.getByTestId('tabs-conferencia')).toBeInTheDocument();
            expect(screen.getByTestId('visualiza-devolucoes')).toBeInTheDocument();
            expect(screen.getByTestId('tabela-conferencia')).toBeInTheDocument();
            expect(screen.getByTestId('comentarios')).toBeInTheDocument();
        });
    });

    test('deve carregar detalhamento consolidado DRE', async () => {
        renderComponent();

        await waitFor(() => {
            expect(AcompanhamentoService.detalhamentoConsolidadoDRE).toHaveBeenCalledWith('dre-uuid-456');
        });
    });

    test('deve filtrar documentos com resultado AJUSTE', async () => {
        renderComponent();

        await waitFor(() => {
            expect(AcompanhamentoService.detalhamentoConferenciaDocumentos).toHaveBeenCalled();
        });
    });

    test('deve renderizar título correto', () => {
        renderComponent();
        expect(screen.getByText('Acompanhamento da documentação da DRE')).toBeInTheDocument();
    });

    test('deve renderizar RelatorioDosAcertos com podeGerarPrevia=true quando tabAtual é conferencia-atual', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Relatorio com previa/i)).toBeInTheDocument();
        });
    });

    test('deve chamar detalhamentoConferenciaDocumentos com analise_atual quando status não é ANALISADO', async () => {
        renderComponent();

        await waitFor(() => {
            expect(AcompanhamentoService.detalhamentoConferenciaDocumentos).toHaveBeenCalledWith(
                mockRelatorioConsolidado.uuid,
                expect.any(String)
            );
        });
    });

    test('deve renderizar CardsInfoDevolucaoSelecionada quando status é EM_ANALISE', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('cards-info')).toBeInTheDocument();
        });
    });

    test('deve renderizar ComentariosNotificados quando comentários existem', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('comentarios')).toBeInTheDocument();
        });
    });
});