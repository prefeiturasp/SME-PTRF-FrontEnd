import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GetComportamentoPorStatus } from '../GetComportamentoPorStatus';
import { RetornaSeTemPermissaoEdicaoAcompanhamentoDePc } from '../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc';
import { visoesService } from '../../../../../services/visoes.service';

jest.mock('../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc', () => ({
    RetornaSeTemPermissaoEdicaoAcompanhamentoDePc: jest.fn(),
}));

jest.mock('../../../../../services/visoes.service', () => ({
    visoesService: {
        featureFlagAtiva: jest.fn(),
    },
}));

let mockCapturedBotoes = null;
jest.mock('../BotoesAvancarRetroceder', () => ({
    BotoesAvancarRetroceder: (props) => {
        mockCapturedBotoes = props;
        return (
            <div data-testid="mock-botoes">
                <button data-testid="botao-avancar" onClick={props.metodoAvancar} disabled={props.disabledBtnAvancar}>
                    {props.textoBtnAvancar}
                </button>
                {!props.esconderBotaoRetroceder && (
                    <button data-testid="botao-retroceder" onClick={props.metodoRetroceder} disabled={props.disabledBtnRetroceder}>
                        {props.textoBtnRetroceder}
                    </button>
                )}
            </div>
        );
    },
}));

jest.mock('../Cabecalho', () => (props) => <div data-testid="mock-cabecalho" />);

jest.mock('../TrilhaDeStatus', () => ({
    TrilhaDeStatus: () => <div data-testid="mock-trilha-de-status" />,
}));

jest.mock('../FormRecebimentoPelaDiretoria', () => ({
    FormRecebimentoPelaDiretoria: (props) => (
        <div data-testid="mock-form-recebimento" data-exibe-motivo={String(props.exibeMotivo)} data-exibe-recomendacoes={String(props.exibeRecomendacoes)} />
    ),
}));

jest.mock('../InformacoesPrestacaoDeContas', () => ({
    InformacoesPrestacaoDeContas: (props) => <div data-testid="mock-informacoes-pc" data-editavel={String(props.editavel)} />,
}));

jest.mock('../ComentariosDeAnalise', () => (props) => <div data-testid="mock-comentarios-analise" data-editavel={String(props.editavel)} />);

jest.mock('../ArquivosDeReferencia/TabsArquivosDeReferencia', () => ({
    TabsArquivosDeReferencia: () => <div data-testid="mock-tabs-arquivos" />,
}));

let mockCapturedConferenciaLancamentos = null;
jest.mock('../ConferenciaDeLancamentos', () => (props) => {
    mockCapturedConferenciaLancamentos = props;
    return <div data-testid="mock-conferencia-lancamentos" />;
});

let mockCapturedDevolucaoParaAcertos = null;
jest.mock('../DevolucaoParaAcertos', () => (props) => {
    mockCapturedDevolucaoParaAcertos = props;
    return <div data-testid="mock-devolucao-para-acertos" />;
});

let mockCapturedConferenciaDeDocumentos = null;
jest.mock('../ConferenciaDeDocumentos', () => (props) => {
    mockCapturedConferenciaDeDocumentos = props;
    return <div data-testid="mock-conferencia-documentos" />;
});

jest.mock('../DevolutivaDaAssociacao', () => (props) => <div data-testid="mock-devolutiva-da-associacao" />);

jest.mock('../JustificativaDeFaltaDeAjustes', () => (props) => <div data-testid="mock-justificativa-falta-ajustes" />);

jest.mock('../../PendenciasRecebimento', () => ({
    PendenciasRecebimento: () => <div data-testid="mock-pendencias-recebimento" />,
}));

let mockCapturedConferenciaDespesasAnteriores = null;
jest.mock('../ConferenciaDespesasPeriodosAnteriores', () => (props) => {
    mockCapturedConferenciaDespesasAnteriores = props;
    return <div data-testid="mock-conferencia-despesas-anteriores" />;
});

