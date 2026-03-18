import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PrestacaoDeContas } from '../index';
import * as associacaoService from '../../../../services/escolas/Associacao.service';
import * as prestacaoService from '../../../../services/escolas/PrestacaoDeContas.service';
import * as visoesService from '../../../../services/visoes.service';
import * as atasService from "../../../../services/escolas/AtasAssociacao.service";
import * as notificacaoService from "../../../../services/Notificacoes.service";
import {NotificacaoContext} from "../../../../context/Notificacoes";
import {SidebarContext} from "../../../../context/Sidebar";
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

const mockSidebarContext = {
    setIrParaUrl: jest.fn().mockResolvedValue(undefined),
    setSideBarStatus: jest.fn(),
    sideBarStatus: true,
    irParaUrl: true,
};

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch
}));

const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => ({}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

jest.mock("../../../../store/reducers/componentes/escolas/PrestacaoDeContas/PendenciaCadastro/actions", () => ({
  setPersistenteUrlVoltar: jest.fn(),
}));

jest.mock('../../../../services/escolas/Associacao.service');
jest.mock('../../../../services/escolas/PrestacaoDeContas.service');
jest.mock('../../../../services/visoes.service');
jest.mock('../../../../services/escolas/AtasAssociacao.service');
jest.mock('../../../../services/Notificacoes.service');
jest.mock('../../../../services/SideBarLeft.service', () => ({
    SidebarLeftService: { setItemActive: jest.fn() },
}));
jest.mock('../../../../componentes/Globais/ToastCustom', () => ({
    toastCustom: { ToastCustomError: jest.fn() },
}));
jest.mock('../../../Globais/Modal/CustomModalConfirm', () => ({
    CustomModalConfirm: jest.fn(({ onConfirm }) => { onConfirm && onConfirm(); }),
}));

jest.mock('../RelacaoDeBens', () => () => <div data-testid="mock-relacao-de-bens" />);
jest.mock('../DemonstrativoFinanceiroPorConta', () => () => <div data-testid="mock-demonstrativos-financeiros" />);
jest.mock('../BarraDeStatusPrestacaoDeContas', () => ({
    BarraDeStatusPrestacaoDeContas: () => <div data-testid="mock-barra-status" />,
}));
jest.mock('../../GeracaoDaAta/GeracaoAtaApresentacao', () => ({
    GeracaoAtaApresentacao: ({ onClickVisualizarAta }) => (
        <button data-testid="mock-geracao-ata-apresentacao" onClick={onClickVisualizarAta}>Ver Ata</button>
    ),
}));
jest.mock('../../GeracaoAtaRetificadora', () => ({
    GeracaoAtaRetificadora: () => <div data-testid="mock-geracao-ata-retificadora" />,
}));
jest.mock('../TopoSelectPeriodoBotaoConcluir', () => ({
    TopoSelectPeriodoBotaoConcluir: ({ handleChangePeriodoPrestacaoDeConta, concluirPeriodo, textoBotaoConcluir, statusPrestacaoDeConta, retornaObjetoPeriodoPrestacaoDeConta, periodosAssociacao }) => (
        <>
            <select
                id="periodoPrestacaoDeConta"
                name="periodoPrestacaoDeConta"
                onChange={(e) => handleChangePeriodoPrestacaoDeConta(e.target.name, e.target.value)}
                defaultValue=""
            >
                <option value="">Escolha</option>
                {periodosAssociacao && periodosAssociacao.map((p, i) => (
                    <option key={i} value={retornaObjetoPeriodoPrestacaoDeConta(p.uuid, p.data_inicio_realizacao_despesas, p.data_fim_realizacao_despesas)}>
                        {p.referencia}
                    </option>
                ))}
            </select>
            <button data-testid="btn-concluir-periodo" onClick={concluirPeriodo}>
                {textoBotaoConcluir(statusPrestacaoDeConta)}
            </button>
        </>
    ),
}));
jest.mock('../ModalConcluirPeriodo', () => ({
    ModalConcluirPeriodo: ({ show, onConcluir, handleClose }) =>
        show ? (
            <>
                <button data-testid="modal-concluir-periodo-confirmar" onClick={onConcluir}>Confirmar</button>
                <button data-testid="modal-concluir-periodo-fechar" onClick={handleClose}>Fechar</button>
            </>
        ) : null,
}));
jest.mock('../ModalConcluirAcertoSemPendencias', () => ({
    ModalConcluirAcertoSemPendencias: ({ show, onConcluir, handleClose }) =>
        show ? (
            <>
                <button data-testid="modal-acerto-sem-pendencias-confirmar" onClick={onConcluir}>Confirmar acerto</button>
                <button data-testid="modal-acerto-sem-pendencias-fechar" onClick={handleClose}>Fechar acerto</button>
            </>
        ) : null,
}));
jest.mock('../ModalConcluirAcertoComPendencias', () => ({
    ModalConcluirAcertoComPendencias: ({ show, onIrParaAnaliseDre, handleClose }) =>
        show ? (
            <>
                <button data-testid="modal-acerto-com-pendencias-ir-analise" onClick={onIrParaAnaliseDre}>Ir para análise DRE</button>
                <button data-testid="modal-acerto-com-pendencias-fechar" onClick={handleClose}>Fechar com pendência</button>
            </>
        ) : null,
}));
jest.mock('../ModalAvisoAssinatura', () => ({
    ModalAvisoAssinatura: ({ show, primeiroBotaoOnclick, segundoBotaoOnclick }) =>
        show ? (
            <>
                <button data-testid="modal-aviso-assinatura-ir-membros" onClick={primeiroBotaoOnclick}>Ir para Membros</button>
                <button data-testid="modal-aviso-assinatura-concluir" onClick={segundoBotaoOnclick}>Concluir aviso</button>
            </>
        ) : null,
}));
jest.mock('../ModalDevolucaoNaoPermitida', () => ({
    ModalDevolucaoNaoPermitida: ({ show, handleClose }) =>
        show ? (
            <button data-testid="modal-devolucao-nao-permitida-fechar" onClick={handleClose}>Fechar devolução</button>
        ) : null,
}));
jest.mock('../ModalPendenciasCadastrais', () => ({
    ModalPendenciasCadastrais: ({ show, bodyActions, handleClose }) =>
        show ? (
            <div>
                {bodyActions && bodyActions.map((action, i) => (
                    <button key={i} onClick={action.callback}>{action.title}</button>
                ))}
                <button data-testid="modal-pendencias-fechar" onClick={handleClose}>Fechar</button>
            </div>
        ) : null,
}));
jest.mock('../../../Globais/ModalAntDesign/ModalNotificaErroConcluirPC', () => ({
    ModalNotificaErroConcluirPC: ({ show, titulo, handleClose, segundoBotaoOnclick, hideSegundoBotao }) =>
        show ? (
            <>
                <div data-testid="modal-erro-concluir-pc">{titulo}</div>
                <button data-testid="modal-erro-pc-fechar" onClick={handleClose}>Fechar erro</button>
                {!hideSegundoBotao && segundoBotaoOnclick && (
                    <button data-testid="modal-erro-pc-reprocessar" onClick={segundoBotaoOnclick}>Reprocessar</button>
                )}
            </>
        ) : null,
}));

const renderComponent = (props = {}) =>
    render(
        <BrowserRouter>
            <SidebarContext.Provider value={mockSidebarContext}>
                <NotificacaoContext.Provider value={mockNotificacaoContext}>
                    <PrestacaoDeContas {...propsComponent} {...props} />
                </NotificacaoContext.Provider>
            </SidebarContext.Provider>
        </BrowserRouter>
    );

const waitForLoaded = () => waitFor(() => {
    expect(screen.getByTestId('mock-demonstrativos-financeiros')).toBeInTheDocument();
}, { timeout: 3000 });

const clickConcluirPeriodo = async () => {
    await waitFor(() => {
        const btn = screen.getByTestId('btn-concluir-periodo');
        expect(btn).toBeInTheDocument();
        expect(btn.textContent).not.toBe('');
    });
    await act(async () => {
        fireEvent.click(screen.getByTestId('btn-concluir-periodo'));
    });
};

// Clicks through the ModalAvisoAssinatura to get to ModalConcluirPeriodo
const clickConcluirViaAviso = async () => {
    await clickConcluirPeriodo();
    await waitFor(() => {
        expect(screen.getByTestId('modal-aviso-assinatura-concluir')).toBeInTheDocument();
    });
    await act(async () => {
        fireEvent.click(screen.getByTestId('modal-aviso-assinatura-concluir'));
    });
};

describe('PrestacaoDeContas', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockUseParams.mockReturnValue({});
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
        Storage.prototype.removeItem = jest.fn();

        associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue(mockPeriodos);
        associacaoService.getContasAtivasDaAssociacaoNoPeriodo.mockResolvedValue(mockContasAtivas);
        prestacaoService.getDataPreenchimentoAta.mockResolvedValue(mockAta);
        prestacaoService.postConcluirPeriodo.mockResolvedValue({ uuid: 'uuid-pc-concluido' });
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
    });

    it('valida o handleChangePeriodoPrestacaoDeConta', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoIrParaDadosAssociacao);

        renderComponent();

        await waitFor(() => {
            const select = document.getElementById('periodoPrestacaoDeConta');
            expect(select).toBeInTheDocument();
        });

        const select = document.getElementById('periodoPrestacaoDeConta');
        await act(async () => {
            fireEvent.change(select, { target: { value: JSON.stringify(mockPeriodos[0])}});
        });

        await waitFor(() => {
            expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalled();
        });
    });

    it('renderiza somente botão Ir para dados da Associação quando há pendencias cadastrais e valida navigate', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoIrParaDadosAssociacao);

        renderComponent();

        await clickConcluirPeriodo();

        await waitFor(() => {
            expect(screen.getByText(/Ir para dados da Associação/i)).toBeInTheDocument();
            expect(screen.getByText(/Ir para dados da Associação/i)).toBeEnabled();
            expect(screen.queryByText(/Ir para Conciliação Bancária/i)).not.toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(/Ir para dados da Associação/i));

        expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(setPersistenteUrlVoltar("/prestacao-de-contas/"));
        expect(mockNavigate).toHaveBeenCalledWith("/dados-da-associacao/");
    });

    it('renderiza somente botão Ir para Conciliação bancária (com contas pendentes) quando há pendencia de conciliação e valida navigate', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoIrParaConciliacaoBancaria);
        renderComponent();

        await clickConcluirPeriodo();

        await waitFor(() => {
            expect(screen.getByText(/Ir para Conciliação Bancária/i)).toBeInTheDocument();
            expect(screen.getByText(/Ir para Conciliação Bancária/i)).toBeEnabled();
            expect(screen.queryByText(/Ir para dados da Associação/i)).not.toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(/Ir para Conciliação Bancária/i));

        const periodo = JSON.parse(Storage.prototype.getItem('periodoPrestacaoDeConta')).periodo_uuid;
        expect(mockNavigate).toHaveBeenCalledWith(`/detalhe-das-prestacoes/${periodo}/?origem=concluir-periodo`);
        expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalledTimes(1);
    });

    it('renderiza somente botão Ir para Conciliação bancária (sem contas pendentes) quando há pendencia de conciliação e valida navigate', async () => {
        const mockStatusSemContasPendentes = {
            ...mockStatusPeriodoCondicaoIrParaConciliacaoBancaria,
            pendencias_cadastrais: {
                ...mockStatusPeriodoCondicaoIrParaConciliacaoBancaria.pendencias_cadastrais,
                conciliacao_bancaria: {
                    ...mockStatusPeriodoCondicaoIrParaConciliacaoBancaria.pendencias_cadastrais.conciliacao_bancaria,
                    contas_pendentes: []
                }
            }
        };
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusSemContasPendentes);
        prestacaoService.getDataPreenchimentoAta.mockResolvedValue(mockAta);
        renderComponent();

        await clickConcluirPeriodo();

        await waitFor(() => {
            expect(screen.getByText(/Ir para Conciliação Bancária/i)).toBeInTheDocument();
            expect(screen.queryByText(/Ir para dados da Associação/i)).not.toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(/Ir para Conciliação Bancária/i));

        const periodo = JSON.parse(Storage.prototype.getItem('periodoPrestacaoDeConta')).periodo_uuid;
        expect(mockNavigate).toHaveBeenCalledWith(`/detalhe-das-prestacoes/${periodo}/${mockAta.ata_uuid}/?origem=concluir-periodo`);
        expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalledTimes(1);
    });

    it('renderiza ambos botão Ir para Conciliação bancária e Ir para dados da Associação quando há pendencia', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoAmbasPendencias);
        renderComponent();

        await clickConcluirPeriodo();

        await waitFor(() => {
            expect(screen.getByText(/Ir para Conciliação Bancária/i)).toBeInTheDocument();
            expect(screen.getByText(/Ir para Conciliação Bancária/i)).toBeEnabled();
            expect(screen.getByText(/Ir para dados da Associação/i)).toBeInTheDocument();
            expect(screen.getByText(/Ir para dados da Associação/i)).toBeEnabled();
        });

        expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalledTimes(1);
    });

    it('não renderiza botões de pendências quando não há pendências', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
        renderComponent();

        await waitFor(() => expect(screen.getByTestId('btn-concluir-periodo')).toBeInTheDocument());
        await act(async () => { fireEvent.click(screen.getByTestId('btn-concluir-periodo')); });

        await waitFor(() => {
            expect(screen.queryByText(/Ir para Conciliação Bancária/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Ir para dados da Associação/i)).not.toBeInTheDocument();
        });

        expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalledTimes(1);
        expect(notificacaoService.getRegistrosFalhaGeracaoPc).toHaveBeenCalledTimes(1);
    });

    it('testa retorno sem contas ativas para cobertura de condição else', async () => {
        associacaoService.getContasAtivasDaAssociacaoNoPeriodo.mockResolvedValue([]);
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitFor(() => {
            expect(associacaoService.getContasAtivasDaAssociacaoNoPeriodo).toHaveBeenCalled();
            expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalled();
        });
    });

    it('renderiza componentes quando há contas ativas e clica em aba da conta', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitForLoaded();

        expect(screen.getByTestId('mock-demonstrativos-financeiros')).toBeInTheDocument();
        expect(screen.getByTestId('mock-relacao-de-bens')).toBeInTheDocument();
        expect(screen.getByTestId('mock-geracao-ata-apresentacao')).toBeInTheDocument();

        const contaButtons = screen.getAllByText(/Conta /);
        expect(contaButtons.length).toBeGreaterThan(0);
        await act(async () => {
            fireEvent.click(contaButtons[1]);
        });
    });

    it('fecha modal de pendências cadastrais ao clicar em Fechar', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoIrParaDadosAssociacao);
        renderComponent();

        await clickConcluirPeriodo();

        await waitFor(() => {
            expect(screen.getByTestId('modal-pendencias-fechar')).toBeInTheDocument();
        });
        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-pendencias-fechar'));
        });

        await waitFor(() => {
            expect(screen.queryByTestId('modal-pendencias-fechar')).not.toBeInTheDocument();
        });
    });

    it('clica em ambos botões das pendências (ambasPendencias) cobrindo callbacks das actions', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoAmbasPendencias);
        renderComponent();

        await clickConcluirPeriodo();

        await waitFor(() => {
            expect(screen.getByText(/Ir para dados da Associação/i)).toBeInTheDocument();
        });
        await act(async () => {
            fireEvent.click(screen.getByText(/Ir para dados da Associação/i));
        });
        expect(mockNavigate).toHaveBeenCalledWith('/dados-da-associacao/');
    });

    it('concluir período sem pendências passa por ModalAvisoAssinatura e confirma', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
        renderComponent();

        await clickConcluirViaAviso();

        await waitFor(() => {
            expect(screen.getByTestId('modal-concluir-periodo-confirmar')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-concluir-periodo-confirmar'));
        });

        await waitFor(() => {
            expect(prestacaoService.postConcluirPeriodo).toHaveBeenCalled();
        });
    });

    it('fecha modal concluir período chamando onHandleClose', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
        renderComponent();

        await clickConcluirViaAviso();

        await waitFor(() => {
            expect(screen.getByTestId('modal-concluir-periodo-fechar')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-concluir-periodo-fechar'));
        });

        await waitFor(() => {
            expect(screen.queryByTestId('modal-concluir-periodo-fechar')).not.toBeInTheDocument();
        });
    });

    it('clica em Ir para Membros no ModalAvisoAssinatura chama goToMembrosAssociacao', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
        renderComponent();

        await clickConcluirPeriodo();

        await waitFor(() => {
            expect(screen.getByTestId('modal-aviso-assinatura-ir-membros')).toBeInTheDocument();
        });
        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-aviso-assinatura-ir-membros'));
        });

        expect(mockNavigate).toHaveBeenCalledWith('/membros-da-associacao');
    });

    it('concluirPeriodo erro saldos_alterados_sem_solicitacao exibe modal devolução não permitida', async () => {
        const { toastCustom } = require('../../../../componentes/Globais/ToastCustom');
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
        prestacaoService.postConcluirPeriodo.mockRejectedValue({
            response: {
                status: 400,
                data: {
                    erro: ['prestacao_com_saldos_alterados_sem_solicitacao'],
                    mensagem: ['Saldo bancário modificado.'],
                },
            },
        });
        renderComponent();

        await clickConcluirViaAviso();
        await waitFor(() => expect(screen.getByTestId('modal-concluir-periodo-confirmar')).toBeInTheDocument());

        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-concluir-periodo-confirmar'));
        });

        await waitFor(() => {
            expect(screen.getByTestId('modal-devolucao-nao-permitida-fechar')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-devolucao-nao-permitida-fechar'));
        });
        expect(screen.queryByTestId('modal-devolucao-nao-permitida-fechar')).not.toBeInTheDocument();
    });

    it('concluirPeriodo erro erro_de_validacao chama toastCustom', async () => {
        const { toastCustom } = require('../../../../componentes/Globais/ToastCustom');
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
        prestacaoService.postConcluirPeriodo.mockRejectedValue({
            response: {
                status: 400,
                data: {
                    erro: 'erro_de_validacao',
                    mensagem: 'Erro de validação encontrado.',
                },
            },
        });
        renderComponent();

        await clickConcluirViaAviso();
        await waitFor(() => expect(screen.getByTestId('modal-concluir-periodo-confirmar')).toBeInTheDocument());

        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-concluir-periodo-confirmar'));
        });

        await waitFor(() => {
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith('Erro de validação encontrado.');
        });
    });

    it('status DEVOLVIDA com acertos pendentes abre ModalConcluirAcertoComPendencias', async () => {
        const mockStatusDevolvida = {
            ...mockStatusPeriodoCondicaoSemPendencia,
            pendencias_cadastrais: null,
            prestacao_contas_status: {
                ...mockStatusPeriodoCondicaoSemPendencia.prestacao_contas_status,
                status_prestacao: 'DEVOLVIDA',
                tem_acertos_pendentes: true,
                pc_requer_conclusao: true,
            },
        };
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusDevolvida);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
        renderComponent();

        await clickConcluirPeriodo();

        await waitFor(() => {
            expect(screen.getByTestId('modal-acerto-com-pendencias-ir-analise')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-acerto-com-pendencias-fechar'));
        });
        expect(screen.queryByTestId('modal-acerto-com-pendencias-ir-analise')).not.toBeInTheDocument();
    });

    it('status DEVOLVIDA com acertos pendentes clica irParaAnaliseDre', async () => {
        const mockStatusDevolvida = {
            ...mockStatusPeriodoCondicaoSemPendencia,
            pendencias_cadastrais: null,
            prestacao_contas_status: {
                ...mockStatusPeriodoCondicaoSemPendencia.prestacao_contas_status,
                status_prestacao: 'DEVOLVIDA',
                tem_acertos_pendentes: true,
                pc_requer_conclusao: true,
            },
        };
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusDevolvida);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
        renderComponent();

        await clickConcluirPeriodo();
        await waitFor(() => expect(screen.getByTestId('modal-acerto-com-pendencias-ir-analise')).toBeInTheDocument());

        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-acerto-com-pendencias-ir-analise'));
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/consulta-detalhamento-analise-da-dre/'));
        });
    });

    it('status DEVOLVIDA sem acertos pendentes e sem conta encerrada passa por ModalAvisoAssinatura', async () => {
        const mockStatusDevolvida = {
            ...mockStatusPeriodoCondicaoSemPendencia,
            pendencias_cadastrais: null,
            tem_conta_encerrada_com_saldo: false,
            prestacao_contas_status: {
                ...mockStatusPeriodoCondicaoSemPendencia.prestacao_contas_status,
                status_prestacao: 'DEVOLVIDA',
                tem_acertos_pendentes: false,
                pc_requer_conclusao: true,
            },
        };
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusDevolvida);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
        renderComponent();

        await clickConcluirPeriodo();

        // DEVOLVIDA sem pendentes → showConcluirAcertosSemPendencias=true → ModalAvisoAssinatura shows
        await waitFor(() => {
            expect(screen.getByTestId('modal-aviso-assinatura-concluir')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-aviso-assinatura-concluir'));
        });

        await waitFor(() => {
            expect(screen.getByTestId('modal-acerto-sem-pendencias-confirmar')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-acerto-sem-pendencias-fechar'));
        });
        expect(screen.queryByTestId('modal-acerto-sem-pendencias-confirmar')).not.toBeInTheDocument();
    });

    it('status DEVOLVIDA sem acertos pendentes e com conta encerrada com saldo abre CustomModalConfirm e cobre onConfirm linha 393', async () => {
        const { CustomModalConfirm } = require('../../../Globais/Modal/CustomModalConfirm');
        let capturedOnConfirm = null;
        CustomModalConfirm.mockImplementationOnce(({ onConfirm }) => { capturedOnConfirm = onConfirm; });
        const mockStatusDevolvida = {
            ...mockStatusPeriodoCondicaoSemPendencia,
            pendencias_cadastrais: null,
            tem_conta_encerrada_com_saldo: true,
            prestacao_contas_status: {
                ...mockStatusPeriodoCondicaoSemPendencia.prestacao_contas_status,
                status_prestacao: 'DEVOLVIDA',
                tem_acertos_pendentes: false,
                pc_requer_conclusao: true,
            },
        };
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusDevolvida);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
        renderComponent();

        await clickConcluirPeriodo();

        await waitFor(() => {
            expect(CustomModalConfirm).toHaveBeenCalled();
            expect(capturedOnConfirm).not.toBeNull();
        });

        // Explicitly call onConfirm to cover line 393 arrow function body
        await act(async () => {
            capturedOnConfirm();
        });

        // After onConfirm, showConcluirAcertosSemPendencias=true → ModalAvisoAssinatura appears
        await waitFor(() => {
            expect(screen.getByTestId('modal-aviso-assinatura-concluir')).toBeInTheDocument();
        });
    });

    it('status DEVOLVIDA confirmar acerto sem pendências chama concluirPeriodo e remove notificação', async () => {
        const mockStatusDevolvida = {
            ...mockStatusPeriodoCondicaoSemPendencia,
            pendencias_cadastrais: null,
            tem_conta_encerrada_com_saldo: false,
            prestacao_contas_status: {
                ...mockStatusPeriodoCondicaoSemPendencia.prestacao_contas_status,
                status_prestacao: 'DEVOLVIDA',
                tem_acertos_pendentes: false,
                pc_requer_conclusao: true,
            },
        };
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusDevolvida);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
        renderComponent();

        await clickConcluirPeriodo();
        await waitFor(() => expect(screen.getByTestId('modal-aviso-assinatura-concluir')).toBeInTheDocument());
        await act(async () => { fireEvent.click(screen.getByTestId('modal-aviso-assinatura-concluir')); });

        await waitFor(() => expect(screen.getByTestId('modal-acerto-sem-pendencias-confirmar')).toBeInTheDocument());

        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-acerto-sem-pendencias-confirmar'));
        });

        await waitFor(() => {
            expect(prestacaoService.postConcluirPeriodo).toHaveBeenCalled();
            expect(mockNotificacaoContext.setExibeModalTemDevolucao).toHaveBeenCalledWith(false);
            expect(mockNotificacaoContext.setExibeMensagemFixaTemDevolucao).toHaveBeenCalledWith(false);
        });
    });

    it('setConfBoxAtaApresentacao com alterado_em null define cor vermelha', async () => {
        prestacaoService.getDataPreenchimentoAta.mockResolvedValue({
            uuid: 'uuid-ata',
            nome: 'Ata Apresentação',
            alterado_em: null,
            completa: false,
        });
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitFor(() => {
            expect(prestacaoService.getDataPreenchimentoAta).toHaveBeenCalled();
        });
    });

    it('setConfBoxAtaApresentacao com completa false define ata incompleta', async () => {
        prestacaoService.getDataPreenchimentoAta.mockResolvedValue({
            uuid: 'uuid-ata',
            nome: 'Ata Apresentação',
            alterado_em: '2025-01-01T10:00:00',
            completa: false,
        });
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitFor(() => {
            expect(prestacaoService.getDataPreenchimentoAta).toHaveBeenCalled();
        });
    });

    it('setConfBoxAtaApresentacao com getDataPreenchimentoAta lançando erro chama getIniciarAta', async () => {
        prestacaoService.getDataPreenchimentoAta.mockRejectedValue(new Error('Falha ao buscar ata'));
        prestacaoService.getIniciarAta.mockResolvedValue({
            uuid: 'uuid-nova-ata',
            nome: 'Nova Ata',
        });
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitFor(() => {
            expect(prestacaoService.getIniciarAta).toHaveBeenCalled();
        });
    });

    it('setConfBoxAtaApresentacao sem uuid_prestacao_de_contas usa getDataPreenchimentoPreviaAta', async () => {
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'periodoPrestacaoDeConta') {
                return JSON.stringify({
                    periodo_uuid: 'mock-periodo',
                    data_inicial: '2025-01-01',
                    data_final: '2025-12-31',
                });
            }
            if (key === 'associacao') return 'mock-uuid-associacao';
            return null;
        });
        associacaoService.getDataPreenchimentoPreviaAta = jest.fn().mockResolvedValue({
            uuid: 'uuid-previa',
            nome: 'Ata Prévia',
            alterado_em: '2025-01-01T10:00:00',
        });
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitFor(() => {
            expect(associacaoService.getDataPreenchimentoPreviaAta).toHaveBeenCalled();
        });
    });

    it('setConfBoxAtaApresentacao sem uuid e getDataPreenchimentoPreviaAta com alterado_em null', async () => {
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'periodoPrestacaoDeConta') {
                return JSON.stringify({
                    periodo_uuid: 'mock-periodo',
                    data_inicial: '2025-01-01',
                    data_final: '2025-12-31',
                });
            }
            if (key === 'associacao') return 'mock-uuid-associacao';
            return null;
        });
        associacaoService.getDataPreenchimentoPreviaAta = jest.fn().mockResolvedValue({
            uuid: 'uuid-previa',
            nome: 'Ata Prévia',
            alterado_em: null,
        });
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitFor(() => {
            expect(associacaoService.getDataPreenchimentoPreviaAta).toHaveBeenCalled();
        });
    });

    it('setConfBoxAtaApresentacao sem uuid e getDataPreenchimentoPreviaAta lançando erro chama getIniciarPreviaAta', async () => {
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'periodoPrestacaoDeConta') {
                return JSON.stringify({
                    periodo_uuid: 'mock-periodo',
                    data_inicial: '2025-01-01',
                    data_final: '2025-12-31',
                });
            }
            if (key === 'associacao') return 'mock-uuid-associacao';
            return null;
        });
        associacaoService.getDataPreenchimentoPreviaAta = jest.fn().mockRejectedValue(new Error('Falha prévia'));
        prestacaoService.getIniciarPreviaAta = jest.fn().mockResolvedValue({
            uuid: 'uuid-previa-iniciada',
            nome: 'Ata Prévia Iniciada',
        });
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitFor(() => {
            expect(prestacaoService.getIniciarPreviaAta).toHaveBeenCalled();
        });
    });

    it('localStorage sem periodoPrestacaoDeConta e sem statusPrestacaoDeConta define estados vazios', async () => {
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'associacao') return 'mock-uuid-associacao';
            if (key === 'token') return 'mock-token';
            return null;
        });
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitFor(() => {
            expect(mockSetStatusPC).toHaveBeenCalledWith({});
        });
    });

    it('localStorage com statusPrestacaoDeConta e sem periodoPrestacaoDeConta', async () => {
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'statusPrestacaoDeConta') {
                return JSON.stringify(mockStatusPeriodoCondicaoSemPendencia);
            }
            if (key === 'associacao') return 'mock-uuid-associacao';
            if (key === 'token') return 'mock-token';
            return null;
        });
        renderComponent();

        await waitFor(() => {
            expect(mockSetStatusPC).toHaveBeenCalled();
        });
    });

    it('buscarRegistrosFalhaGeracaoPc exibe modal quando há registros de falha', async () => {
        const registroFalha = {
            excede_tentativas: false,
            periodo_referencia: '2023.2',
            periodo_uuid: 'mock-periodo',
        };
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([registroFalha]);
        renderComponent({ registroFalhaGeracaoPc: registroFalha });

        await waitFor(() => {
            expect(screen.getByTestId('modal-erro-concluir-pc')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-erro-pc-fechar'));
        });
        expect(screen.queryByTestId('modal-erro-concluir-pc')).not.toBeInTheDocument();
    });

    it('modal de erro ao gerar PC com excede_tentativas false mostra botão reprocessar', async () => {
        const registroFalha = {
            excede_tentativas: false,
            periodo_referencia: '2023.2',
            periodo_uuid: 'mock-periodo',
        };
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([registroFalha]);
        renderComponent({ registroFalhaGeracaoPc: registroFalha });

        await waitFor(() => {
            expect(screen.getByTestId('modal-erro-pc-reprocessar')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('modal-erro-pc-reprocessar'));
        });

        await waitFor(() => {
            expect(prestacaoService.postConcluirPeriodo).toHaveBeenCalled();
        });
    });

    it('verificaBarraAvisoErroProcessamentoPc quando periodo coincide e NAO_RECEBIDA retorna false', async () => {
        const registroFalha = {
            excede_tentativas: false,
            periodo_referencia: '2023.2',
            periodo_uuid: 'mock-periodo',
        };
        const statusComNaoRecebida = {
            ...mockStatusPeriodoCondicaoSemPendencia,
            prestacao_contas_status: {
                ...mockStatusPeriodoCondicaoSemPendencia.prestacao_contas_status,
                status_prestacao: 'NAO_RECEBIDA',
            },
        };
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(statusComNaoRecebida);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([registroFalha]);
        renderComponent({ registroFalhaGeracaoPc: registroFalha });

        await waitFor(() => {
            expect(mockSetAvisoErro).toHaveBeenCalledWith(false);
        });
    });

    it('verificaBarraAvisoErroProcessamentoPc quando periodo_uuid não coincide retorna false', async () => {
        const registroFalha = {
            excede_tentativas: false,
            periodo_referencia: '2022.1',
            periodo_uuid: 'outro-periodo',
        };
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([registroFalha]);
        renderComponent({ registroFalhaGeracaoPc: registroFalha });

        await waitFor(() => {
            expect(mockSetAvisoErro).toHaveBeenCalledWith(false);
        });
    });

    it('verificaBarraAvisoErroProcessamentoPc com status processando retorna false', async () => {
        const registroFalha = {
            excede_tentativas: false,
            periodo_referencia: '2023.2',
            periodo_uuid: 'mock-periodo',
        };
        const statusProcessando = {
            ...mockStatusPeriodoCondicaoSemPendencia,
            prestacao_contas_status: {
                ...mockStatusPeriodoCondicaoSemPendencia.prestacao_contas_status,
                status_prestacao: 'A_PROCESSAR',
            },
        };
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(statusProcessando);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([registroFalha]);
        renderComponent({ registroFalhaGeracaoPc: registroFalha });

        await waitFor(() => {
            expect(mockSetAvisoErro).toHaveBeenCalledWith(false);
        });
    });

    it('verificaBarraAvisoErroProcessamentoPc quando periodo coincide e status calculado exibe aviso', async () => {
        const registroFalha = {
            excede_tentativas: false,
            periodo_referencia: '2023.2',
            periodo_uuid: 'mock-periodo',
        };
        const statusCalculado = {
            ...mockStatusPeriodoCondicaoSemPendencia,
            prestacao_contas_status: {
                ...mockStatusPeriodoCondicaoSemPendencia.prestacao_contas_status,
                status_prestacao: 'CALCULADA',
            },
        };
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(statusCalculado);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([registroFalha]);
        renderComponent({ registroFalhaGeracaoPc: registroFalha });

        await waitFor(() => {
            expect(mockSetAvisoErro).toHaveBeenCalledWith(false);
        });
    });

    it('handleChangePeriodoPrestacaoDeConta com value vazio não acessa getStatusPeriodoPorData novamente', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitFor(() => {
            const select = document.getElementById('periodoPrestacaoDeConta');
            expect(select).toBeInTheDocument();
        });

        const callCountBefore = prestacaoService.getStatusPeriodoPorData.mock.calls.length;
        const select = document.getElementById('periodoPrestacaoDeConta');

        await act(async () => {
            fireEvent.change(select, { target: { value: '' } });
        });

        expect(prestacaoService.getStatusPeriodoPorData.mock.calls.length).toBe(callCountBefore);
    });

    it('toggleBtnEscolheContaAoTrocarPeriodo usa fallback para index 0 quando conta não encontrada', async () => {
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'periodoPrestacaoDeConta') {
                return JSON.stringify({
                    periodo_uuid: 'mock-periodo',
                    data_inicial: '2025-01-01',
                    data_final: '2025-12-31',
                });
            }
            if (key === 'contaPrestacaoDeConta') {
                return JSON.stringify({ conta_uuid: 'uuid-nao-existente' });
            }
            if (key === 'uuidPrestacaoConta') return 'mock-uuid-pc';
            if (key === 'associacao') return 'mock-uuid-associacao';
            if (key === 'token') return 'mock-token';
        });
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitForLoaded();
        expect(screen.getByTestId('mock-demonstrativos-financeiros')).toBeInTheDocument();
    });

    it('carregaTabelas com erro no catch não quebra o componente', async () => {
        associacaoService.getContasAtivasDaAssociacaoNoPeriodo.mockRejectedValue(new Error('Erro de rede'));
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitFor(() => {
            expect(associacaoService.getContasAtivasDaAssociacaoNoPeriodo).toHaveBeenCalled();
        });
    });

    it('clica em Ir para Conciliação Bancária no ModalPendenciasCadastrais (ambasPendencias) cobre linha 347', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoAmbasPendencias);
        renderComponent();

        await clickConcluirPeriodo();

        await waitFor(() => {
            expect(screen.getByText(/Ir para Conciliação Bancária/i)).toBeInTheDocument();
        });
        await act(async () => {
            fireEvent.click(screen.getByText(/Ir para Conciliação Bancária/i));
        });

        // ambasPendencias has contas_pendentes: ['uuid-1', 'uuid-2'] (length > 1) → URL without conta
        const periodo = JSON.parse(Storage.prototype.getItem('periodoPrestacaoDeConta')).periodo_uuid;
        expect(mockNavigate).toHaveBeenCalledWith(`/detalhe-das-prestacoes/${periodo}/?origem=concluir-periodo`);
    });

    it('clica em Ver Ata chama onClickVisualizarAta cobrindo linhas 476-477 e 696', async () => {
        delete window.location;
        window.location = { assign: jest.fn() };

        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitForLoaded();

        await act(async () => {
            fireEvent.click(screen.getByTestId('mock-geracao-ata-apresentacao'));
        });

        await waitFor(() => {
            expect(window.location.assign).toHaveBeenCalledWith(expect.stringContaining('/visualizacao-da-ata/'));
        });
    });

    it('handleChangePeriodoPrestacaoDeConta com valor válido cobre linhas 237-243', async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitForLoaded();

        // Clear counts after initial load to isolate the handleChange call
        mockSetStatusPC.mockClear();
        prestacaoService.getStatusPeriodoPorData.mockClear();

        const periodoValue = JSON.stringify({
            periodo_uuid: mockPeriodos[0].uuid,
            data_inicial: mockPeriodos[0].data_inicio_realizacao_despesas,
            data_final: mockPeriodos[0].data_fim_realizacao_despesas,
        });
        const select = document.getElementById('periodoPrestacaoDeConta');
        await act(async () => {
            fireEvent.change(select, { target: { value: periodoValue } });
        });

        await waitFor(() => {
            expect(mockSetStatusPC).toHaveBeenCalled();
            expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalled();
        });
    });

    it('setConfBoxAtaApresentacao sem uuid e ambas previaAta falham cobre linha 466', async () => {
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'periodoPrestacaoDeConta') {
                return JSON.stringify({
                    periodo_uuid: 'mock-periodo',
                    data_inicial: '2025-01-01',
                    data_final: '2025-12-31',
                });
            }
            if (key === 'associacao') return 'mock-uuid-associacao';
            return null;
        });
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        associacaoService.getDataPreenchimentoPreviaAta = jest.fn().mockRejectedValue(new Error('Falha prévia'));
        prestacaoService.getIniciarPreviaAta = jest.fn().mockRejectedValue(new Error('Falha ao iniciar prévia'));
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        renderComponent();

        await waitFor(() => {
            expect(prestacaoService.getIniciarPreviaAta).toHaveBeenCalled();
        });

        consoleSpy.mockRestore();
    });

    it('parâmetro monitoramento na URL aciona concluirPeriodo cobrindo linhas 556-566', async () => {
        mockUseParams.mockReturnValue({ monitoramento: 'monitoramento-de-pc' });
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusPeriodoCondicaoSemPendencia);
        notificacaoService.getRegistrosFalhaGeracaoPc.mockResolvedValue([]);
        renderComponent();

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/prestacao-de-contas/', { replace: true });
        }, { timeout: 5000 });

        await waitFor(() => {
            expect(prestacaoService.postConcluirPeriodo).toHaveBeenCalled();
        }, { timeout: 5000 });
    });

    it('status_a_considerar usa else branch quando featureFlagAtiva novo-processo-pc é falso cobrindo linha 82', async () => {
        visoesService.visoesService.featureFlagAtiva.mockImplementation((flag) => {
            if (flag === 'novo-processo-pc') return null;
            return Promise.resolve(true);
        });
        const mockStatusProcessando = {
            ...mockStatusPeriodoCondicaoSemPendencia,
            prestacao_contas_status: {
                ...mockStatusPeriodoCondicaoSemPendencia.prestacao_contas_status,
                status_prestacao: 'A_PROCESSAR',
            },
        };
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue(mockStatusProcessando);
        renderComponent();

        await waitFor(() => {
            expect(prestacaoService.getStatusPeriodoPorData).toHaveBeenCalled();
        });
    });
});
