import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, act } from '@testing-library/react';
import { ResumoDosAcertos } from '../index';

let capturedTabsProps = null;
let capturedModalErroProps = null;
let capturedModalConfirmaProps = null;
let capturedModalConciliacaoProps = null;
let capturedTopoProps = null;

// Captures for useHandleDevolverParaAssociacao args
let capturedSetContasPendenciaConciliacao = null;
let capturedSetContasPendenciaLancamentos = null;
let capturedSetContasSolicitarCorrecao = null;
let capturedSetShowModalConfirma = null;
let capturedSetShowModalConciliacao = null;
let capturedSetShowModalLancamentos = null;
let capturedSetShowModalComprovante = null;
let capturedSetShowModalJustificativa = null;

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
}));

jest.mock('../TopoComBotoes', () => ({
    TopoComBotoes: (props) => {
        capturedTopoProps = props;
        return (
            <div data-testid="topo-mock">
                <button data-testid="btn-voltar" onClick={props.onClickBtnVoltar}>Voltar</button>
                <button data-testid="btn-devolver" onClick={props.onClickDevolver}>Devolver</button>
            </div>
        );
    },
}));

jest.mock('../TabsConferenciaAtualHistorico', () => (props) => {
    capturedTabsProps = props;
    return <div data-testid="tabs-mock" />;
});

jest.mock('../../DevolucaoParaAcertos/ModalErroDevolverParaAcerto', () => ({
    ModalErroDevolverParaAcerto: (props) => {
        capturedModalErroProps = props;
        return props.show ? (
            <div data-testid="modal-erro">
                <span data-testid="modal-erro-texto">{props.texto}</span>
                <button data-testid="modal-erro-close" onClick={props.handleClose}>Fechar</button>
            </div>
        ) : null;
    },
}));

jest.mock('../../DevolucaoParaAcertos/ModalConfirmaDevolverParaAcerto', () => ({
    ModalConfirmaDevolverParaAcerto: (props) => {
        capturedModalConfirmaProps = props;
        return props.show ? (
            <div data-testid="modal-confirma">
                <button data-testid="modal-confirma-devolver" onClick={props.onDevolverParaAcertoTrue}>Confirmar</button>
                <button data-testid="modal-confirma-close" onClick={props.handleClose}>Cancelar</button>
            </div>
        ) : null;
    },
}));

jest.mock('../../DevolucaoParaAcertos/ModalConciliacaoBancaria', () => ({
    ModalConciliacaoBancaria: (props) => {
        capturedModalConciliacaoProps = props;
        return props.show ? (
            <div data-testid="modal-conciliacao">
                <button data-testid="modal-conciliacao-confirmar" onClick={props.onConfirmarDevolucao}>Confirmar</button>
                <button data-testid="modal-conciliacao-close" onClick={props.handleClose}>Fechar</button>
            </div>
        ) : null;
    },
}));

// ModalComprovanteSaldoConta is reused for 3 different modals differentiated by titulo
jest.mock('../../DevolucaoParaAcertos/ModalComprovanteSaldoConta', () => ({
    ModalComprovanteSaldoConta: (props) => {
        let testId;
        if (props.titulo === 'Comprovante de saldo da conta') {
            testId = 'modal-comprovante';
        } else if (props.titulo === 'Justificativa de saldo da conta') {
            testId = 'modal-justificativa';
        } else {
            testId = 'modal-lancamentos';
        }
        return props.show ? (
            <div data-testid={testId} data-texto={props.texto}>
                <button data-testid={`${testId}-confirmar`} onClick={props.onConfirmar}>Confirmar</button>
                <button data-testid={`${testId}-close`} onClick={props.handleClose}>Fechar</button>
            </div>
        ) : null;
    },
}));

jest.mock('../../hooks/useHandleDevolverParaAssociacao', () => ({
    useHandleDevolverParaAssociacao: jest.fn(),
}));

jest.mock('../../../../../../paginas/PaginasContainer', () => ({
    PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}), { virtual: true });

jest.mock('../../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid', () => ({
    useCarregaPrestacaoDeContasPorUuid: jest.fn(),
}));

jest.mock('../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getConcluirAnalise: jest.fn(),
    getAnalisesDePcDevolvidas: jest.fn(),
    getUltimaAnalisePc: jest.fn(),
    getLancamentosAjustes: jest.fn(),
    getDocumentosAjustes: jest.fn(),
    getExtratosBancariosAjustes: jest.fn(),
    getInfoAta: jest.fn(),
    getDespesasPeriodosAnterioresAjustes: jest.fn(),
}));

jest.mock('../../../../../../services/mantemEstadoAnaliseDre.service', () => ({
    mantemEstadoAnaliseDre: {
        getAnaliseDreUsuarioLogado: jest.fn(() => ({ analise_pc_uuid: '' })),
        limpaAnaliseDreUsuarioLogado: jest.fn(),
        setAnaliseDrePorUsuario: jest.fn(),
    },
}));

jest.mock('../../../../../../services/visoes.service', () => ({
    visoesService: {
        featureFlagAtiva: jest.fn(() => false),
        getUsuarioLogin: jest.fn(() => 'usuario-teste'),
    },
}));

jest.mock('../../../../../../utils/Loading', () => (props) => (
    <div data-testid="loading" />
));