const basePrestacao = { uuid: 'pc-1', status: 'NAO_RECEBIDA' };

const baseProps = {
    prestacaoDeContas: basePrestacao,
    receberPrestacaoDeContas: jest.fn(),
    setShowReabrirPc: jest.fn(),
    stateFormRecebimentoPelaDiretoria: { data_recebimento: '' },
    handleChangeFormRecebimentoPelaDiretoria: jest.fn(),
    tabelaPrestacoes: {},
    analisarPrestacaoDeContas: jest.fn(),
    setShowNaoRecebida: jest.fn(),
    setShowConcluirAnalise: jest.fn(),
    setShowRecebida: jest.fn(),
    handleChangeFormInformacoesPrestacaoDeContas: jest.fn(),
    informacoesPrestacaoDeContas: { processo_sei: '' },
    valorTemplate: jest.fn(),
    infoAta: {},
    clickBtnEscolheConta: {},
    toggleBtnEscolheConta: jest.fn(),
    exibeAtaPorConta: jest.fn(),
    infoAtaPorConta: {},
    analisesDeContaDaPrestacao: [],
    handleChangeAnalisesDeContaDaPrestacao: jest.fn(),
    getObjetoIndexAnalise: jest.fn(),
    toggleBtnTabelaAcoes: jest.fn(),
    clickBtnTabelaAcoes: {},
    setShowVoltarParaAnalise: jest.fn(),
    carregaPrestacaoDeContas: jest.fn(),
    dataRecebimentoDevolutiva: '',
    handleChangedataRecebimentoDevolutiva: jest.fn(),
    receberAposAcertos: jest.fn(),
    desfazerReceberAposAcertos: jest.fn(),
    setLoading: jest.fn(),
    adicaoAjusteSaldo: false,
    setAdicaoAjusteSaldo: jest.fn(),
    onClickAdicionarAcertoSaldo: jest.fn(),
    onClickDescartarAcerto: jest.fn(),
    formErrosAjusteSaldo: [],
    validaAjustesSaldo: jest.fn(),
    handleOnKeyDownAjusteSaldo: jest.fn(),
    onClickSalvarAcertoSaldo: jest.fn(),
    ajusteSaldoSalvoComSucesso: {},
    onClickDeletarAcertoSaldo: jest.fn(),
    setAnalisesDeContaDaPrestacao: jest.fn(),
    bloqueiaBtnRetroceder: jest.fn(() => false),
    tooltipRetroceder: jest.fn(() => null),
    tooltipAvancar: jest.fn(() => null),
    handleConcluirPCemAnalise: jest.fn(),
    verificaDadosParaRecebimentoDePrestacaoDeContas: jest.fn(),
};

const renderComponent = (overrideProps = {}) =>
    render(<GetComportamentoPorStatus {...baseProps} {...overrideProps} />);

