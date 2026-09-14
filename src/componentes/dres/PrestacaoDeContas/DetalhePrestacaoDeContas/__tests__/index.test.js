import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { DetalhePrestacaoDeContas } from '../index';
import { SidebarContext } from '../../../../../context/Sidebar';
import { NotificacaoContext } from '../../../../../context/Notificacoes';
import { toastCustom } from '../../../../Globais/ToastCustom';
import {
    getMotivosAprovadoComRessalva,
    getMotivosReprovacao,
    getPrestacaoDeContasDetalhe,
    patchDesfazerReceberAposAcertos,
    getUltimaAnalisePc,
    postAnaliseAjustesSaldoPorConta,
    deleteAnaliseAjustesSaldoPorConta,
    getAnaliseAjustesSaldoPorConta,
    getStatusPeriodo,
    getTabelasPrestacoesDeContas,
    getReceberPrestacaoDeContas,
    getReabrirPrestacaoDeContas,
    getDesfazerRecebimento,
    getAnalisarPrestacaoDeContas,
    getDesfazerAnalise,
    getInfoAta,
    getConcluirAnalise,
    getDespesasPorFiltros,
    getTiposDevolucao,
    patchReceberAposAcertos,
    getDesfazerConclusaoAnalise,
} from '../../../../../services/dres/PrestacaoDeContas.service';
import { getDespesa, getDespesasTabelas } from '../../../../../services/escolas/Despesas.service';
import { getPeriodoPorUuid } from '../../../../../services/sme/Parametrizacoes.service';

jest.mock('../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getDesfazerConclusaoAnalise: jest.fn(),
    getMotivosAprovadoComRessalva: jest.fn(),
    getMotivosReprovacao: jest.fn(),
    getPrestacaoDeContasDetalhe: jest.fn(),
    patchDesfazerReceberAposAcertos: jest.fn(),
    getUltimaAnalisePc: jest.fn(),
    postAnaliseAjustesSaldoPorConta: jest.fn(),
    deleteAnaliseAjustesSaldoPorConta: jest.fn(),
    getAnaliseAjustesSaldoPorConta: jest.fn(),
    getStatusPeriodo: jest.fn(),
    getTabelasPrestacoesDeContas: jest.fn(),
    getReceberPrestacaoDeContas: jest.fn(),
    getReabrirPrestacaoDeContas: jest.fn(),
    getDesfazerRecebimento: jest.fn(),
    getAnalisarPrestacaoDeContas: jest.fn(),
    getDesfazerAnalise: jest.fn(),
    getSalvarAnalise: jest.fn(),
    getInfoAta: jest.fn(),
    getConcluirAnalise: jest.fn(),
    getDespesasPorFiltros: jest.fn(),
    getTiposDevolucao: jest.fn(),
    patchReceberAposAcertos: jest.fn(),
}));

jest.mock('../../../../../services/escolas/Despesas.service', () => ({
    getDespesa: jest.fn(),
    getDespesasTabelas: jest.fn(),
}));

jest.mock('../../../../../services/sme/Parametrizacoes.service', () => ({
    getPeriodoPorUuid: jest.fn(),
}));

jest.mock('../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const mockUseParams = jest.fn();
let mockCapturedNavigateProps = [];

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => mockUseParams(),
    Navigate: (props) => {
        mockCapturedNavigateProps.push(props);
        return <div data-testid="navigate-mock" />;
    },
}));

let mockCapturedComportamentoProps = null;
jest.mock('../GetComportamentoPorStatus', () => ({
    GetComportamentoPorStatus: (props) => {
        mockCapturedComportamentoProps = props;
        return <div data-testid="get-comportamento-por-status">{props.prestacaoDeContas?.status}</div>;
    },
}));

let mockCapturedReabrirPc = {};
jest.mock('../../ModalReabrirPC', () => ({
    ModalReabrirPc: (props) => {
        mockCapturedReabrirPc = props;
        return props.show ? (
            <div data-testid="modal-reabrir">
                <button data-testid="modal-reabrir-confirmar" onClick={props.onReabrirTrue}>confirmar</button>
                <button data-testid="modal-reabrir-fechar" onClick={props.handleClose}>fechar</button>
            </div>
        ) : null;
    },
}));

let mockCapturedErroPosterior = {};
jest.mock('../../ModalErroPrestacaoDeContasPosterior', () => ({
    ModalErroPrestacaoDeContasPosterior: (props) => {
        mockCapturedErroPosterior = props;
        return props.show ? (
            <div data-testid="modal-erro-posterior">
                <span data-testid="modal-erro-posterior-titulo">{props.titulo}</span>
                <span data-testid="modal-erro-posterior-texto">{props.texto}</span>
                <button data-testid="modal-erro-posterior-fechar" onClick={props.handleClose}>fechar</button>
            </div>
        ) : null;
    },
}));

let mockCapturedNaoRecebida = {};
jest.mock('../../ModalNaoRecebida', () => ({
    ModalNaoRecebida: (props) => {
        mockCapturedNaoRecebida = props;
        return props.show ? (
            <div data-testid="modal-nao-recebida">
                <button data-testid="modal-nao-recebida-confirmar" onClick={props.onReabrirTrue}>confirmar</button>
                <button data-testid="modal-nao-recebida-fechar" onClick={props.handleClose}>fechar</button>
            </div>
        ) : null;
    },
}));

let mockCapturedRecebida = {};
jest.mock('../../ModalRecebida', () => ({
    ModalRecebida: (props) => {
        mockCapturedRecebida = props;
        return props.show ? (
            <div data-testid="modal-recebida">
                <button data-testid="modal-recebida-confirmar" onClick={props.onReabrirTrue}>confirmar</button>
                <button data-testid="modal-recebida-fechar" onClick={props.handleClose}>fechar</button>
            </div>
        ) : null;
    },
}));

let mockCapturedConcluirAnalise = {};
jest.mock('../../ModalConcluirAnalise', () => ({
    ModalConcluirAnalise: (props) => {
        mockCapturedConcluirAnalise = props;
        return props.show ? (
            <div data-testid="modal-concluir-analise">
                <button data-testid="modal-concluir-analise-confirmar" onClick={props.onConcluirAnalise}>confirmar</button>
                <button data-testid="modal-concluir-analise-fechar" onClick={props.handleClose}>fechar</button>
            </div>
        ) : null;
    },
}));

let mockCapturedVoltarParaAnalise = {};
jest.mock('../../ModalVoltarParaAnalise', () => ({
    ModalVoltarParaAnalise: (props) => {
        mockCapturedVoltarParaAnalise = props;
        return props.show ? (
            <div data-testid="modal-voltar-para-analise">
                <button data-testid="modal-voltar-para-analise-confirmar" onClick={props.onVoltarParaAnalise}>confirmar</button>
                <button data-testid="modal-voltar-para-analise-fechar" onClick={props.handleClose}>fechar</button>
            </div>
        ) : null;
    },
}));