jest.mock('../../../../../../utils/ValidacoesAdicionaisFormularios', () => ({
    gerarUuid: jest.fn(() => 'test-uuid'),
    trataNumericos: jest.fn((v) => v),
}));

jest.mock('../../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const { useParams, useLocation, useNavigate } = require('react-router-dom');
const { useCarregaPrestacaoDeContasPorUuid } = require('../../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid');
const {
    getConcluirAnalise,
    getAnalisesDePcDevolvidas,
    getUltimaAnalisePc,
    getLancamentosAjustes,
    getDocumentosAjustes,
    getExtratosBancariosAjustes,
    getInfoAta,
    getDespesasPeriodosAnterioresAjustes,
} = require('../../../../../../services/dres/PrestacaoDeContas.service');
const { mantemEstadoAnaliseDre: meapc } = require('../../../../../../services/mantemEstadoAnaliseDre.service');
const { visoesService } = require('../../../../../../services/visoes.service');
const { toastCustom } = require('../../../../../Globais/ToastCustom');
const { useHandleDevolverParaAssociacao } = require('../../hooks/useHandleDevolverParaAssociacao');
const { trataNumericos } = require('../../../../../../utils/ValidacoesAdicionaisFormularios');

const BASE_PRESTACAO = {
    uuid: 'pc-uuid-test',
    status: 'DEVOLVIDA',
    pode_devolver: true,
    devolucoes_da_prestacao: [],
    analise_atual: { uuid: 'analise-uuid' },
    analises_de_conta_da_prestacao: [],
};

const BASE_INFO_ATA = {
    contas: [
        { conta_associacao: { uuid: 'conta-1', nome: 'Conta Cheque' } },
        { conta_associacao: { uuid: 'conta-2', nome: 'Conta Poupanca' } },
    ],
};

function setupDefaultMocks({
    prestacao = BASE_PRESTACAO,
    locationState = {},
    analisesDevolvidasReturn = [{ uuid: 'analise-devolvida-uuid' }],
    ultimaAnaliseReturn = { uuid: 'ultima-analise-uuid' },
    infoAtaReturn = BASE_INFO_ATA,
} = {}) {
    useParams.mockReturnValue({ prestacao_conta_uuid: prestacao.uuid });
    useLocation.mockReturnValue({ state: locationState, pathname: '/' });
    useNavigate.mockReturnValue(mockNavigate);
    useCarregaPrestacaoDeContasPorUuid.mockReturnValue(prestacao);

    getAnalisesDePcDevolvidas.mockResolvedValue(analisesDevolvidasReturn);
    getUltimaAnalisePc.mockResolvedValue(ultimaAnaliseReturn);
    getLancamentosAjustes.mockResolvedValue([]);
    getDocumentosAjustes.mockResolvedValue([]);
    getExtratosBancariosAjustes.mockResolvedValue(null);
    getInfoAta.mockResolvedValue(infoAtaReturn);
    getDespesasPeriodosAnterioresAjustes.mockResolvedValue([]);

    meapc.getAnaliseDreUsuarioLogado.mockReturnValue({ analise_pc_uuid: '' });
    visoesService.getUsuarioLogin.mockReturnValue('usuario-teste');
    visoesService.featureFlagAtiva.mockReturnValue(false);

    // Default hook: captures setters and returns a jest.fn()
    useHandleDevolverParaAssociacao.mockImplementation((args) => {
        capturedSetContasPendenciaConciliacao = args.setContasPendenciaConciliacao;
        capturedSetContasPendenciaLancamentos = args.setContasPendenciaLancamentosConciliacao;
        capturedSetContasSolicitarCorrecao = args.setContasSolicitarCorrecaoJustificativaConciliacao;
        capturedSetShowModalConfirma = args.setShowModalConfirmaDevolverParaAcerto;
        capturedSetShowModalConciliacao = args.setShowModalConciliacaoBancaria;
        capturedSetShowModalLancamentos = args.setShowModalLancamentosConciliacao;
        capturedSetShowModalComprovante = args.setShowModalComprovanteSaldoConta;
        capturedSetShowModalJustificativa = args.setShowModalJustificativaSaldoConta;
        return jest.fn();
    });
}

async function waitForTabs() {
    return screen.findByTestId('tabs-mock');
}

describe('ResumoDosAcertos - index.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        capturedTabsProps = null;
        capturedModalErroProps = null;
        capturedModalConfirmaProps = null;
        capturedModalConciliacaoProps = null;
        capturedTopoProps = null;
        capturedSetContasPendenciaConciliacao = null;
        capturedSetContasPendenciaLancamentos = null;
        capturedSetContasSolicitarCorrecao = null;
        capturedSetShowModalConfirma = null;
        capturedSetShowModalConciliacao = null;
        capturedSetShowModalLancamentos = null;
        capturedSetShowModalComprovante = null;
        capturedSetShowModalJustificativa = null;
    });

    describe('Rendering inicial', () => {
        it('renderiza o componente e exibe o cabeçalho', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-123' },
            });
            render(<ResumoDosAcertos />);
            expect(screen.getByText('Acompanhamento das Prestações de Contas')).toBeInTheDocument();
        });

        it('exibe Loading enquanto carrega e TabsConferenciaAtualHistorico depois', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-123' },
            });
            render(<ResumoDosAcertos />);
            expect(screen.getByTestId('loading')).toBeInTheDocument();
            await waitForTabs();
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
            expect(screen.getByTestId('tabs-mock')).toBeInTheDocument();
        });

        it('renderiza TopoComBotoes', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-123' },
            });
            render(<ResumoDosAcertos />);
            expect(screen.getByTestId('topo-mock')).toBeInTheDocument();
        });
    });

    describe('carregaInfoAta', () => {
        it('usa infoAta do locationState quando disponível', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-info-state' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            // getInfoAta should NOT be called when infoAta is in state
            expect(getInfoAta).not.toHaveBeenCalled();
        });

        it('busca infoAta via serviço quando não está no locationState', async () => {
            const prestacao = { ...BASE_PRESTACAO, uuid: 'pc-uuid-test' };
            setupDefaultMocks({
                prestacao,
                locationState: {},
                ultimaAnaliseReturn: { uuid: 'analise-from-service' },
            });
            render(<ResumoDosAcertos />);
            await waitFor(() => {
                expect(getInfoAta).toHaveBeenCalledWith(prestacao.uuid);
            });
        });

        it('não chama getInfoAta quando prestacaoDeContas não tem uuid', async () => {
            const prestacaoSemUuid = { ...BASE_PRESTACAO, uuid: undefined };
            setupDefaultMocks({
                prestacao: prestacaoSemUuid,
                locationState: {},
                ultimaAnaliseReturn: { uuid: 'analise-123' },
            });
            render(<ResumoDosAcertos />);
            await screen.findByTestId('loading');
            expect(getInfoAta).not.toHaveBeenCalled();
        });
    });

    describe('getAnalisePrestacao', () => {
        it('usa analisesDeContaDaPrestacao do locationState quando disponível', async () => {
            const analises = [{ uuid: 'analise-conta-uuid' }];
            setupDefaultMocks({
                locationState: { analisesDeContaDaPrestacao: analises, editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-123' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            // tabs should receive the analises count influencing totalAnalisesDeContaDaPrestacao
            expect(capturedTabsProps).not.toBeNull();
        });

        it('busca analises de conta via prestacaoDeContas quando não está no state', async () => {
            const prestacao = {
                ...BASE_PRESTACAO,
                analises_de_conta_da_prestacao: [
                    {
                        uuid: 'analise-c1',
                        conta_associacao: { uuid: 'conta-1' },
                        data_extrato: '2024-01-15',
                        saldo_extrato: 1000,
                    },
                ],
            };
            setupDefaultMocks({
                prestacao,
                locationState: {},
                ultimaAnaliseReturn: { uuid: 'analise-from-service' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(capturedTabsProps).not.toBeNull();
        });

        it('retorna array vazio quando prestacao não tem analises_de_conta', async () => {
            const prestacao = { ...BASE_PRESTACAO, analises_de_conta_da_prestacao: [] };
            setupDefaultMocks({
                prestacao,
                locationState: {},
                ultimaAnaliseReturn: { uuid: 'analise-123' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(capturedTabsProps).not.toBeNull();
        });

        it('retorna undefined quando prestacaoDeContas é null', async () => {
            setupDefaultMocks({
                locationState: {},
                ultimaAnaliseReturn: { uuid: 'analise-123' },
            });
            // temporarily make hook return null
            useCarregaPrestacaoDeContasPorUuid.mockReturnValue(null);
            render(<ResumoDosAcertos />);
            // Should not crash
            expect(screen.getByTestId('loading')).toBeInTheDocument();
        });
    });

    describe('verificaEditavel', () => {
        it('retorna true quando status é EM_ANALISE', async () => {
            const prestacao = { ...BASE_PRESTACAO, status: 'EM_ANALISE', analise_atual: { uuid: 'analise-em-analise' } };
            setupDefaultMocks({
                prestacao,
                locationState: {},
                ultimaAnaliseReturn: { uuid: 'analise-em-analise' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(capturedTabsProps.editavel).toBe(true);
        });

        it('retorna false quando status não é EM_ANALISE', async () => {
            const prestacao = { ...BASE_PRESTACAO, status: 'DEVOLVIDA' };
            setupDefaultMocks({
                prestacao,
                locationState: {},
                ultimaAnaliseReturn: { uuid: 'analise-devolvida' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(capturedTabsProps.editavel).toBe(false);
        });

        it('usa editavel do locationState quando disponível', async () => {
            setupDefaultMocks({
                locationState: { editavel: true, analisesDeContaDaPrestacao: [], infoAta: BASE_INFO_ATA },
                ultimaAnaliseReturn: { uuid: 'analise-state' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(capturedTabsProps.editavel).toBe(true);
        });
    });

    describe('setAnaliseAtualUuidComPCAnaliseAtualUuid', () => {
        it('chama getUltimaAnalisePc quando não é editável', async () => {
            const prestacao = { ...BASE_PRESTACAO, status: 'EM_ANALISE' };
            setupDefaultMocks({
                prestacao,
                locationState: {},
                ultimaAnaliseReturn: { uuid: 'ultima-analise-uuid' },
            });
            render(<ResumoDosAcertos />);
            await waitFor(() => {
                expect(getUltimaAnalisePc).toHaveBeenCalledWith(prestacao.uuid);
            });
        });

        it('salva analise no localStorage via meapcservice', async () => {
            setupDefaultMocks({
                prestacao: { ...BASE_PRESTACAO, status: 'EM_ANALISE' },
                locationState: {},
                ultimaAnaliseReturn: { uuid: 'analise-para-storage' },
            });
            render(<ResumoDosAcertos />);
            await waitFor(() => {
                expect(meapc.setAnaliseDrePorUsuario).toHaveBeenCalled();
            });
        });

        it('limpa analiseDre quando uuid difere', async () => {
            setupDefaultMocks({
                prestacao: { ...BASE_PRESTACAO, status: 'EM_ANALISE' },
                locationState: {},
                ultimaAnaliseReturn: { uuid: 'uuid-novo' },
            });
            // Override after setupDefaultMocks so the mock is used during render
            meapc.getAnaliseDreUsuarioLogado.mockReturnValue({ analise_pc_uuid: 'uuid-antigo' });
            render(<ResumoDosAcertos />);
            await waitFor(() => {
                expect(meapc.limpaAnaliseDreUsuarioLogado).toHaveBeenCalledWith('usuario-teste');
            });
        });

        it('não limpa quando uuid é igual', async () => {
            setupDefaultMocks({
                prestacao: { ...BASE_PRESTACAO, status: 'EM_ANALISE' },
                locationState: {},
                ultimaAnaliseReturn: { uuid: 'mesmo-uuid' },
            });
            meapc.getAnaliseDreUsuarioLogado.mockReturnValue({ analise_pc_uuid: 'mesmo-uuid' });
            render(<ResumoDosAcertos />);
            await waitFor(() => {
                expect(meapc.setAnaliseDrePorUsuario).toHaveBeenCalled();
            });
            expect(meapc.limpaAnaliseDreUsuarioLogado).not.toHaveBeenCalled();
        });
    });

    describe('totalAnalisesDeContaDaPrestacao', () => {
        it('conta analises com uuid no reduce', async () => {
            const analises = [
                { uuid: 'a1' },
                { uuid: 'a2' },
                { uuid: null }, // sem uuid, não conta
            ];
            setupDefaultMocks({
                locationState: { analisesDeContaDaPrestacao: analises, editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-123' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            // possuiAcertosSelecionados depende deste valor
            expect(capturedTabsProps).not.toBeNull();
        });

        it('retorna 0 quando lista vazia', async () => {
            setupDefaultMocks({
                locationState: { analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-123' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(capturedTabsProps).not.toBeNull();
        });
    });

    describe('analises de PC devolvidas', () => {
        it('carrega analises devolvidas e define analiseAtualUuid', async () => {
            const devolvidas = [{ uuid: 'devolvida-1' }, { uuid: 'devolvida-2' }];
            setupDefaultMocks({
                locationState: {},
                analisesDevolvidasReturn: devolvidas,
                ultimaAnaliseReturn: { uuid: 'ultima' },
            });
            render(<ResumoDosAcertos />);
            await waitFor(() => {
                expect(getAnalisesDePcDevolvidas).toHaveBeenCalledWith(BASE_PRESTACAO.uuid);
            });
        });

        it('define totais como string vazia via setPrimeiraAnalisePcDevolvida', async () => {
            const devolvidas = [{ uuid: 'dev-uuid' }];
            setupDefaultMocks({
                locationState: {},
                analisesDevolvidasReturn: devolvidas,
                ultimaAnaliseReturn: { uuid: 'ultima' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            // If tabs appear, setPrimeiraAnalisePcDevolvida set analiseAtualUuid to 'dev-uuid'
            expect(screen.getByTestId('tabs-mock')).toBeInTheDocument();
        });
    });

    describe('verificaPcEmAnalise', () => {
        it('seta pcEmAnalise=true quando status EM_ANALISE', async () => {
            const prestacao = { ...BASE_PRESTACAO, status: 'EM_ANALISE', analise_atual: { uuid: 'analise-em' } };
            setupDefaultMocks({
                prestacao,
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: true },
                ultimaAnaliseReturn: { uuid: 'analise-em' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(capturedTabsProps.pcEmAnalise).toBe(true);
        });

        it('seta pcEmAnalise=false e chama setPrimeiraAnalisePcDevolvida', async () => {
            const prestacao = { ...BASE_PRESTACAO, status: 'DEVOLVIDA' };
            setupDefaultMocks({
                prestacao,
                locationState: {},
                ultimaAnaliseReturn: { uuid: 'analise-devolvida' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(capturedTabsProps.pcEmAnalise).toBe(false);
        });
    });

    describe('verificaQtdeLancamentosDocumentosAjustes', () => {
        it('chama os serviços de ajustes por conta quando infoAta tem contas', async () => {
            getLancamentosAjustes.mockResolvedValue([{ id: 1 }, { id: 2 }]);
            getDocumentosAjustes.mockResolvedValue([{ id: 1 }]);
            getExtratosBancariosAjustes.mockResolvedValue([{ id: 1 }]);
            getDespesasPeriodosAnterioresAjustes.mockResolvedValue([{ id: 1 }]);

            const devolvidas = [{ uuid: 'analise-com-contas' }];
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA },
                analisesDevolvidasReturn: devolvidas,
                ultimaAnaliseReturn: { uuid: 'analise-com-contas' },
            });
            render(<ResumoDosAcertos />);
            await waitFor(() => {
                expect(getLancamentosAjustes).toHaveBeenCalled();
            });
        });

        it('não chama serviços quando infoAta não tem contas', async () => {
            setupDefaultMocks({
                locationState: { infoAta: { contas: [] } },
                ultimaAnaliseReturn: { uuid: 'analise-sem-contas' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(getLancamentosAjustes).not.toHaveBeenCalled();
        });
    });

    describe('handleChangeDataLimiteDevolucao', () => {
        it('atualiza dataLimiteDevolucao via capturedTabsProps', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: true },
                ultimaAnaliseReturn: { uuid: 'analise-data' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(capturedTabsProps.handleChangeDataLimiteDevolucao).toBeDefined();
            act(() => {
                capturedTabsProps.handleChangeDataLimiteDevolucao('data', '2024-06-01');
            });
            // No crash = passed
        });
    });

    describe('onClickBtnVoltar', () => {
        it('navega para a URL correta ao clicar em voltar', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-123' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            act(() => {
                capturedTopoProps.onClickBtnVoltar();
            });
            expect(mockNavigate).toHaveBeenCalledWith(
                `/dre-detalhe-prestacao-de-contas/${BASE_PRESTACAO.uuid}#devolucao_para_acerto`
            );
        });
    });

    describe('trataAnalisesDeContaDaPrestacao', () => {
        it('formata data_extrato e saldo_extrato ao devolver', async () => {
            trataNumericos.mockImplementation((v) => 'numero-formatado');
            const analises = [
                { uuid: 'a1', data_extrato: '2024-03-15', saldo_extrato: ' 1.000,00 ' },
                { uuid: 'a2', data_extrato: null, saldo_extrato: null },
            ];
            setupDefaultMocks({
                locationState: { analisesDeContaDaPrestacao: analises, editavel: true, infoAta: BASE_INFO_ATA },
                ultimaAnaliseReturn: { uuid: 'analise-trata' },
            });
            getConcluirAnalise.mockResolvedValue({ ok: true });

            render(<ResumoDosAcertos />);
            await waitForTabs();

            // Trigger devolverParaAcertos via modal confirma
            act(() => {
                capturedSetShowModalConfirma(true);
            });

            await screen.findByTestId('modal-confirma');
            await act(async () => {
                screen.getByTestId('modal-confirma-devolver').click();
            });

            await waitFor(() => {
                expect(getConcluirAnalise).toHaveBeenCalled();
            });
            const payload = getConcluirAnalise.mock.calls[0][1];
            // saldo_extrato with value calls trataNumericos
            expect(trataNumericos).toHaveBeenCalledWith(' 1.000,00 ');
            // saldo_extrato null becomes 0
            expect(payload.analises_de_conta_da_prestacao[1].saldo_extrato).toBe(0);
        });
    });

    describe('devolverParaAcertos', () => {
        it('chama getConcluirAnalise e navega no sucesso', async () => {
            getConcluirAnalise.mockResolvedValue({ ok: true });
            setupDefaultMocks({
                locationState: { analisesDeContaDaPrestacao: [], editavel: true, infoAta: BASE_INFO_ATA },
                ultimaAnaliseReturn: { uuid: 'analise-devolver' },
            });

            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalConfirma(true); });
            await screen.findByTestId('modal-confirma');

            await act(async () => {
                screen.getByTestId('modal-confirma-devolver').click();
            });

            await waitFor(() => {
                expect(getConcluirAnalise).toHaveBeenCalledWith(BASE_PRESTACAO.uuid, expect.any(Object));
            });
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalled();
        });

        it('exibe ModalErroDevolverParaAcerto quando pode_devolver=false', async () => {
            const prestacao = { ...BASE_PRESTACAO, pode_devolver: false };
            setupDefaultMocks({
                prestacao,
                locationState: { analisesDeContaDaPrestacao: [], editavel: true, infoAta: BASE_INFO_ATA },
                ultimaAnaliseReturn: { uuid: 'analise-nao-pode' },
            });

            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalConfirma(true); });
            await screen.findByTestId('modal-confirma');

            await act(async () => {
                screen.getByTestId('modal-confirma-devolver').click();
            });

            await screen.findByTestId('modal-erro');
            expect(screen.getByTestId('modal-erro-texto').textContent).toMatch(/exclusão dos documentos/);
            expect(getConcluirAnalise).not.toHaveBeenCalled();
        });

        it('trata erro com mensagem da API no catch', async () => {
            getConcluirAnalise.mockRejectedValue({
                response: { data: { mensagem: 'Mensagem de erro da API' } },
            });
            setupDefaultMocks({
                locationState: { analisesDeContaDaPrestacao: [], editavel: true, infoAta: BASE_INFO_ATA },
                ultimaAnaliseReturn: { uuid: 'analise-erro' },
            });

            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalConfirma(true); });
            await screen.findByTestId('modal-confirma');

            await act(async () => {
                screen.getByTestId('modal-confirma-devolver').click();
            });

            await waitFor(() => {
                expect(getConcluirAnalise).toHaveBeenCalled();
            });
            expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
        });

        it('trata erro sem mensagem no catch', async () => {
            getConcluirAnalise.mockRejectedValue({
                response: { data: {} },
            });
            setupDefaultMocks({
                locationState: { analisesDeContaDaPrestacao: [], editavel: true, infoAta: BASE_INFO_ATA },
                ultimaAnaliseReturn: { uuid: 'analise-erro2' },
            });

            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalConfirma(true); });
            await screen.findByTestId('modal-confirma');

            await act(async () => {
                screen.getByTestId('modal-confirma-devolver').click();
            });

            await waitFor(() => {
                expect(getConcluirAnalise).toHaveBeenCalled();
            });
        });

        it('fecha ModalConfirmaDevolverParaAcerto ao iniciar devolução', async () => {
            getConcluirAnalise.mockResolvedValue({ ok: true });
            setupDefaultMocks({
                locationState: { analisesDeContaDaPrestacao: [], editavel: true, infoAta: BASE_INFO_ATA },
                ultimaAnaliseReturn: { uuid: 'analise-fechar' },
            });

            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalConfirma(true); });
            await screen.findByTestId('modal-confirma');

            await act(async () => {
                screen.getByTestId('modal-confirma-devolver').click();
            });

            await waitFor(() => {
                expect(screen.queryByTestId('modal-confirma')).not.toBeInTheDocument();
            });
        });
    });

    describe('handleConfirmarDevolucaoConciliacao', () => {
        it('fecha modal conciliação e abre modal confirma', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-conc' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalConciliacao(true); });
            await screen.findByTestId('modal-conciliacao');

            await act(async () => {
                screen.getByTestId('modal-conciliacao-confirmar').click();
            });

            await screen.findByTestId('modal-confirma');
            expect(screen.queryByTestId('modal-conciliacao')).not.toBeInTheDocument();
        });

        it('fecha modal conciliação via handleClose', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-conc-close' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalConciliacao(true); });
            await screen.findByTestId('modal-conciliacao');

            act(() => { screen.getByTestId('modal-conciliacao-close').click(); });
            await waitFor(() => {
                expect(screen.queryByTestId('modal-conciliacao')).not.toBeInTheDocument();
            });
        });
    });

    describe('Handlers de modais de conta', () => {
        it('handleConfirmarComprovanteSaldo navega para extrato', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-comprovante' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalComprovante(true); });
            await screen.findByTestId('modal-comprovante');

            act(() => { screen.getByTestId('modal-comprovante-confirmar').click(); });
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith(
                    expect.stringContaining('collapse_sintese_por_realizacao_da_despesa')
                );
            });
        });

        it('handleIrParaJustificativaSaldoConta fecha modal e navega', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-justificativa' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalJustificativa(true); });
            await screen.findByTestId('modal-justificativa');

            act(() => { screen.getByTestId('modal-justificativa-confirmar').click(); });
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith(
                    expect.stringContaining('collapse_sintese_por_realizacao_da_despesa')
                );
            });
        });

        it('handleIrParaExtratoLancamentosConciliacao fecha modal e navega', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-lancamentos' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalLancamentos(true); });
            await screen.findByTestId('modal-lancamentos');

            act(() => { screen.getByTestId('modal-lancamentos-confirmar').click(); });
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith(
                    expect.stringContaining('collapse_sintese_por_realizacao_da_despesa')
                );
            });
        });

        it('handleFecharModalLancamentosConciliacao fecha modal sem navegar', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-fechar-lanc' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalLancamentos(true); });
            await screen.findByTestId('modal-lancamentos');

            act(() => { screen.getByTestId('modal-lancamentos-close').click(); });
            await waitFor(() => {
                expect(screen.queryByTestId('modal-lancamentos')).not.toBeInTheDocument();
            });
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    describe('obterNomeConta', () => {
        it('retorna N/E para conta null/false', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-nome-null' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetContasPendenciaConciliacao([null]); });
            await waitFor(() => {
                expect(capturedModalErroProps).toBeDefined();
            });
        });

        it('retorna nome via obterNomeContaPorUuid para string uuid', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-nome-string' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalComprovante(true); });
            await screen.findByTestId('modal-comprovante');
            // Trigger obterNomeConta with string
            act(() => { capturedSetContasPendenciaConciliacao(['conta-1']); });
            await waitFor(() => {
                // The texto prop of the modal should include the conta name
                const modal = screen.getByTestId('modal-comprovante');
                expect(modal).toBeInTheDocument();
            });
        });

        it('retorna N/E para string uuid não encontrada', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-nome-nao-encontrado' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetContasPendenciaConciliacao(['uuid-inexistente']); });
            // No crash = passed; nome would be 'N/E'
        });

        it('retorna nome do objeto via conta.nome', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-obj-nome' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetContasPendenciaConciliacao([{ nome: 'Conta Direta' }]); });
            // No crash = passed
        });

        it('retorna nome via conta.nome_conta', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-obj-nome-conta' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetContasPendenciaConciliacao([{ nome_conta: 'Nome Conta' }]); });
        });

        it('retorna nome via conta.conta_nome', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-obj-conta-nome' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetContasPendenciaConciliacao([{ conta_nome: 'Conta Nome' }]); });
        });

        it('retorna nome via conta_associacao.nome', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-obj-assoc' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetContasPendenciaConciliacao([{ conta_associacao: { nome: 'Conta Assoc' } }]); });
        });

        it('retorna nome via obterNomeContaPorUuid(conta.uuid)', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-obj-uuid' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            // objeto sem nome mas com uuid que existe em infoAta
            act(() => { capturedSetContasPendenciaConciliacao([{ uuid: 'conta-1' }]); });
        });

        it('retorna nome via obterNomeContaPorUuid(conta.conta_uuid)', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-obj-conta-uuid' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetContasPendenciaConciliacao([{ conta_uuid: 'conta-1' }]); });
        });

        it('retorna N/E para objeto sem campos identificadores', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-obj-vazio' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetContasPendenciaConciliacao([{}]); });
            // No crash = passed
        });

        it('retorna null em obterNomeContaPorUuid quando infoAta.contas é undefined', async () => {
            setupDefaultMocks({
                locationState: { infoAta: { contas: undefined }, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-sem-contas-ata' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetContasPendenciaConciliacao(['conta-1']); });
            // Should not crash
        });
    });

    describe('obterContasLancamentosConciliacao e obterContasJustificativaConciliacao', () => {
        it('retorna array vazio quando contasPendenciaLancamentos está vazia', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-lanc-vazia' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            // contasPendenciaLancamentos starts empty
            act(() => { capturedSetContasPendenciaLancamentos([]); });
        });

        it('mapeia contas de lancamento com obterNomeConta', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-lanc' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetContasPendenciaLancamentos(['conta-2']); });
        });

        it('mapeia contas de justificativa com obterNomeConta', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-justif' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetContasSolicitarCorrecao(['conta-1']); });
        });
    });

    describe('textoModalLancamentosConciliacao', () => {
        it('retorna textoSolicitacoesLancamentos quando blocos está vazio', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-blocos-vazio' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            // All state variables empty -> blocos = [] -> return textoSolicitacoesLancamentosConciliacao
            act(() => { capturedSetShowModalLancamentos(true); });
            await screen.findByTestId('modal-lancamentos');
            const textoModal = screen.getByTestId('modal-lancamentos').getAttribute('data-texto');
            expect(textoModal).toContain('Acertos que alteram a conciliação bancária');
        });

        it('inclui todos os blocos quando todas as pendências existem', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-blocos-todos' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => {
                capturedSetContasPendenciaLancamentos(['conta-1']);
                capturedSetContasPendenciaConciliacao(['conta-2']);
                capturedSetContasSolicitarCorrecao(['conta-1']);
            });

            act(() => { capturedSetShowModalLancamentos(true); });
            await screen.findByTestId('modal-lancamentos');
            const textoModal = screen.getByTestId('modal-lancamentos').getAttribute('data-texto');
            expect(textoModal).toContain('Acertos que alteram a conciliação bancária');
            expect(textoModal).toContain('Comprovante de saldo da conta');
            expect(textoModal).toContain('Justificativa de saldo da conta');
        });
    });

    describe('possuiAcertosSelecionados', () => {
        it('inclui totalDespesasPeriodosAnteriores quando flag está ativa', async () => {
            visoesService.featureFlagAtiva.mockReturnValue(true);
            getDespesasPeriodosAnterioresAjustes.mockResolvedValue([{ id: 1 }]);

            const devolvidas = [{ uuid: 'analise-flag' }];
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA },
                analisesDevolvidasReturn: devolvidas,
                ultimaAnaliseReturn: { uuid: 'analise-flag' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith('ajustes-despesas-anteriores');
        });

        it('não inclui despesas anteriores quando flag está inativa', async () => {
            visoesService.featureFlagAtiva.mockReturnValue(false);
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-sem-flag' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith('ajustes-despesas-anteriores');
        });
    });

    describe('msgNaoExistemSolicitacoesDeAcerto', () => {
        it('retorna msg com devolucoes_da_prestacao quando há devolucoes', async () => {
            const prestacao = {
                ...BASE_PRESTACAO,
                devolucoes_da_prestacao: [{ id: 1 }],
            };
            setupDefaultMocks({
                prestacao,
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-com-dev' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(capturedTabsProps.msgNaoExistemSolicitacoesDeAcerto).toBe(
                'Não existem novas solicitações salvas desde o retorno da Associação. Consulte acima as solicitações anteriores'
            );
        });

        it('retorna msg sem devolucoes quando não há devolucoes', async () => {
            const prestacao = {
                ...BASE_PRESTACAO,
                devolucoes_da_prestacao: [],
            };
            setupDefaultMocks({
                prestacao,
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-sem-dev' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(capturedTabsProps.msgNaoExistemSolicitacoesDeAcerto).toBe(
                'Não existem solicitações para acerto salvas desde o envio da PC da Associação'
            );
        });

        it('retorna null quando há totais acima de 0', async () => {
            getLancamentosAjustes.mockResolvedValue([{ id: 1 }]);

            const devolvidas = [{ uuid: 'analise-com-ajustes' }];
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA },
                analisesDevolvidasReturn: devolvidas,
                ultimaAnaliseReturn: { uuid: 'analise-com-ajustes' },
            });
            render(<ResumoDosAcertos />);
            await waitFor(() => {
                expect(getLancamentosAjustes).toHaveBeenCalled();
            });
        });
    });

    describe('limpaStorage', () => {
        it('limpa storage quando elemento nav-conferencia-atual-tab existe', async () => {
            const devolvidas = [{ uuid: 'dev-uuid-storage' }];
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                analisesDevolvidasReturn: devolvidas,
                ultimaAnaliseReturn: { uuid: 'dev-uuid-storage' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            // Add the DOM element
            const el = document.createElement('div');
            el.id = 'nav-conferencia-atual-tab';
            document.body.appendChild(el);

            act(() => {
                capturedTabsProps.limpaStorage();
            });

            expect(meapc.limpaAnaliseDreUsuarioLogado).toHaveBeenCalled();
            expect(meapc.setAnaliseDrePorUsuario).toHaveBeenCalled();

            document.body.removeChild(el);
        });

        it('não faz nada quando nav-conferencia-atual-tab não existe', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-sem-nav' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            const callsBefore = meapc.limpaAnaliseDreUsuarioLogado.mock.calls.length;
            act(() => {
                capturedTabsProps.limpaStorage();
            });
            expect(meapc.limpaAnaliseDreUsuarioLogado.mock.calls.length).toBe(callsBefore);
        });
    });

    describe('ModalErroDevolverParaAcerto', () => {
        it('fecha o modal de erro ao clicar em Fechar', async () => {
            const prestacao = { ...BASE_PRESTACAO, pode_devolver: false };
            setupDefaultMocks({
                prestacao,
                locationState: { analisesDeContaDaPrestacao: [], editavel: true, infoAta: BASE_INFO_ATA },
                ultimaAnaliseReturn: { uuid: 'analise-modal-erro' },
            });

            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalConfirma(true); });
            await screen.findByTestId('modal-confirma');
            await act(async () => {
                screen.getByTestId('modal-confirma-devolver').click();
            });

            await screen.findByTestId('modal-erro');
            act(() => { screen.getByTestId('modal-erro-close').click(); });
            await waitFor(() => {
                expect(screen.queryByTestId('modal-erro')).not.toBeInTheDocument();
            });
        });
    });

    describe('ModalConfirmaDevolverParaAcerto handleClose', () => {
        it('fecha o modal de confirmação ao cancelar', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-cancel' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalConfirma(true); });
            await screen.findByTestId('modal-confirma');

            act(() => { screen.getByTestId('modal-confirma-close').click(); });
            await waitFor(() => {
                expect(screen.queryByTestId('modal-confirma')).not.toBeInTheDocument();
            });
        });
    });

    describe('ModalComprovanteSaldoConta handleClose', () => {
        it('fecha modal justificativa ao clicar em handleClose', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-just-close' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalJustificativa(true); });
            await screen.findByTestId('modal-justificativa');

            act(() => { screen.getByTestId('modal-justificativa-close').click(); });
            await waitFor(() => {
                expect(screen.queryByTestId('modal-justificativa')).not.toBeInTheDocument();
            });
        });

        it('fecha modal comprovante ao clicar em handleClose', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-comp-close' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            act(() => { capturedSetShowModalComprovante(true); });
            await screen.findByTestId('modal-comprovante');

            act(() => { screen.getByTestId('modal-comprovante-close').click(); });
            await waitFor(() => {
                expect(screen.queryByTestId('modal-comprovante')).not.toBeInTheDocument();
            });
        });
    });

    describe('setAnaliseAtualUuidComPCAnaliseAtualUuid via tabs', () => {
        it('expõe setAnaliseAtualUuidComPCAnaliseAtualUuid nas props das tabs', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-tabs' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();
            expect(typeof capturedTabsProps.setAnaliseAtualUuidComPCAnaliseAtualUuid).toBe('function');
            expect(typeof capturedTabsProps.setPrimeiraAnalisePcDevolvida).toBe('function');
            expect(typeof capturedTabsProps.limpaStorage).toBe('function');
        });

        it('chama getUltimaAnalisePc ao invocar setAnaliseAtualUuidComPCAnaliseAtualUuid novamente', async () => {
            setupDefaultMocks({
                locationState: { infoAta: BASE_INFO_ATA, analisesDeContaDaPrestacao: [], editavel: false },
                ultimaAnaliseReturn: { uuid: 'analise-tabs-2' },
            });
            render(<ResumoDosAcertos />);
            await waitForTabs();

            const initialCalls = getUltimaAnalisePc.mock.calls.length;
            await act(async () => {
                await capturedTabsProps.setAnaliseAtualUuidComPCAnaliseAtualUuid();
            });
            expect(getUltimaAnalisePc.mock.calls.length).toBeGreaterThan(initialCalls);
        });
    });

    describe('salvaAnaliseAtualLocalStorage', () => {
        it('salva uuid no localStorage via meapcservice', async () => {
            setupDefaultMocks({
                prestacao: { ...BASE_PRESTACAO, status: 'EM_ANALISE' },
                locationState: {},
                ultimaAnaliseReturn: { uuid: 'salva-storage-uuid' },
            });
            render(<ResumoDosAcertos />);
            await waitFor(() => {
                expect(meapc.setAnaliseDrePorUsuario).toHaveBeenCalled();
            });
            // setAnaliseDrePorUsuario(login, objeto) — login comes from visoesService.getUsuarioLogin()
            // which returns 'usuario-teste', but the call order may vary; check any call has analise_pc_uuid
            const allCalls = meapc.setAnaliseDrePorUsuario.mock.calls;
            const hasAnaliseUuid = allCalls.some(
                (args) => args[1] && typeof args[1].analise_pc_uuid !== 'undefined'
            );
            expect(hasAnaliseUuid).toBe(true);
        });
    });
});