describe('GetComportamentoPorStatus', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedBotoes = null;
        mockCapturedConferenciaLancamentos = null;
        mockCapturedDevolucaoParaAcertos = null;
        mockCapturedConferenciaDeDocumentos = null;
        mockCapturedConferenciaDespesasAnteriores = null;
        RetornaSeTemPermissaoEdicaoAcompanhamentoDePc.mockReturnValue(true);
        visoesService.featureFlagAtiva.mockReturnValue(false);
    });

    it('não renderiza nada quando não há prestacaoDeContas', () => {
        const { container } = renderComponent({ prestacaoDeContas: null });
        expect(container).toBeEmptyDOMElement();
    });

    it('não renderiza nada quando o status não corresponde a nenhum comportamento conhecido', () => {
        const { container } = renderComponent({ prestacaoDeContas: { uuid: 'pc-1', status: 'STATUS_DESCONHECIDO' } });
        expect(container).toBeEmptyDOMElement();
    });

    describe('NAO_RECEBIDA', () => {
        it('renderiza os componentes esperados e desabilita avançar quando faltam dados para receber', () => {
            renderComponent({ prestacaoDeContas: { uuid: 'pc-1', status: 'NAO_RECEBIDA' } });

            expect(screen.getByTestId('mock-cabecalho')).toBeInTheDocument();
            expect(screen.getByTestId('mock-pendencias-recebimento')).toBeInTheDocument();
            expect(screen.getByTestId('mock-form-recebimento')).toBeInTheDocument();
            expect(screen.getByTestId('mock-informacoes-pc')).toBeInTheDocument();
            expect(screen.getByTestId('mock-comentarios-analise')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-tabs-arquivos')).not.toBeInTheDocument();
            expect(screen.queryByTestId('mock-conferencia-lancamentos')).not.toBeInTheDocument();

            expect(mockCapturedBotoes.disabledBtnAvancar).toBe(true);
            expect(mockCapturedBotoes.disabledBtnRetroceder).toBe(false);
        });

        it('habilita avançar (Receber) quando TEMPERMISSAO, data de recebimento, processo SEI e ata estão presentes', () => {
            renderComponent({
                prestacaoDeContas: { uuid: 'pc-1', status: 'NAO_RECEBIDA', ata_aprensentacao_gerada: true },
                stateFormRecebimentoPelaDiretoria: { data_recebimento: '2024-01-01' },
                informacoesPrestacaoDeContas: { processo_sei: '123' },
            });

            expect(mockCapturedBotoes.disabledBtnAvancar).toBe(false);
        });

        it('desabilita avançar quando não há permissão de edição', () => {
            RetornaSeTemPermissaoEdicaoAcompanhamentoDePc.mockReturnValue(false);
            renderComponent({
                prestacaoDeContas: { uuid: 'pc-1', status: 'NAO_RECEBIDA', ata_aprensentacao_gerada: true },
                stateFormRecebimentoPelaDiretoria: { data_recebimento: '2024-01-01' },
                informacoesPrestacaoDeContas: { processo_sei: '123' },
            });

            expect(mockCapturedBotoes.disabledBtnAvancar).toBe(true);
            expect(mockCapturedBotoes.disabledBtnRetroceder).toBe(true);
        });

        it('chama verificaDadosParaRecebimentoDePrestacaoDeContas ao clicar em avançar e setShowReabrirPc ao clicar em retroceder', () => {
            const verificaDadosParaRecebimentoDePrestacaoDeContas = jest.fn();
            const setShowReabrirPc = jest.fn();
            renderComponent({
                prestacaoDeContas: { uuid: 'pc-1', status: 'NAO_RECEBIDA', ata_aprensentacao_gerada: true },
                stateFormRecebimentoPelaDiretoria: { data_recebimento: '2024-01-01' },
                informacoesPrestacaoDeContas: { processo_sei: '123' },
                verificaDadosParaRecebimentoDePrestacaoDeContas,
                setShowReabrirPc,
            });

            act(() => { screen.getByTestId('botao-avancar').click(); });
            expect(verificaDadosParaRecebimentoDePrestacaoDeContas).toHaveBeenCalled();

            act(() => { screen.getByTestId('botao-retroceder').click(); });
            expect(setShowReabrirPc).toHaveBeenCalledWith(true);
        });
    });

    describe('RECEBIDA', () => {
        it('renderiza os componentes esperados', () => {
            renderComponent({ prestacaoDeContas: { uuid: 'pc-1', status: 'RECEBIDA' } });

            expect(screen.getByTestId('mock-cabecalho')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-pendencias-recebimento')).not.toBeInTheDocument();
            expect(screen.getByTestId('mock-informacoes-pc')).toHaveAttribute('data-editavel', 'false');
            expect(screen.getByTestId('mock-comentarios-analise')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-tabs-arquivos')).not.toBeInTheDocument();
        });

        it('usa bloqueiaBtnRetroceder/tooltipRetroceder e chama analisarPrestacaoDeContas/setShowNaoRecebida', () => {
            const bloqueiaBtnRetroceder = jest.fn(() => true);
            const tooltipRetroceder = jest.fn(() => 'bloqueado');
            const analisarPrestacaoDeContas = jest.fn();
            const setShowNaoRecebida = jest.fn();
            renderComponent({
                prestacaoDeContas: { uuid: 'pc-1', status: 'RECEBIDA' },
                bloqueiaBtnRetroceder,
                tooltipRetroceder,
                analisarPrestacaoDeContas,
                setShowNaoRecebida,
            });

            expect(mockCapturedBotoes.disabledBtnRetroceder).toBe(true);
            expect(mockCapturedBotoes.tooltipRetroceder).toBe('bloqueado');

            act(() => { screen.getByTestId('botao-avancar').click(); });
            expect(analisarPrestacaoDeContas).toHaveBeenCalled();

            act(() => { mockCapturedBotoes.metodoRetroceder(); });
            expect(setShowNaoRecebida).toHaveBeenCalledWith(true);
        });
    });

    describe('EM_ANALISE', () => {
        const statusEmAnalise = { uuid: 'pc-1', status: 'EM_ANALISE' };

        it('renderiza os componentes de conferência e chama handleConcluirPCemAnalise/setShowRecebida', () => {
            const handleConcluirPCemAnalise = jest.fn();
            const setShowRecebida = jest.fn();
            renderComponent({ prestacaoDeContas: statusEmAnalise, handleConcluirPCemAnalise, setShowRecebida });

            expect(screen.getByTestId('mock-tabs-arquivos')).toBeInTheDocument();
            expect(screen.getByTestId('mock-conferencia-lancamentos')).toBeInTheDocument();
            expect(screen.getByTestId('mock-conferencia-documentos')).toBeInTheDocument();
            expect(screen.getByTestId('mock-devolucao-para-acertos')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-conferencia-despesas-anteriores')).not.toBeInTheDocument();

            act(() => { screen.getByTestId('botao-avancar').click(); });
            expect(handleConcluirPCemAnalise).toHaveBeenCalled();

            act(() => { screen.getByTestId('botao-retroceder').click(); });
            expect(setShowRecebida).toHaveBeenCalledWith(true);
        });

        it('renderiza ConferenciaDespesasPeriodosAnteriores quando a feature flag está ativa', () => {
            visoesService.featureFlagAtiva.mockReturnValue(true);
            renderComponent({ prestacaoDeContas: statusEmAnalise });

            expect(screen.getByTestId('mock-conferencia-despesas-anteriores')).toBeInTheDocument();
            expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith('ajustes-despesas-anteriores');
        });

        it('propaga os contadores de atualização para DevolucaoParaAcertos ao carregar lançamentos/documentos/despesas', () => {
            visoesService.featureFlagAtiva.mockReturnValue(true);
            renderComponent({ prestacaoDeContas: statusEmAnalise });

            expect(mockCapturedDevolucaoParaAcertos.updateListaDeDocumentosParaConferencia).toBe(0);
            expect(mockCapturedDevolucaoParaAcertos.carregaLancamentosParaConferencia).toBe(0);
            expect(mockCapturedDevolucaoParaAcertos.carregaDespesasPeriodosAnterioresParaConferencia).toBe(0);

            act(() => { mockCapturedConferenciaDeDocumentos.onUpdateListaDeDocumentosParaConferencia(); });
            expect(mockCapturedDevolucaoParaAcertos.updateListaDeDocumentosParaConferencia).toBe(1);

            act(() => { mockCapturedConferenciaLancamentos.onCarregaLancamentosParaConferencia(); });
            expect(mockCapturedDevolucaoParaAcertos.carregaLancamentosParaConferencia).toBe(1);

            act(() => { mockCapturedConferenciaDespesasAnteriores.onCarregaLancamentosParaConferencia(); });
            expect(mockCapturedDevolucaoParaAcertos.carregaDespesasPeriodosAnterioresParaConferencia).toBe(1);
        });
    });

    describe('DEVOLVIDA', () => {
        it('renderiza com os botões de avançar/retroceder desabilitados e sem PendenciasRecebimento', () => {
            renderComponent({ prestacaoDeContas: { uuid: 'pc-1', status: 'DEVOLVIDA' } });

            expect(mockCapturedBotoes.disabledBtnAvancar).toBe(true);
            expect(mockCapturedBotoes.disabledBtnRetroceder).toBe(true);
            expect(screen.queryByTestId('mock-pendencias-recebimento')).not.toBeInTheDocument();
            expect(screen.getByTestId('mock-tabs-arquivos')).toBeInTheDocument();
            expect(screen.getByTestId('mock-conferencia-lancamentos')).toBeInTheDocument();
        });

        it('chama setShowConcluirAnalise/setShowRecebida mesmo com os botões desabilitados (chamada direta dos handlers)', () => {
            const setShowConcluirAnalise = jest.fn();
            const setShowRecebida = jest.fn();
            renderComponent({ prestacaoDeContas: { uuid: 'pc-1', status: 'DEVOLVIDA' }, setShowConcluirAnalise, setShowRecebida });

            act(() => { mockCapturedBotoes.metodoAvancar(); });
            expect(setShowConcluirAnalise).toHaveBeenCalledWith(true);

            act(() => { mockCapturedBotoes.metodoRetroceder(); });
            expect(setShowRecebida).toHaveBeenCalledWith(true);
        });
    });

    describe('DEVOLVIDA_RETORNADA', () => {
        const statusDevolvidaRetornada = { uuid: 'pc-1', status: 'DEVOLVIDA_RETORNADA' };

        it('esconde o botão de retroceder e renderiza DevolutivaDaAssociacao/JustificativaDeFaltaDeAjustes/PendenciasRecebimento', () => {
            renderComponent({ prestacaoDeContas: statusDevolvidaRetornada });

            expect(screen.queryByTestId('botao-retroceder')).not.toBeInTheDocument();
            expect(screen.getByTestId('mock-devolutiva-da-associacao')).toBeInTheDocument();
            expect(screen.getByTestId('mock-justificativa-falta-ajustes')).toBeInTheDocument();
            expect(screen.getByTestId('mock-pendencias-recebimento')).toBeInTheDocument();
        });

        it('exibe tooltip e desabilita avançar quando falta a data de recebimento da devolutiva', () => {
            renderComponent({ prestacaoDeContas: statusDevolvidaRetornada, dataRecebimentoDevolutiva: '' });

            expect(mockCapturedBotoes.disabledBtnAvancar).toBe(true);
            expect(mockCapturedBotoes.tooltipAvancar).toContain('necessário informar a data de recebimento');
        });

        it('habilita avançar sem tooltip quando há permissão e data de recebimento da devolutiva', () => {
            renderComponent({ prestacaoDeContas: statusDevolvidaRetornada, dataRecebimentoDevolutiva: '2024-01-01' });

            expect(mockCapturedBotoes.disabledBtnAvancar).toBe(false);
            expect(mockCapturedBotoes.tooltipAvancar).toBeNull();
        });

        it('não exibe tooltip de pendência quando o status é outro, mesmo sem data de recebimento', () => {
            renderComponent({ prestacaoDeContas: { uuid: 'pc-1', status: 'DEVOLVIDA_RETORNADA', ...{} }, dataRecebimentoDevolutiva: '2024-01-01' });
            expect(mockCapturedBotoes.tooltipAvancar).toBeNull();
        });

        it('chama receberAposAcertos ao clicar em avançar', () => {
            const receberAposAcertos = jest.fn();
            renderComponent({ prestacaoDeContas: statusDevolvidaRetornada, dataRecebimentoDevolutiva: '2024-01-01', receberAposAcertos });

            act(() => { screen.getByTestId('botao-avancar').click(); });

            expect(receberAposAcertos).toHaveBeenCalledWith(statusDevolvidaRetornada);
        });
    });

    describe('DEVOLVIDA_RECEBIDA', () => {
        it('renderiza DevolutivaDaAssociacao (não editável) e chama analisarPrestacaoDeContas/desfazerReceberAposAcertos', () => {
            const analisarPrestacaoDeContas = jest.fn();
            const desfazerReceberAposAcertos = jest.fn();
            const statusDevolvidaRecebida = { uuid: 'pc-1', status: 'DEVOLVIDA_RECEBIDA' };
            renderComponent({ prestacaoDeContas: statusDevolvidaRecebida, analisarPrestacaoDeContas, desfazerReceberAposAcertos });

            expect(screen.getByTestId('mock-devolutiva-da-associacao')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-justificativa-falta-ajustes')).not.toBeInTheDocument();

            act(() => { screen.getByTestId('botao-avancar').click(); });
            expect(analisarPrestacaoDeContas).toHaveBeenCalled();

            act(() => { screen.getByTestId('botao-retroceder').click(); });
            expect(desfazerReceberAposAcertos).toHaveBeenCalledWith(statusDevolvidaRecebida);
        });
    });

    describe('APROVADA_RESSALVA', () => {
        it('esconde o botão de avançar e exibe motivo/recomendações no formulário de recebimento', () => {
            const setShowVoltarParaAnalise = jest.fn();
            renderComponent({ prestacaoDeContas: { uuid: 'pc-1', status: 'APROVADA_RESSALVA' }, setShowVoltarParaAnalise });

            expect(screen.getByTestId('mock-form-recebimento')).toHaveAttribute('data-exibe-motivo', 'true');
            expect(screen.getByTestId('mock-form-recebimento')).toHaveAttribute('data-exibe-recomendacoes', 'true');

            act(() => { screen.getByTestId('botao-retroceder').click(); });
            expect(setShowVoltarParaAnalise).toHaveBeenCalled();

            const setShowConcluirAnalise = jest.fn();
            renderComponent({ prestacaoDeContas: { uuid: 'pc-1', status: 'APROVADA_RESSALVA' }, setShowConcluirAnalise });
            act(() => { mockCapturedBotoes.metodoAvancar(); });
            expect(setShowConcluirAnalise).toHaveBeenCalledWith(true);
        });
    });

    it.each(['DEVOLVIDA', 'DEVOLVIDA_RETORNADA', 'DEVOLVIDA_RECEBIDA', 'APROVADA_RESSALVA', 'APROVADA'])(
        'renderiza ConferenciaDespesasPeriodosAnteriores para o status %s quando a feature flag está ativa',
        (status) => {
            visoesService.featureFlagAtiva.mockReturnValue(true);
            renderComponent({ prestacaoDeContas: { uuid: 'pc-1', status } });

            expect(screen.getByTestId('mock-conferencia-despesas-anteriores')).toBeInTheDocument();
        }
    );

    describe('APROVADA / REPROVADA', () => {
        it.each(['APROVADA', 'REPROVADA'])('renderiza para o status %s com motivo de reprovação e sem recomendações', (status) => {
            renderComponent({ prestacaoDeContas: { uuid: 'pc-1', status } });

            expect(screen.getByTestId('mock-form-recebimento')).toHaveAttribute('data-exibe-motivo', 'true');
            expect(screen.getByTestId('mock-form-recebimento')).toHaveAttribute('data-exibe-recomendacoes', 'false');
            expect(mockCapturedBotoes.disabledBtnAvancar).toBe(true);
        });

        it('chama setShowVoltarParaAnalise(true) ao retroceder e setShowConcluirAnalise(true) ao avançar', () => {
            const setShowVoltarParaAnalise = jest.fn();
            const setShowConcluirAnalise = jest.fn();
            renderComponent({ prestacaoDeContas: { uuid: 'pc-1', status: 'APROVADA' }, setShowVoltarParaAnalise, setShowConcluirAnalise });

            act(() => { screen.getByTestId('botao-retroceder').click(); });
            expect(setShowVoltarParaAnalise).toHaveBeenCalledWith(true);

            act(() => { mockCapturedBotoes.metodoAvancar(); });
            expect(setShowConcluirAnalise).toHaveBeenCalledWith(true);
        });
    });
});