let mockCapturedNaoPodeVoltar = {};
jest.mock('../../ModalNaoPodeVoltarParaAnalise', () => ({
    ModalNaoPodeVoltarParaAnalise: (props) => {
        mockCapturedNaoPodeVoltar = props;
        return props.show ? (
            <div data-testid="modal-nao-pode-voltar">
                <span data-testid="modal-nao-pode-voltar-texto">{props.texto}</span>
                <button data-testid="modal-nao-pode-voltar-fechar" onClick={props.handleClose}>fechar</button>
            </div>
        ) : null;
    },
}));

let mockCapturedDeleteAjuste = {};
jest.mock('../../ModalDeleteAjusteSaldoPC', () => ({
    ModalDeleteAjusteSaldoPC: (props) => {
        mockCapturedDeleteAjuste = props;
        return props.show ? (
            <div data-testid="modal-delete-ajuste">
                <button data-testid="modal-delete-ajuste-confirmar" onClick={props.onDeletarAjustePcTrue}>confirmar</button>
                <button data-testid="modal-delete-ajuste-fechar" onClick={props.handleClose}>fechar</button>
            </div>
        ) : null;
    },
}));

let mockCapturedSalvarAnalise = {};
jest.mock('../../../../../utils/Modais', () => ({
    ModalSalvarPrestacaoDeContasAnalise: (props) => {
        mockCapturedSalvarAnalise = props;
        return props.show ? <div data-testid="modal-salvar-analise" /> : null;
    },
}));

let mockCapturedModalAviso = {};
jest.mock('../../../../Globais/ModalAntDesign/modalAviso', () => ({
    ModalAntDesignAviso: (props) => {
        mockCapturedModalAviso = props;
        return props.open ? (
            <div data-testid="modal-aviso-bloqueio">
                <span data-testid="modal-aviso-bloqueio-texto">{props.bodyText}</span>
                <button data-testid="modal-aviso-bloqueio-fechar" onClick={props.handleCancel}>{props.cancelText}</button>
            </div>
        ) : null;
    },
}));

let mockCapturedModalSei = {};
jest.mock('../../../../Globais/ModalAntDesign/modalAlterarSEI', () => ({
    ModalAlterarSEI: (props) => {
        mockCapturedModalSei = props;
        return props.show ? (
            <div data-testid="modal-alterar-sei">
                <button data-testid="modal-alterar-sei-cancelar" onClick={props.primeiroBotaoOnClick}>{props.primeiroBotaoTexto}</button>
            </div>
        ) : null;
    },
}));

const mockSidebarContext = {
    setIrParaUrl: jest.fn().mockResolvedValue(undefined),
    setSideBarStatus: jest.fn(),
    sideBarStatus: true,
    irParaUrl: true,
};

const mockNotificacaoContext = {
    setShow: jest.fn(),
    setExibeModalTemDevolucao: jest.fn(),
    setExibeMensagemFixaTemDevolucao: jest.fn(),
};

const basePrestacao = {
    uuid: 'pc-1',
    status: 'NAO_RECEBIDA',
    processo_sei: '',
    periodo_uuid: 'periodo-1',
    associacao: { uuid: 'assoc-1' },
    tecnico_responsavel: null,
    data_recebimento: '',
    data_ultima_analise: '',
    devolucao_ao_tesouro: 'Não',
    devolucoes_ao_tesouro_da_prestacao: [],
    analises_de_conta_da_prestacao: [],
    publicada: false,
    em_retificacao: false,
};

const renderComponent = () =>
    render(
        <MemoryRouter>
            <SidebarContext.Provider value={mockSidebarContext}>
                <NotificacaoContext.Provider value={mockNotificacaoContext}>
                    <DetalhePrestacaoDeContas />
                </NotificacaoContext.Provider>
            </SidebarContext.Provider>
        </MemoryRouter>
    );

const waitForCarregado = () =>
    waitFor(() => {
        expect(screen.getByTestId('get-comportamento-por-status')).toBeInTheDocument();
    });

// Espera a cadeia de efeitos prestacaoDeContas -> infoAta -> infoAtaPorConta terminar,
// necessária para handlers que dependem de infoAtaPorConta.conta_associacao.uuid.
const waitForAtaCarregada = () =>
    waitFor(() => {
        expect(mockCapturedComportamentoProps.infoAtaPorConta?.conta_associacao).toBeDefined();
    });

