import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PrestacaoDeContas } from '../index';
import * as associacaoService from '../../../../services/escolas/Associacao.service';
import * as prestacaoService from '../../../../services/escolas/PrestacaoDeContas.service';
import * as visoesService from '../../../../services/visoes.service';
import * as atasService from "../../../../services/escolas/AtasAssociacao.service";
import * as notificacaoService from "../../../../services/Notificacoes.service";
import {NotificacaoContext} from "../../../../context/Notificacoes";
import { setPersistenteUrlVoltar } from "../../../../store/reducers/componentes/escolas/PrestacaoDeContas/PendenciaCadastro/actions";

import {
    mockPrestacaoContasPropSetStatusPC,
    mockPeriodos,
    mockStatusPeriodoCondicaoIrParaConciliacaoBancaria,
    mockStatusPeriodoCondicaoIrParaDadosAssociacao,
    mockStatusPeriodoCondicaoSemPendencia,
    mockStatusPeriodoCondicaoAmbasPendencias,
    mockContasAtivas,
    mockAta
} from '../__fixtures__/mockData';


const mockSetStatusPC = jest.fn();
const mockSetRegistroFalha = jest.fn();
const mockSetAvisoErro = jest.fn();

const propsComponent = {
    setStatusPC: mockSetStatusPC,
    setRegistroFalhaGeracaoPc: mockSetRegistroFalha,
    registroFalhaGeracaoPc: mockPrestacaoContasPropSetStatusPC,
    setApresentaBarraAvisoErroProcessamentoPc: mockSetAvisoErro,
}

const mockNotificacaoContext = {
    setShow: jest.fn(),
    setExibeModalTemDevolucao: jest.fn(),
    setExibeMensagemFixaTemDevolucao: jest.fn()
}

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock("../../../../store/reducers/componentes/escolas/PrestacaoDeContas/PendenciaCadastro/actions", () => ({
  setPersistenteUrlVoltar: jest.fn(),
}));
    
jest.mock('../../../../services/escolas/Associacao.service');
jest.mock('../../../../services/escolas/PrestacaoDeContas.service');
jest.mock('../../../../services/visoes.service');
jest.mock('../../../../services/escolas/AtasAssociacao.service');
jest.mock('../../../../services/Notificacoes.service');

jest.mock('../RelacaoDeBens', () => () => {
    return <div data-testid="mock-relacao-de-bens" />;
});

jest.mock('../DemonstrativoFinanceiroPorConta', () => () => {
    return <div data-testid="mock-demonstrativos-financeiros" />;
});