describe('DetalhePrestacaoDeContas', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.scrollTo = jest.fn();
        Element.prototype.scrollIntoView = jest.fn();
        mockCapturedComportamentoProps = null;
        mockCapturedNavigateProps = [];
        mockCapturedReabrirPc = {};
        mockCapturedErroPosterior = {};
        mockCapturedNaoRecebida = {};
        mockCapturedRecebida = {};
        mockCapturedConcluirAnalise = {};
        mockCapturedVoltarParaAnalise = {};
        mockCapturedNaoPodeVoltar = {};
        mockCapturedDeleteAjuste = {};
        mockCapturedSalvarAnalise = {};
        mockCapturedModalAviso = {};
        mockCapturedModalSei = {};

        mockUseParams.mockReturnValue({ prestacao_conta_uuid: 'pc-1' });
        getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao });
        getTabelasPrestacoesDeContas.mockResolvedValue({});
        getInfoAta.mockResolvedValue({});
        getDespesasTabelas.mockResolvedValue([]);
        getTiposDevolucao.mockResolvedValue([]);
        getMotivosAprovadoComRessalva.mockResolvedValue([]);
        getMotivosReprovacao.mockResolvedValue([]);
        getPeriodoPorUuid.mockResolvedValue({ referencia: '2024.1', data_inicio_realizacao_despesas: '2024-01-01' });
        getStatusPeriodo.mockResolvedValue({ tem_conta_encerrada_com_saldo: false, tipos_das_contas_encerradas_com_saldo: [] });
        getReceberPrestacaoDeContas.mockResolvedValue({});
        getReabrirPrestacaoDeContas.mockResolvedValue({});
        getDesfazerRecebimento.mockResolvedValue({});
        getAnalisarPrestacaoDeContas.mockResolvedValue({});
        getDesfazerAnalise.mockResolvedValue({});
        getDesfazerConclusaoAnalise.mockResolvedValue({});
        getConcluirAnalise.mockResolvedValue({});
        getUltimaAnalisePc.mockResolvedValue({ uuid: 'analise-1' });
        getAnaliseAjustesSaldoPorConta.mockResolvedValue([]);
        postAnaliseAjustesSaldoPorConta.mockResolvedValue({});
        deleteAnaliseAjustesSaldoPorConta.mockResolvedValue({});
        patchReceberAposAcertos.mockResolvedValue({});
        patchDesfazerReceberAposAcertos.mockResolvedValue({});
        getDespesa.mockResolvedValue({ uuid: 'despesa-1' });
        getDespesasPorFiltros.mockResolvedValue({ results: [] });
    });

    it('redireciona para a lista quando não há prestacao_conta_uuid', () => {
        mockUseParams.mockReturnValue({});

        renderComponent();

        expect(screen.getByTestId('navigate-mock')).toBeInTheDocument();
        expect(mockCapturedNavigateProps[0].to.pathname).toBe('/dre-lista-prestacao-de-contas/');
    });

    it('exibe o Loading enquanto a prestação de contas ainda está sendo carregada', async () => {
        getPrestacaoDeContasDetalhe.mockImplementation(() => new Promise(() => {}));

        renderComponent();

        expect(await screen.findByText('Carregando...')).toBeInTheDocument();
    });

    it('carrega a prestação de contas e renderiza GetComportamentoPorStatus com o status carregado', async () => {
        renderComponent();

        await waitForCarregado();

        expect(screen.getByTestId('get-comportamento-por-status')).toHaveTextContent('NAO_RECEBIDA');
        expect(mockCapturedComportamentoProps.tabelaPrestacoes).toEqual({});
    });

    it('não renderiza GetComportamentoPorStatus quando a prestação carregada não possui status', async () => {
        getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao, status: undefined });

        renderComponent();

        await waitFor(() => {
            expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
        });

        expect(screen.queryByTestId('get-comportamento-por-status')).not.toBeInTheDocument();
    });

    it('rola até o elemento indicado pela hash da URL', async () => {
        document.body.insertAdjacentHTML('beforeend', '<div id="secao-x"></div>');
        window.location.hash = '#secao-x';

        render(
            <MemoryRouter initialEntries={['/detalhe#secao-x']}>
                <SidebarContext.Provider value={mockSidebarContext}>
                    <NotificacaoContext.Provider value={mockNotificacaoContext}>
                        <DetalhePrestacaoDeContas />
                    </NotificacaoContext.Provider>
                </SidebarContext.Provider>
            </MemoryRouter>
        );

        await waitForCarregado();

        await waitFor(() => {
            expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
        });
    });

    describe('recebimento da prestação de contas', () => {
        it('recebe diretamente quando o processo SEI não foi alterado', async () => {
            renderComponent();
            await waitForCarregado();

            await act(async () => {
                await mockCapturedComportamentoProps.verificaDadosParaRecebimentoDePrestacaoDeContas();
            });

            expect(getReceberPrestacaoDeContas).toHaveBeenCalledWith('pc-1', expect.objectContaining({ acao_processo_sei: null }));
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
        });

        it('inclui o processo SEI quando estava vazio e foi preenchido', async () => {
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.handleChangeFormInformacoesPrestacaoDeContas('processo_sei', '123');
            });

            await act(async () => {
                await mockCapturedComportamentoProps.verificaDadosParaRecebimentoDePrestacaoDeContas();
            });

            expect(getReceberPrestacaoDeContas).toHaveBeenCalledWith('pc-1', expect.objectContaining({ acao_processo_sei: 'incluir' }));
        });

        it('abre o modal de alteração de SEI quando o processo já preenchido é alterado para outro valor', async () => {
            getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao, processo_sei: 'ABC' });
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.handleChangeFormInformacoesPrestacaoDeContas('processo_sei', 'XYZ');
            });

            act(() => {
                mockCapturedComportamentoProps.verificaDadosParaRecebimentoDePrestacaoDeContas();
            });

            expect(screen.getByTestId('modal-alterar-sei')).toBeInTheDocument();
            expect(getReceberPrestacaoDeContas).not.toHaveBeenCalled();

            await act(async () => {
                await mockCapturedModalSei.receberPrestacaoDeContas('incluir');
            });
            expect(getReceberPrestacaoDeContas).toHaveBeenCalledWith('pc-1', expect.objectContaining({ acao_processo_sei: 'incluir' }));

            act(() => {
                mockCapturedModalSei.primeiroBotaoOnClick();
            });
            expect(screen.queryByTestId('modal-alterar-sei')).not.toBeInTheDocument();
        });
    });

    describe('reabrir prestação de contas', () => {
        it('reabre com sucesso e redireciona para a lista', async () => {
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.setShowReabrirPc(true);
            });
            expect(screen.getByTestId('modal-reabrir')).toBeInTheDocument();

            await act(async () => {
                screen.getByTestId('modal-reabrir-confirmar').click();
            });

            expect(getReabrirPrestacaoDeContas).toHaveBeenCalledWith('pc-1');
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
            expect(mockCapturedNavigateProps.some((p) => p.to?.pathname === '/dre-lista-prestacao-de-contas/periodo-1/NAO_RECEBIDA')).toBe(true);
        });

        it('exibe modal de erro quando a API recusa a reabertura', async () => {
            getReabrirPrestacaoDeContas.mockRejectedValue({ response: { data: { mensagem: 'Não é possível reabrir.' } } });
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.setShowReabrirPc(true);
            });

            await act(async () => {
                screen.getByTestId('modal-reabrir-confirmar').click();
            });

            expect(screen.getByTestId('modal-erro-posterior-titulo')).toHaveTextContent('Reabrir período de Prestação de Contas');
            expect(screen.getByTestId('modal-erro-posterior-texto')).toHaveTextContent('Não é possível reabrir.');
        });

        it('não exibe modal de erro quando a falha não possui mensagem', async () => {
            getReabrirPrestacaoDeContas.mockRejectedValue(new Error('falha sem response'));
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.setShowReabrirPc(true);
            });

            await act(async () => {
                screen.getByTestId('modal-reabrir-confirmar').click();
            });

            expect(screen.queryByTestId('modal-erro-posterior')).not.toBeInTheDocument();
        });

        it('fechar qualquer modal via onHandleClose fecha todos os modais controlados por ele', async () => {
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.setShowReabrirPc(true);
                mockCapturedComportamentoProps.setShowNaoRecebida(true);
            });
            expect(screen.getByTestId('modal-reabrir')).toBeInTheDocument();
            expect(screen.getByTestId('modal-nao-recebida')).toBeInTheDocument();

            act(() => {
                screen.getByTestId('modal-reabrir-fechar').click();
            });

            expect(screen.queryByTestId('modal-reabrir')).not.toBeInTheDocument();
            expect(screen.queryByTestId('modal-nao-recebida')).not.toBeInTheDocument();
        });
    });

    describe('mudanças diretas de status', () => {
        it('desfaz o recebimento (Não recebida)', async () => {
            renderComponent();
            await waitForCarregado();

            act(() => { mockCapturedComportamentoProps.setShowNaoRecebida(true); });
            await act(async () => { screen.getByTestId('modal-nao-recebida-confirmar').click(); });

            expect(getDesfazerRecebimento).toHaveBeenCalledWith('pc-1');
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
        });

        it('desfaz a análise (Recebida)', async () => {
            renderComponent();
            await waitForCarregado();

            act(() => { mockCapturedComportamentoProps.setShowRecebida(true); });
            await act(async () => { screen.getByTestId('modal-recebida-confirmar').click(); });

            expect(getDesfazerAnalise).toHaveBeenCalledWith('pc-1');
        });

        it('analisa a prestação de contas', async () => {
            renderComponent();
            await waitForCarregado();

            await act(async () => {
                await mockCapturedComportamentoProps.analisarPrestacaoDeContas();
            });

            expect(getAnalisarPrestacaoDeContas).toHaveBeenCalledWith('pc-1');
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
        });
    });

    describe('voltar para análise', () => {
        it('exibe aviso de bloqueio quando a PC já está publicada', async () => {
            getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao, status: 'APROVADA', publicada: true });
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.setShowVoltarParaAnalise();
            });

            expect(screen.getByTestId('modal-nao-pode-voltar')).toBeInTheDocument();
        });

        it('permite voltar para análise quando a PC não está publicada', async () => {
            getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao, status: 'APROVADA', publicada: false });
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.setShowVoltarParaAnalise();
            });
            expect(screen.getByTestId('modal-voltar-para-analise')).toBeInTheDocument();

            await act(async () => {
                screen.getByTestId('modal-voltar-para-analise-confirmar').click();
            });

            expect(getDesfazerConclusaoAnalise).toHaveBeenCalledWith('pc-1');
        });
    });

    describe('conclusão da análise', () => {
        it('conclui como APROVADA sem devolução ao tesouro', async () => {
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.setShowConcluirAnalise(true);
                mockCapturedConcluirAnalise.handleChangeConcluirAnalise('status', 'APROVADA');
            });

            await act(async () => {
                screen.getByTestId('modal-concluir-analise-confirmar').click();
            });

            expect(getConcluirAnalise).toHaveBeenCalledWith('pc-1', expect.objectContaining({ resultado_analise: 'APROVADA' }));
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
        });

        it('conclui como APROVADA_RESSALVA enviando os motivos selecionados', async () => {
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.setShowConcluirAnalise(true);
                mockCapturedConcluirAnalise.setMotivos([{ uuid: 'motivo-1' }]);
                mockCapturedConcluirAnalise.handleChangeConcluirAnalise('status', 'APROVADA_RESSALVA');
            });

            await act(async () => {
                screen.getByTestId('modal-concluir-analise-confirmar').click();
            });

            expect(getConcluirAnalise).toHaveBeenCalledWith(
                'pc-1',
                expect.objectContaining({ resultado_analise: 'APROVADA_RESSALVA', motivos_aprovacao_ressalva: ['motivo-1'] })
            );
        });

        it('conclui como REPROVADA enviando os motivos de reprovação selecionados', async () => {
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.setShowConcluirAnalise(true);
                mockCapturedConcluirAnalise.setSelectMotivosReprovacao([{ uuid: 'motivo-reprovacao-1' }]);
                mockCapturedConcluirAnalise.handleChangeConcluirAnalise('status', 'REPROVADA');
            });

            await act(async () => {
                screen.getByTestId('modal-concluir-analise-confirmar').click();
            });

            expect(getConcluirAnalise).toHaveBeenCalledWith(
                'pc-1',
                expect.objectContaining({ resultado_analise: 'REPROVADA', motivos_reprovacao: ['motivo-reprovacao-1'] })
            );
        });

        it('bloqueia o envio e seta erros no formulário quando a devolução ao tesouro tem campos obrigatórios faltando', async () => {
            getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao, devolucao_ao_tesouro: 'Sim' });
            renderComponent();
            await waitForCarregado();

            const setErrors = jest.fn();
            act(() => {
                mockCapturedComportamentoProps.formRef.current = {
                    values: {
                        devolucoes_ao_tesouro_da_prestacao: [
                            { despesa: '', devolucao_total: '', tipo: '', valor: '', data: '' },
                        ],
                    },
                    setErrors,
                };
                mockCapturedComportamentoProps.setShowConcluirAnalise(true);
                mockCapturedConcluirAnalise.handleChangeConcluirAnalise('status', 'APROVADA');
            });

            await act(async () => {
                screen.getByTestId('modal-concluir-analise-confirmar').click();
            });

            expect(getConcluirAnalise).not.toHaveBeenCalled();
            expect(setErrors).toHaveBeenCalled();
        });

        it('trata a devolução ao tesouro e conclui com sucesso quando os campos obrigatórios estão preenchidos', async () => {
            getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao, devolucao_ao_tesouro: 'Sim' });
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.formRef.current = {
                    values: {
                        devolucoes_ao_tesouro_da_prestacao: [
                            {
                                busca_por_cpf_cnpj: '123',
                                busca_por_tipo_documento: 'CPF',
                                busca_por_numero_documento: '456',
                                despesa: 'despesa-1',
                                devolucao_total: 'true',
                                tipo: 'tipo-1',
                                valor: 'R$ 10,00',
                                data: '2024-01-10',
                            },
                        ],
                    },
                    setErrors: jest.fn(),
                };
                mockCapturedComportamentoProps.setShowConcluirAnalise(true);
                mockCapturedConcluirAnalise.handleChangeConcluirAnalise('status', 'APROVADA');
            });

            await act(async () => {
                screen.getByTestId('modal-concluir-analise-confirmar').click();
            });

            expect(getConcluirAnalise).toHaveBeenCalledWith(
                'pc-1',
                expect.objectContaining({
                    devolucao_tesouro: true,
                    devolucoes_ao_tesouro_da_prestacao: [
                        expect.objectContaining({ devolucao_total: true, data: '2024-01-10' }),
                    ],
                })
            );
        });

        it('exibe modal de erro quando a conclusão da análise falha', async () => {
            getConcluirAnalise.mockRejectedValue({ response: { data: { mensagem: 'Erro ao concluir.' } } });
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.setShowConcluirAnalise(true);
                mockCapturedConcluirAnalise.handleChangeConcluirAnalise('status', 'APROVADA');
            });

            await act(async () => {
                screen.getByTestId('modal-concluir-analise-confirmar').click();
            });

            expect(screen.getByTestId('modal-erro-posterior-titulo')).toHaveTextContent('Conclusão da análise da Prestação de Contas');
            expect(screen.getByTestId('modal-erro-posterior-texto')).toHaveTextContent('Erro ao concluir.');
        });
    });

    describe('ajustes de saldo por conta', () => {
        const infoAtaComConta = {
            contas: [{ conta_associacao: { uuid: 'conta-1', nome: 'Conta A' } }],
        };

        it('adiciona um ajuste de saldo para a conta e não duplica em uma segunda chamada', async () => {
            getInfoAta.mockResolvedValue(infoAtaComConta);
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.onClickAdicionarAcertoSaldo({ uuid: 'conta-1' });
            });
            expect(mockCapturedComportamentoProps.analisesDeContaDaPrestacao).toHaveLength(1);

            act(() => {
                mockCapturedComportamentoProps.onClickAdicionarAcertoSaldo({ uuid: 'conta-1' });
            });
            expect(mockCapturedComportamentoProps.analisesDeContaDaPrestacao).toHaveLength(1);
        });

        it('salva o ajuste de saldo usando a análise atual quando ela existe', async () => {
            getInfoAta.mockResolvedValue(infoAtaComConta);
            getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao, analise_atual: { uuid: 'analise-atual-1' } });
            getAnaliseAjustesSaldoPorConta.mockResolvedValue([{
                uuid: 'analise-salva-1',
                conta_associacao: { uuid: 'conta-1' },
                saldo_extrato: 10,
                observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: null,
            }]);
            renderComponent();
            await waitForCarregado();
            await waitForAtaCarregada();

            await act(async () => {
                await mockCapturedComportamentoProps.onClickSalvarAcertoSaldo(
                    { uuid: 'conta-1' },
                    {
                        data_extrato: '2024-01-05',
                        saldo_extrato: 'R$ 10,00',
                        solicitar_envio_do_comprovante_do_saldo_da_conta: true,
                        solicitar_correcao_da_data_do_saldo_da_conta: false,
                        observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: 'obs',
                        solicitar_correcao_de_justificativa_de_conciliacao: true,
                    },
                    0
                );
            });

            expect(getUltimaAnalisePc).not.toHaveBeenCalled();
            expect(postAnaliseAjustesSaldoPorConta).toHaveBeenCalledWith(
                expect.objectContaining({ analise_prestacao_conta: 'analise-atual-1', conta_associacao: 'conta-1' })
            );
        });

        it('busca a última análise quando não há análise atual', async () => {
            getInfoAta.mockResolvedValue(infoAtaComConta);
            getAnaliseAjustesSaldoPorConta.mockResolvedValue([{
                uuid: 'analise-salva-2',
                conta_associacao: { uuid: 'conta-1' },
                saldo_extrato: 10,
                observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: null,
            }]);
            renderComponent();
            await waitForCarregado();
            await waitForAtaCarregada();

            await act(async () => {
                await mockCapturedComportamentoProps.onClickSalvarAcertoSaldo({ uuid: 'conta-1' }, null, 0);
            });

            expect(getUltimaAnalisePc).toHaveBeenCalledWith('pc-1');
            expect(postAnaliseAjustesSaldoPorConta).toHaveBeenCalledWith(
                expect.objectContaining({ analise_prestacao_conta: 'analise-1' })
            );
        });

        it('trata erro ao salvar o ajuste de saldo', async () => {
            getInfoAta.mockResolvedValue(infoAtaComConta);
            postAnaliseAjustesSaldoPorConta.mockRejectedValue(new Error('falha ao salvar'));
            renderComponent();
            await waitForCarregado();

            await act(async () => {
                await mockCapturedComportamentoProps.onClickSalvarAcertoSaldo({ uuid: 'conta-1' }, null, 0);
            });

            expect(mockCapturedComportamentoProps.ajusteSaldoSalvoComSucesso).toEqual({ 0: false });
        });

        it('exclui um ajuste de saldo existente', async () => {
            getInfoAta.mockResolvedValue(infoAtaComConta);
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.onClickAdicionarAcertoSaldo({ uuid: 'conta-1' });
                mockCapturedComportamentoProps.onClickDeletarAcertoSaldo();
            });
            expect(screen.getByTestId('modal-delete-ajuste')).toBeInTheDocument();

            await act(async () => {
                screen.getByTestId('modal-delete-ajuste-confirmar').click();
            });

            expect(deleteAnaliseAjustesSaldoPorConta).toHaveBeenCalled();
            expect(mockCapturedComportamentoProps.analisesDeContaDaPrestacao).toHaveLength(0);
        });

        it('descarta um ajuste de saldo em edição', async () => {
            getInfoAta.mockResolvedValue(infoAtaComConta);
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.onClickAdicionarAcertoSaldo({ uuid: 'conta-1' });
            });

            act(() => {
                mockCapturedComportamentoProps.onClickDescartarAcerto();
            });

            expect(mockCapturedComportamentoProps.analisesDeContaDaPrestacao).toHaveLength(0);
            expect(mockCapturedComportamentoProps.adicaoAjusteSaldo).toBe(false);
        });

        it('valida datas de ajuste de saldo (iguais, diferentes e sem data no DRE)', async () => {
            getInfoAta.mockResolvedValue(infoAtaComConta);
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.validaAjustesSaldo(
                    { data_extrato: '10-01-2024 10:00:00' }, 0, { data_extrato: '2024-01-10 10:00:00' }, 'data'
                );
            });
            expect(mockCapturedComportamentoProps.formErrosAjusteSaldo[0].data).toBe('Mesma data que UE');

            act(() => {
                mockCapturedComportamentoProps.validaAjustesSaldo(
                    { data_extrato: '11-01-2024 10:00:00' }, 0, { data_extrato: '2024-01-10 10:00:00' }, 'data'
                );
            });
            expect(mockCapturedComportamentoProps.formErrosAjusteSaldo[0].data).toBeNull();

            act(() => {
                mockCapturedComportamentoProps.validaAjustesSaldo({}, 0, { data_extrato: null }, 'data');
            });
            expect(mockCapturedComportamentoProps.formErrosAjusteSaldo[0].data).toBeNull();
        });

        it('valida saldos de ajuste (iguais, diferentes e sem saldo no DRE)', async () => {
            getInfoAta.mockResolvedValue(infoAtaComConta);
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.validaAjustesSaldo(
                    { saldo_extrato: 'R$ 10,00' }, 0, { saldo_extrato: 'R$ 10,00' }, 'saldo'
                );
            });
            expect(mockCapturedComportamentoProps.formErrosAjusteSaldo[0].saldo).toBe('Mesmo saldo que UE');

            act(() => {
                mockCapturedComportamentoProps.validaAjustesSaldo(
                    { saldo_extrato: 'R$ 20,00' }, 0, { saldo_extrato: 'R$ 10,00' }, 'saldo'
                );
            });
            expect(mockCapturedComportamentoProps.formErrosAjusteSaldo[0].saldo).toBeNull();

            act(() => {
                mockCapturedComportamentoProps.validaAjustesSaldo({}, 0, { saldo_extrato: null }, 'saldo');
            });
            expect(mockCapturedComportamentoProps.formErrosAjusteSaldo[0].saldo).toBeNull();
        });

        it('handleOnKeyDownAjusteSaldo limpa o saldo ao apagar um valor zerado', async () => {
            getInfoAta.mockResolvedValue(infoAtaComConta);
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.onClickAdicionarAcertoSaldo({ uuid: 'conta-1' });
            });

            act(() => {
                mockCapturedComportamentoProps.handleOnKeyDownAjusteSaldo({ keyCode: 8 }, 'R$0,00');
            });
            expect(mockCapturedComportamentoProps.analisesDeContaDaPrestacao[0].saldo_extrato).toBeNull();

            // tecla diferente de backspace: não altera nada, apenas garante que não quebra
            act(() => {
                mockCapturedComportamentoProps.handleOnKeyDownAjusteSaldo({ keyCode: 65 }, 'R$10,00');
            });

            // saldo falsy: função não faz nada
            act(() => {
                mockCapturedComportamentoProps.handleOnKeyDownAjusteSaldo({ keyCode: 8 }, null);
            });
        });
    });

    describe('exibição da ata por conta', () => {
        const infoAtaDuasContas = {
            contas: [
                { conta_associacao: { uuid: 'conta-1', nome: 'Conta A' } },
                { conta_associacao: { uuid: 'conta-2', nome: 'Conta B' } },
            ],
        };

        it('busca a análise de ajuste da conta quando ainda não há nenhuma carregada', async () => {
            getInfoAta.mockResolvedValue(infoAtaDuasContas);
            getAnaliseAjustesSaldoPorConta.mockResolvedValue([{
                uuid: 'analise-x',
                conta_associacao: { uuid: 'conta-2' },
                saldo_extrato: 10,
                observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: null,
            }]);
            renderComponent();
            await waitForCarregado();
            await waitForAtaCarregada();

            await act(async () => {
                await mockCapturedComportamentoProps.exibeAtaPorConta('Conta B');
            });

            expect(getAnaliseAjustesSaldoPorConta).toHaveBeenCalledWith('conta-2', 'pc-1', 'analise-1');
            expect(mockCapturedComportamentoProps.analisesDeContaDaPrestacao).toHaveLength(1);
        });

        it('não busca novamente quando já existem análises carregadas', async () => {
            getInfoAta.mockResolvedValue(infoAtaDuasContas);
            renderComponent();
            await waitForCarregado();
            await waitForAtaCarregada();

            act(() => {
                mockCapturedComportamentoProps.onClickAdicionarAcertoSaldo({ uuid: 'conta-1' });
            });

            getAnaliseAjustesSaldoPorConta.mockClear();

            await act(async () => {
                await mockCapturedComportamentoProps.exibeAtaPorConta('Conta B');
            });

            expect(getAnaliseAjustesSaldoPorConta).not.toHaveBeenCalled();
        });

        it('não adiciona nada quando a análise da conta não é encontrada', async () => {
            getInfoAta.mockResolvedValue(infoAtaDuasContas);
            getAnaliseAjustesSaldoPorConta.mockResolvedValue([]);
            renderComponent();
            await waitForCarregado();
            await waitForAtaCarregada();

            await act(async () => {
                await mockCapturedComportamentoProps.exibeAtaPorConta('Conta B');
            });

            expect(mockCapturedComportamentoProps.analisesDeContaDaPrestacao).toHaveLength(0);
        });
    });

    describe('recebimento / desfazimento após acertos', () => {
        it('recebe após acertos com sucesso', async () => {
            renderComponent();
            await waitForCarregado();

            await act(async () => {
                await mockCapturedComportamentoProps.receberAposAcertos({ uuid: 'pc-1' });
            });

            expect(patchReceberAposAcertos).toHaveBeenCalledWith('pc-1', expect.objectContaining({ data_recebimento_apos_acertos: expect.any(String) }));
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
        });

        it('trata erro ao receber após acertos', async () => {
            patchReceberAposAcertos.mockRejectedValue(new Error('falhou'));
            renderComponent();
            await waitForCarregado();

            await act(async () => {
                await mockCapturedComportamentoProps.receberAposAcertos({ uuid: 'pc-1' });
            });

            expect(getPrestacaoDeContasDetalhe).toHaveBeenCalled();
        });

        it('desfaz o recebimento após acertos com sucesso', async () => {
            renderComponent();
            await waitForCarregado();

            await act(async () => {
                await mockCapturedComportamentoProps.desfazerReceberAposAcertos({ uuid: 'pc-1' });
            });

            expect(patchDesfazerReceberAposAcertos).toHaveBeenCalledWith('pc-1');
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
        });

        it('trata erro ao desfazer recebimento após acertos', async () => {
            patchDesfazerReceberAposAcertos.mockRejectedValue(new Error('falhou'));
            renderComponent();
            await waitForCarregado();

            await act(async () => {
                await mockCapturedComportamentoProps.desfazerReceberAposAcertos({ uuid: 'pc-1' });
            });

            expect(getPrestacaoDeContasDetalhe).toHaveBeenCalled();
        });
    });

    describe('busca de despesas para devolução ao tesouro', () => {
        it('carrega a despesa vinculada a uma devolução existente ao carregar a PC', async () => {
            getPrestacaoDeContasDetalhe.mockResolvedValue({
                ...basePrestacao,
                devolucoes_ao_tesouro_da_prestacao: [
                    {
                        despesa: { uuid: 'despesa-1' },
                        tipo: { uuid: 'tipo-1' },
                        data: '2024-01-01',
                        devolucao_total: true,
                        valor: 10,
                        motivo: 'motivo x',
                        visao_criacao: 'DRE',
                    },
                ],
            });
            renderComponent();
            await waitForCarregado();

            await waitFor(() => {
                expect(getDespesa).toHaveBeenCalledWith('despesa-1');
            });
            expect(mockCapturedComportamentoProps.initialFormDevolucaoAoTesouro.devolucoes_ao_tesouro_da_prestacao).toHaveLength(1);
        });

        it('busca despesas por filtros quando o formulário está preenchido', async () => {
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.formRef.current = {
                    values: {
                        devolucoes_ao_tesouro_da_prestacao: [
                            { busca_por_cpf_cnpj: '123', busca_por_tipo_documento: 'CPF', busca_por_numero_documento: '' },
                        ],
                    },
                };
            });

            await act(async () => {
                await mockCapturedComportamentoProps.buscaDespesaPorFiltros(0);
            });

            expect(getDespesasPorFiltros).toHaveBeenCalledWith('assoc-1', '123', 'CPF', '');
            expect(mockCapturedComportamentoProps.despesas.devolucao_0).toEqual([]);
        });

        it('não busca despesas por filtros quando não há formRef', async () => {
            renderComponent();
            await waitForCarregado();

            await act(async () => {
                await mockCapturedComportamentoProps.buscaDespesaPorFiltros(0);
            });

            expect(getDespesasPorFiltros).not.toHaveBeenCalled();
        });
    });

    describe('bloqueio de conclusão por conta encerrada com saldo', () => {
        it('exibe o aviso (plural) quando há mais de um tipo de conta encerrada com saldo', async () => {
            getStatusPeriodo.mockResolvedValue({
                tem_conta_encerrada_com_saldo: true,
                tipos_das_contas_encerradas_com_saldo: ['Conta Poupança', 'Conta Corrente'],
            });
            getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao, associacao: { uuid: 'assoc-1' } });
            renderComponent();
            await waitForCarregado();

            await act(async () => {
                await mockCapturedComportamentoProps.handleConcluirPCemAnalise();
            });

            expect(screen.getByTestId('modal-aviso-bloqueio')).toBeInTheDocument();
            expect(screen.getByTestId('modal-aviso-bloqueio-texto').textContent).toContain('as contas');
            expect(screen.queryByTestId('modal-concluir-analise')).not.toBeInTheDocument();

            act(() => {
                mockCapturedModalAviso.handleCancel();
            });
            expect(screen.queryByTestId('modal-aviso-bloqueio')).not.toBeInTheDocument();
        });

        it('exibe o aviso (singular) quando há apenas um tipo de conta encerrada com saldo', async () => {
            getStatusPeriodo.mockResolvedValue({
                tem_conta_encerrada_com_saldo: true,
                tipos_das_contas_encerradas_com_saldo: ['Conta Poupança'],
            });
            renderComponent();
            await waitForCarregado();

            await act(async () => {
                await mockCapturedComportamentoProps.handleConcluirPCemAnalise();
            });

            expect(screen.getByTestId('modal-aviso-bloqueio-texto').textContent).toContain('a conta');
        });

        it('abre o modal de conclusão de análise quando não há conta encerrada com saldo', async () => {
            renderComponent();
            await waitForCarregado();

            await act(async () => {
                await mockCapturedComportamentoProps.handleConcluirPCemAnalise();
            });

            expect(screen.getByTestId('modal-concluir-analise')).toBeInTheDocument();
        });
    });

    describe('tooltips e bloqueios de navegação de status', () => {
        it('bloqueia e adiciona tooltip no botão de retroceder quando a PC está em retificação e RECEBIDA', async () => {
            getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao, status: 'RECEBIDA', em_retificacao: true });
            renderComponent();
            await waitForCarregado();

            expect(mockCapturedComportamentoProps.bloqueiaBtnRetroceder()).toBe(true);
            expect(mockCapturedComportamentoProps.tooltipRetroceder()).toContain('já foi recebida anteriormente');
        });

        it('bloqueia e adiciona tooltip no botão de retroceder quando a PC está em retificação e EM_ANALISE', async () => {
            getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao, status: 'EM_ANALISE', em_retificacao: true });
            renderComponent();
            await waitForCarregado();

            expect(mockCapturedComportamentoProps.bloqueiaBtnRetroceder()).toBe(true);
            expect(mockCapturedComportamentoProps.tooltipRetroceder()).toContain('Não é possível retornar');
        });

        it('não bloqueia nem adiciona tooltip quando a PC não está em retificação', async () => {
            renderComponent();
            await waitForCarregado();

            expect(mockCapturedComportamentoProps.bloqueiaBtnRetroceder()).toBe(false);
            expect(mockCapturedComportamentoProps.tooltipRetroceder()).toBeNull();
        });

        it('adiciona tooltip no botão de avançar quando faltam dados de recebimento', async () => {
            renderComponent();
            await waitForCarregado();

            expect(mockCapturedComportamentoProps.tooltipAvancar()).toContain('necessário informar a data de recebimento');
        });

        it('não adiciona tooltip no botão de avançar quando os dados de recebimento estão completos', async () => {
            getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao, status: 'NAO_RECEBIDA', processo_sei: '123', data_recebimento: '2024-01-01' });
            renderComponent();
            await waitForCarregado();

            expect(mockCapturedComportamentoProps.tooltipAvancar()).toBeNull();
        });
    });

    describe('motivos da conclusão de análise', () => {
        it('atualiza motivos de aprovação com ressalva via seleção múltipla', async () => {
            renderComponent();
            await waitForCarregado();
            act(() => { mockCapturedComportamentoProps.setShowConcluirAnalise(true); });

            act(() => {
                mockCapturedConcluirAnalise.handleChangeSelectMultipleMotivos({
                    target: { selectedOptions: [{ value: 'a' }, { value: 'b' }] },
                });
            });
            expect(mockCapturedConcluirAnalise.motivos).toEqual(['a', 'b']);
        });

        it('atualiza motivos de reprovação via seleção múltipla', async () => {
            renderComponent();
            await waitForCarregado();
            act(() => { mockCapturedComportamentoProps.setShowConcluirAnalise(true); });

            act(() => {
                mockCapturedConcluirAnalise.handleChangeSelectMultipleMotivosReprovacao({
                    target: { selectedOptions: [{ value: 'c' }] },
                });
            });
            expect(mockCapturedConcluirAnalise.selectMotivosReprovacao).toEqual(['c']);
        });

        it('marca e desmarca a checkbox de outros motivos de aprovação com ressalva', async () => {
            renderComponent();
            await waitForCarregado();
            act(() => { mockCapturedComportamentoProps.setShowConcluirAnalise(true); });

            act(() => {
                mockCapturedConcluirAnalise.handleChangeTxtOutrosMotivos({ target: { value: 'outro motivo' } });
                mockCapturedConcluirAnalise.handleChangeCheckBoxOutrosMotivos({ target: { checked: true } });
            });
            expect(mockCapturedConcluirAnalise.checkBoxOutrosMotivos).toBe(true);
            expect(mockCapturedConcluirAnalise.txtOutrosMotivos).toBe('outro motivo');

            act(() => {
                mockCapturedConcluirAnalise.handleChangeCheckBoxOutrosMotivos({ target: { checked: false } });
            });
            expect(mockCapturedConcluirAnalise.checkBoxOutrosMotivos).toBe(false);
            expect(mockCapturedConcluirAnalise.txtOutrosMotivos).toBe('');
        });

        it('atualiza texto de outros motivos de reprovação e recomendações', async () => {
            renderComponent();
            await waitForCarregado();
            act(() => { mockCapturedComportamentoProps.setShowConcluirAnalise(true); });

            act(() => {
                mockCapturedConcluirAnalise.handleChangeTxtOutrosMotivosReprovacao({ target: { value: 'motivo reprovação' } });
                mockCapturedConcluirAnalise.handleChangeTxtRecomendacoes({ target: { value: 'recomendação x' } });
                mockCapturedConcluirAnalise.handleChangeCheckBoxOutrosMotivosReprovacao({ target: { checked: true } });
            });

            expect(mockCapturedConcluirAnalise.txtOutrosMotivosReprovacao).toBe('motivo reprovação');
            expect(mockCapturedConcluirAnalise.txtRecomendacoes).toBe('recomendação x');
            expect(mockCapturedConcluirAnalise.checkBoxOutrosMotivosReprovacao).toBe(true);
        });
    });

    it('fecha o modal de salvar análise', async () => {
        renderComponent();
        await waitForCarregado();

        act(() => {
            mockCapturedComportamentoProps.setLoading(false);
        });

        act(() => {
            mockCapturedSalvarAnalise.handleClose();
        });

        expect(screen.queryByTestId('modal-salvar-analise')).not.toBeInTheDocument();
    });

    describe('coberturas adicionais', () => {
        const infoAtaComConta = {
            contas: [{ conta_associacao: { uuid: 'conta-1', nome: 'Conta A' } }],
        };

        it('alterna o botão de escolha de conta e o botão da tabela de ações', async () => {
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.toggleBtnEscolheConta(1);
            });
            expect(mockCapturedComportamentoProps.clickBtnEscolheConta).toEqual({ 1: true });

            act(() => {
                mockCapturedComportamentoProps.toggleBtnTabelaAcoes('uuid-x');
            });
            expect(mockCapturedComportamentoProps.clickBtnTabelaAcoes).toEqual({ 'uuid-x': true });
        });

        it('atualiza um campo de uma análise de conta existente', async () => {
            getInfoAta.mockResolvedValue(infoAtaComConta);
            renderComponent();
            await waitForCarregado();
            await waitForAtaCarregada();

            act(() => {
                mockCapturedComportamentoProps.onClickAdicionarAcertoSaldo({ uuid: 'conta-1' });
            });

            act(() => {
                mockCapturedComportamentoProps.handleChangeAnalisesDeContaDaPrestacao('saldo_extrato', 'R$ 5,00');
            });

            expect(mockCapturedComportamentoProps.analisesDeContaDaPrestacao[0].saldo_extrato).toBe('R$ 5,00');
        });

        it('desmarca a checkbox de outros motivos de reprovação', async () => {
            renderComponent();
            await waitForCarregado();
            act(() => { mockCapturedComportamentoProps.setShowConcluirAnalise(true); });

            act(() => {
                mockCapturedConcluirAnalise.handleChangeCheckBoxOutrosMotivosReprovacao({ target: { checked: false } });
            });

            // Nota: o código-fonte tem um bug aqui — ao desmarcar, chama
            // setCheckBoxOutrosMotivosReprovacao('') em vez de limpar o texto,
            // sobrescrevendo o próprio estado da checkbox. Este teste documenta o
            // comportamento atual (não corrige o bug).
            expect(mockCapturedConcluirAnalise.checkBoxOutrosMotivosReprovacao).toBe('');
        });

        it('atualiza a data de recebimento da devolutiva', async () => {
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.handleChangedataRecebimentoDevolutiva('data', '2024-02-01');
            });

            expect(mockCapturedComportamentoProps.dataRecebimentoDevolutiva).toBe('2024-02-01');
        });

        it('usa a análise atual (quando existe) ao exibir a ata por conta', async () => {
            getInfoAta.mockResolvedValue({
                contas: [
                    { conta_associacao: { uuid: 'conta-1', nome: 'Conta A' } },
                    { conta_associacao: { uuid: 'conta-2', nome: 'Conta B' } },
                ],
            });
            getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao, analise_atual: { uuid: 'analise-atual-x' } });
            getAnaliseAjustesSaldoPorConta.mockResolvedValue([{
                uuid: 'analise-y',
                conta_associacao: { uuid: 'conta-2' },
                saldo_extrato: null,
                observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: null,
            }]);
            renderComponent();
            await waitForCarregado();
            await waitForAtaCarregada();

            await act(async () => {
                await mockCapturedComportamentoProps.exibeAtaPorConta('Conta B');
            });

            expect(getUltimaAnalisePc).not.toHaveBeenCalled();
            expect(getAnaliseAjustesSaldoPorConta).toHaveBeenCalledWith('conta-2', 'pc-1', 'analise-atual-x');
        });

        it('zera a observação do comprovante quando o envio deixa de ser solicitado', async () => {
            getInfoAta.mockResolvedValue(infoAtaComConta);
            getAnaliseAjustesSaldoPorConta.mockResolvedValue([{
                uuid: 'analise-salva-3',
                conta_associacao: { uuid: 'conta-1' },
                saldo_extrato: 10,
                observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: null,
            }]);
            renderComponent();
            await waitForCarregado();
            await waitForAtaCarregada();

            await act(async () => {
                await mockCapturedComportamentoProps.onClickSalvarAcertoSaldo(
                    { uuid: 'conta-1' },
                    {
                        solicitar_envio_do_comprovante_do_saldo_da_conta: false,
                        observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: 'obs antiga',
                    },
                    0
                );
            });

            expect(postAnaliseAjustesSaldoPorConta).toHaveBeenCalledWith(
                expect.objectContaining({ observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: null })
            );
        });

        it('formata as análises de conta e conclui com sucesso quando há um ajuste de saldo pendente', async () => {
            getInfoAta.mockResolvedValue(infoAtaComConta);
            renderComponent();
            await waitForCarregado();
            await waitForAtaCarregada();

            act(() => {
                mockCapturedComportamentoProps.onClickAdicionarAcertoSaldo({ uuid: 'conta-1' });
                mockCapturedComportamentoProps.handleChangeAnalisesDeContaDaPrestacao('saldo_extrato', 'R$ 15,00');
                mockCapturedComportamentoProps.handleChangeAnalisesDeContaDaPrestacao('data_extrato', '2024-01-20');
                mockCapturedComportamentoProps.setShowConcluirAnalise(true);
                mockCapturedConcluirAnalise.handleChangeConcluirAnalise('status', 'APROVADA');
            });

            await act(async () => {
                screen.getByTestId('modal-concluir-analise-confirmar').click();
            });

            expect(getConcluirAnalise).toHaveBeenCalledWith(
                'pc-1',
                expect.objectContaining({
                    analises_de_conta_da_prestacao: [
                        expect.objectContaining({ data_extrato: '2024-01-20', saldo_extrato: 15 }),
                    ],
                })
            );
        });

        it('exibe modal de erro quando a conclusão falha com devolução ao tesouro válida', async () => {
            getPrestacaoDeContasDetalhe.mockResolvedValue({ ...basePrestacao, devolucao_ao_tesouro: 'Sim' });
            getConcluirAnalise.mockRejectedValue({ response: { data: { mensagem: 'Falhou com devolução.' } } });
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.formRef.current = {
                    values: {
                        devolucoes_ao_tesouro_da_prestacao: [
                            {
                                despesa: 'despesa-1',
                                devolucao_total: 'false',
                                tipo: 'tipo-1',
                                valor: 'R$ 10,00',
                                data: '2024-01-10',
                            },
                        ],
                    },
                    setErrors: jest.fn(),
                };
                mockCapturedComportamentoProps.setShowConcluirAnalise(true);
                mockCapturedConcluirAnalise.handleChangeConcluirAnalise('status', 'APROVADA');
            });

            await act(async () => {
                screen.getByTestId('modal-concluir-analise-confirmar').click();
            });

            expect(screen.getByTestId('modal-erro-posterior-texto')).toHaveTextContent('Falhou com devolução.');
        });

        it('atualiza um campo do formulário de recebimento pela diretoria', async () => {
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedComportamentoProps.handleChangeFormRecebimentoPelaDiretoria('tecnico_atribuido', 'Fulano');
            });

            expect(mockCapturedComportamentoProps.stateFormRecebimentoPelaDiretoria.tecnico_atribuido).toBe('Fulano');
        });

        it('monta a lista de análises de conta a partir da prestação carregada', async () => {
            getInfoAta.mockResolvedValue({
                contas: [{ conta_associacao: { uuid: 'conta-1', nome: 'Conta A' } }],
            });
            getPrestacaoDeContasDetalhe.mockResolvedValue({
                ...basePrestacao,
                analises_de_conta_da_prestacao: [{
                    uuid: 'analise-carregada-1',
                    conta_associacao: { uuid: 'conta-1' },
                    data_extrato: '2024-01-01',
                    saldo_extrato: 10,
                    solicitar_correcao_da_data_do_saldo_da_conta: false,
                    solicitar_envio_do_comprovante_do_saldo_da_conta: false,
                    observacao_solicitar_envio_do_comprovante_do_saldo_da_conta: null,
                    solicitar_correcao_de_justificativa_de_conciliacao: false,
                }],
            });
            renderComponent();
            await waitForCarregado();

            await waitFor(() => {
                expect(mockCapturedComportamentoProps.analisesDeContaDaPrestacao).toHaveLength(1);
            });
            expect(mockCapturedComportamentoProps.analisesDeContaDaPrestacao[0]).toEqual(
                expect.objectContaining({ uuid: 'analise-carregada-1', conta_associacao: 'conta-1' })
            );
        });
    });
});