describe('PrestacaoDeContas', () => {
    beforeEach(() => {
        visoesService.visoesService.getPermissoes.mockResolvedValue(true);
        visoesService.visoesService.featureFlagAtiva.mockResolvedValue(true);
        
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'periodoPrestacaoDeConta') {
                return JSON.stringify({
                    periodo_uuid: 'mock-periodo',
                    data_inicial: '2025-01-01',
                    data_final: '2025-12-31',
                });
            }
            if (key === 'contaPrestacaoDeConta') {
                return JSON.stringify({conta_uuid: mockContasAtivas[0].uuid});
            }
            if (key === 'uuidPrestacaoConta') {
                return 'mock-uuid-pc';
            }
            if (key === 'associacao') {
                return 'mock-uuid-associacao';
            }
            if (key === 'token') {
                return 'mock-token';
            }
        });
        Storage.prototype.setItem = jest.fn();

        // Mocks dos serviços
        associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue(mockPeriodos);
        associacaoService.getContasAtivasDaAssociacaoNoPeriodo.mockResolvedValue(mockContasAtivas);
        prestacaoService.getDataPreenchimentoAta.mockResolvedValue(mockAta);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('valida o handleChangePeriodoPrestacaoDeConta', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoIrParaDadosAssociacao);
        
        render(
            <BrowserRouter>
                <NotificacaoContext.Provider value={mockNotificacaoContext}>
                    <PrestacaoDeContas {...propsComponent}/>
                </NotificacaoContext.Provider>
            </BrowserRouter>
        );
        
        await waitFor(() => {
            const select = document.getElementById('periodoPrestacaoDeConta');
            fireEvent.change(select, { target: { value: JSON.stringify(mockPeriodos[0])}});
            expect(select).toBeInTheDocument();
        });

    });

    it('renderiza somente botão Ir para dados da Associação quando há pendencias cadastrais e valida navigate', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoIrParaDadosAssociacao);
        
        render(
            <BrowserRouter>
                <NotificacaoContext.Provider value={mockNotificacaoContext}>
                    <PrestacaoDeContas {...propsComponent}/>
                </NotificacaoContext.Provider>
            </BrowserRouter>
        );
        
        await waitFor(() => {
            expect(screen.getByText(/concluir período/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/concluir período/i));
        
        await waitFor(() => {
            expect(screen.getByText(/Ir para dados da Associação/i)).toBeInTheDocument();
            expect(screen.getByText(/Ir para dados da Associação/i)).toBeEnabled();
            expect(screen.queryByText(/Ir para conciliação bancária/i)).not.toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(/Ir para dados da Associação/i));

        expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(setPersistenteUrlVoltar("/prestacao-de-contas/"));
        expect(mockNavigate).toHaveBeenCalledWith("/dados-da-associacao/");
    });

    it('renderiza somente botão Ir para Conciliação bancária (com contas pendentes) quando há pendencia de conciliação e valida navigate', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoIrParaConciliacaoBancaria);
        render(
            <BrowserRouter>
                <NotificacaoContext.Provider value={mockNotificacaoContext}>
                    <PrestacaoDeContas {...propsComponent}/>
                </NotificacaoContext.Provider>
            </BrowserRouter>
        );
        
        await waitFor(() => {
            expect(screen.getByText(/concluir período/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/concluir período/i));
        
        await waitFor(() => {
            expect(screen.getByText(/Ir para conciliação bancária/i)).toBeInTheDocument();
            expect(screen.getByText(/Ir para conciliação bancária/i)).toBeEnabled();
            expect(screen.queryByText(/Ir para dados da Associação/i)).not.toBeInTheDocument();
            fireEvent.click(screen.getByText(/Ir para conciliação bancária/i));
        });
        const periodo = JSON.parse(Storage.prototype.getItem('periodoPrestacaoDeConta')).periodo_uuid;
        expect(mockNavigate).toHaveBeenCalledWith(`/detalhe-das-prestacoes/${periodo}/?origem=concluir-periodo`);

        expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalledTimes(1);
    });

    it('renderiza somente botão Ir para Conciliação bancária (sem contas pendentes) quando há pendencia de conciliação e valida navigate', async () => {
        const mockStatusPeriodoCondicaoIrParaConciliacaoBancariaSemContasPendentes = {
            ...mockStatusPeriodoCondicaoIrParaConciliacaoBancaria,
            pendencias_cadastrais: {
                ...mockStatusPeriodoCondicaoIrParaConciliacaoBancaria.pendencias_cadastrais,
                conciliacao_bancaria: {
                    ...mockStatusPeriodoCondicaoIrParaConciliacaoBancaria.pendencias_cadastrais.conciliacao_bancaria,
                    contas_pendentes: [] // sem contas pendentes
                }
            }
        }
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(
            mockStatusPeriodoCondicaoIrParaConciliacaoBancariaSemContasPendentes);
        prestacaoService.getDataPreenchimentoAta.mockResolvedValue(mockAta);
        render(
            <BrowserRouter>
                <NotificacaoContext.Provider value={mockNotificacaoContext}>
                    <PrestacaoDeContas {...propsComponent}/>
                </NotificacaoContext.Provider>
            </BrowserRouter>
        );
        
        await waitFor(() => {
            expect(screen.getByText(/concluir período/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/concluir período/i));
        
        await waitFor(() => {
            expect(screen.getByText(/Ir para conciliação bancária/i)).toBeInTheDocument();
            expect(screen.getByText(/Ir para conciliação bancária/i)).toBeEnabled();
            expect(screen.queryByText(/Ir para dados da Associação/i)).not.toBeInTheDocument();
            fireEvent.click(screen.getByText(/Ir para conciliação bancária/i));
        });
        const periodo = JSON.parse(Storage.prototype.getItem('periodoPrestacaoDeConta')).periodo_uuid;
        expect(mockNavigate).toHaveBeenCalledWith(`/detalhe-das-prestacoes/${periodo}/${mockAta.ata_uuid}/?origem=concluir-periodo`);

        expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalledTimes(1);
    });

    it('renderiza ambos botão Ir para Conciliação bancária e Ir para dados da Associação quando há pendencia', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoAmbasPendencias);
        render(
            <BrowserRouter>
                <NotificacaoContext.Provider value={mockNotificacaoContext}>
                    <PrestacaoDeContas {...propsComponent}/>
                </NotificacaoContext.Provider>
            </BrowserRouter>
        );
        
        await waitFor(() => {
            expect(screen.getByText(/concluir período/i)).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(/concluir período/i));
        await waitFor(() => {
            expect(screen.getByText(/Ir para conciliação bancária/i)).toBeInTheDocument();
            expect(screen.getByText(/Ir para conciliação bancária/i)).toBeEnabled();
            expect(screen.getByText(/Ir para dados da Associação/i)).toBeInTheDocument();
            expect(screen.getByText(/Ir para dados da Associação/i)).toBeEnabled();
        });

        expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalledTimes(1);
    });

    
    it('não renderiza botões de pendências quando não há pendências', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
        atasService.getAtas.mockResolvedValue([]);
        render(
            <BrowserRouter>
                <NotificacaoContext.Provider value={mockNotificacaoContext}>
                    <PrestacaoDeContas {...propsComponent}/>
                </NotificacaoContext.Provider>
            </BrowserRouter>
        );
        
        await waitFor(() => {
            expect(screen.getByText(/concluir período/i)).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(/concluir período/i));
        await waitFor(() => {
            expect(screen.queryByText(/Ir para conciliação bancária/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Ir para dados da Associação/i)).not.toBeInTheDocument();
        });

        expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalledTimes(1);
        expect(notificacaoService.getRegistrosFalhaGeracaoPc).toHaveBeenCalledTimes(1);
        expect(atasService.getAtas).toHaveBeenCalledTimes(1);
    });

    it('testa retorno sem contas ativas para cobertura de condição else', async () => {
        associacaoService.getContasAtivasDaAssociacaoNoPeriodo.mockResolvedValue([]);
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        render(
            <BrowserRouter>
                <NotificacaoContext.Provider value={mockNotificacaoContext}>
                    <PrestacaoDeContas {...propsComponent}/>
                </NotificacaoContext.Provider>
            </BrowserRouter>
        );

        expect(associacaoService.getContasAtivasDaAssociacaoNoPeriodo).toHaveBeenCalledTimes(1);
        expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalledTimes(1);
        
    });

})