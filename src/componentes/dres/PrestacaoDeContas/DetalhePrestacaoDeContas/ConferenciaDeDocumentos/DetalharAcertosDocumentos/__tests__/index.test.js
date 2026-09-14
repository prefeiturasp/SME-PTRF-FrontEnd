import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import DetalharAcertosDocumentos from '../index';
import { SidebarContext } from '../../../../../../../context/Sidebar';
import { NotificacaoContext } from '../../../../../../../context/Notificacoes';
import {
    getTiposDeAcertosDocumentos,
    getSolicitacaoDeAcertosDocumentos,
    postSolicitacoesParaAcertosDocumentos,
    getTabelas,
    getContasComMovimentoNaPc,
} from '../../../../../../../services/dres/PrestacaoDeContas.service';
import { useCarregaPrestacaoDeContasPorUuid } from '../../../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid';
import useRecursoSelecionado from '../../../../../../../hooks/Globais/useRecursoSelecionado';

jest.mock('../../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getTiposDeAcertosDocumentos: jest.fn(),
    getSolicitacaoDeAcertosDocumentos: jest.fn(),
    postSolicitacoesParaAcertosDocumentos: jest.fn(),
    getTabelas: jest.fn(),
    getContasComMovimentoNaPc: jest.fn(),
}));

jest.mock('../../../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid', () => ({
    useCarregaPrestacaoDeContasPorUuid: jest.fn(),
}));

jest.mock('../../../../../../../hooks/Globais/useRecursoSelecionado', () => jest.fn());

const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
}));

let mockDocumentos = [];
jest.mock('react-redux', () => ({
    useSelector: (selector) => selector({ DetalharAcertosDocumentos: { documentos: mockDocumentos } }),
}));

let mockCapturedTopoProps = null;
jest.mock('../TopoComBotoes', () => ({
    TopoComBotoes: (props) => {
        mockCapturedTopoProps = props;
        return <div data-testid="mock-topo-com-botoes" />;
    },
}));

jest.mock('../CabecalhoDocumento', () => () => <div data-testid="mock-cabecalho-documento" />);

let mockCapturedFormularioProps = null;
jest.mock('../FormularioAcertos', () => (props) => {
    mockCapturedFormularioProps = props;
    return <div data-testid="mock-formulario-acertos" />;
});

let mockCapturedModalConfirmacaoProps = null;
jest.mock('../../../../../../Globais/ModalAntDesign', () => ({
    ModalAntDesignConfirmacao: (props) => {
        mockCapturedModalConfirmacaoProps = props;
        return props.handleShow ? <div data-testid="mock-modal-conta-encerrada">{props.bodyText}</div> : null;
    },
}));

const buildDocumento = (overrides = {}) => ({
    tipo_documento_prestacao_conta: {
        uuid: 'tipo-doc-1',
        conta_associacao: 'conta-1',
        documento_por_conta: true,
    },
    analise_documento: { uuid: 'analise-doc-1' },
    ...overrides,
});

const renderComponent = () =>
    render(
        <MemoryRouter>
            <SidebarContext.Provider value={{ setIrParaUrl: jest.fn().mockResolvedValue(undefined), setSideBarStatus: jest.fn(), sideBarStatus: true, irParaUrl: true }}>
                <NotificacaoContext.Provider value={{ setShow: jest.fn(), setExibeModalTemDevolucao: jest.fn(), setExibeMensagemFixaTemDevolucao: jest.fn() }}>
                    <DetalharAcertosDocumentos />
                </NotificacaoContext.Provider>
            </SidebarContext.Provider>
        </MemoryRouter>
    );

const waitForCarregado = () =>
    waitFor(() => {
        expect(screen.getByTestId('mock-formulario-acertos')).toBeInTheDocument();
    });

const tiposAgrupadosPadrao = [
    {
        id: 'cat-1',
        cor: 1,
        texto: 'Categoria Verde',
        tipos_acerto_documento: [{ uuid: 'tipo-acerto-inclusao-credito' }],
    },
    {
        id: 'cat-2',
        cor: 2,
        texto: 'Categoria Vermelha',
        tipos_acerto_documento: [{ uuid: 'tipo-acerto-outro' }],
    },
    {
        // O id precisa ser exatamente "INCLUSAO_CREDITO"/"INCLUSAO_GASTO" — são os
        // valores literais comparados em categoriasQuePodemAlterarSaldoDaConta dentro
        // de possuiAcertosQuePodemAlterarSaldo(); qualquer outro id nunca "altera saldo".
        id: 'INCLUSAO_CREDITO',
        cor: 1,
        texto: 'Categoria que altera saldo',
        tipos_acerto_documento: [{ uuid: 'tipo-acerto-altera-saldo' }],
    },
];

describe('DetalharAcertosDocumentos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedTopoProps = null;
        mockCapturedFormularioProps = null;
        mockCapturedModalConfirmacaoProps = null;
        mockDocumentos = [buildDocumento()];
        mockUseParams.mockReturnValue({ prestacao_conta_uuid: 'pc-1' });

        useCarregaPrestacaoDeContasPorUuid.mockReturnValue({
            uuid: 'pc-1',
            analise_atual: { uuid: 'analise-1' },
            periodo_referencia: 'periodo-1',
        });
        useRecursoSelecionado.mockReturnValue({ recursoSelecionado: { uuid: 'recurso-1' } });

        getTabelas.mockResolvedValue({ agrupado_por_categorias: tiposAgrupadosPadrao });
        getSolicitacaoDeAcertosDocumentos.mockResolvedValue({ solicitacoes_de_ajuste_da_analise: [] });
        getContasComMovimentoNaPc.mockResolvedValue([]);
        postSolicitacoesParaAcertosDocumentos.mockResolvedValue({});
    });

    it('volta para a tela de detalhe quando não há documentos', async () => {
        mockDocumentos = [];

        renderComponent();

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dre-detalhe-prestacao-de-contas/pc-1#conferencia_de_documentos');
        });
        expect(screen.queryByTestId('mock-formulario-acertos')).not.toBeInTheDocument();
    });

    it('renderiza o topo, o cabeçalho e o formulário quando há documentos', async () => {
        renderComponent();
        await waitForCarregado();

        expect(screen.getByTestId('mock-topo-com-botoes')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cabecalho-documento')).toBeInTheDocument();
    });

    it('carrega os tipos de acerto agrupados usando o uuid do recurso selecionado', async () => {
        renderComponent();
        await waitForCarregado();

        await waitFor(() => {
            expect(getTabelas).toHaveBeenCalledWith('tipo-doc-1', 'recurso-1');
        });
        expect(mockCapturedFormularioProps.tiposDeAcertoDocumentosAgrupados).toEqual(tiposAgrupadosPadrao);
    });

    it('carrega os tipos de acerto com recurso vazio quando não há recurso selecionado', async () => {
        useRecursoSelecionado.mockReturnValue({ recursoSelecionado: null });
        renderComponent();
        await waitForCarregado();

        await waitFor(() => {
            expect(getTabelas).toHaveBeenCalledWith('tipo-doc-1', '');
        });
    });

    it('não carrega solicitações de acerto quando o documento não possui análise', async () => {
        mockDocumentos = [buildDocumento({ analise_documento: null })];
        renderComponent();
        await waitForCarregado();

        expect(getSolicitacaoDeAcertosDocumentos).not.toHaveBeenCalled();
        expect(mockCapturedFormularioProps.solicitacoes_acerto).toEqual({});
    });

    it('carrega e mapeia as solicitações de acerto já cadastradas, com e sem categoria correspondente', async () => {
        getSolicitacaoDeAcertosDocumentos.mockResolvedValue({
            solicitacoes_de_ajuste_da_analise: [
                { uuid: 'acerto-1', copiado: false, tipo_acerto: { uuid: 'tipo-acerto-1', categoria: 'cat-1' }, detalhamento: 'Detalhe 1' },
                { uuid: 'acerto-2', copiado: true, tipo_acerto: { uuid: 'tipo-acerto-2', categoria: 'categoria-inexistente' }, detalhamento: 'Detalhe 2' },
            ],
        });
        renderComponent();
        await waitForCarregado();

        await waitFor(() => {
            expect(getSolicitacaoDeAcertosDocumentos).toHaveBeenCalledWith('pc-1', 'analise-doc-1');
        });

        await waitFor(() => {
            expect(mockCapturedFormularioProps.solicitacoes_acerto.solicitacoes_acerto).toHaveLength(2);
        });
        expect(mockCapturedFormularioProps.textoCategoria).toEqual(['Categoria Verde', '']);
        expect(mockCapturedFormularioProps.corTextoCategoria).toEqual(['texto-categoria-documento-verde', '']);
    });

    it('usa a classe vermelha para categorias já cadastradas com cor diferente de 1', async () => {
        getSolicitacaoDeAcertosDocumentos.mockResolvedValue({
            solicitacoes_de_ajuste_da_analise: [
                { uuid: 'acerto-1', copiado: false, tipo_acerto: { uuid: 'tipo-acerto-2', categoria: 'cat-2' }, detalhamento: '' },
            ],
        });
        renderComponent();
        await waitForCarregado();

        await waitFor(() => {
            expect(mockCapturedFormularioProps.textoCategoria).toEqual(['Categoria Vermelha']);
        });
        expect(mockCapturedFormularioProps.corTextoCategoria).toEqual(['texto-categoria-documento-vermelho']);
    });

    it('volta para a tela de detalhe ao clicar em voltar', async () => {
        renderComponent();
        await waitForCarregado();

        act(() => {
            mockCapturedTopoProps.onClickBtnVoltar();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/dre-detalhe-prestacao-de-contas/pc-1#conferencia_de_documentos');
    });

    describe('validaContaAoSalvar / onSubmitFormAcertos', () => {
        const setFormRef = (values, errors = {}) => {
            act(() => {
                mockCapturedFormularioProps.formRef.current = { values, errors };
            });
        };

        it('não faz nada quando o formulário possui erros', async () => {
            renderComponent();
            await waitForCarregado();
            setFormRef({ solicitacoes_acerto: [{ tipo_acerto: 'x' }] }, { solicitacoes_acerto: 'erro' });

            await act(async () => {
                await mockCapturedTopoProps.validaContaAoSalvar();
            });

            expect(postSolicitacoesParaAcertosDocumentos).not.toHaveBeenCalled();
        });

        it('não faz nada quando não há solicitacoes_acerto no formulário', async () => {
            renderComponent();
            await waitForCarregado();
            setFormRef({});

            await act(async () => {
                await mockCapturedTopoProps.validaContaAoSalvar();
            });

            expect(postSolicitacoesParaAcertosDocumentos).not.toHaveBeenCalled();
        });

        it('submete diretamente quando o documento não é "documento_por_conta"', async () => {
            mockDocumentos = [buildDocumento({ tipo_documento_prestacao_conta: { uuid: 'tipo-doc-1', conta_associacao: 'conta-1', documento_por_conta: false } })];
            renderComponent();
            await waitForCarregado();
            setFormRef({ solicitacoes_acerto: [{ tipo_acerto: 'tipo-acerto-inclusao-credito' }] });

            await act(async () => {
                await mockCapturedTopoProps.validaContaAoSalvar();
            });

            expect(postSolicitacoesParaAcertosDocumentos).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/dre-detalhe-prestacao-de-contas/pc-1#conferencia_de_documentos');
        });

        it('não faz nada quando documento_por_conta é true mas não há conta_associacao', async () => {
            mockDocumentos = [buildDocumento({ tipo_documento_prestacao_conta: { uuid: 'tipo-doc-1', conta_associacao: null, documento_por_conta: true } })];
            renderComponent();
            await waitForCarregado();
            setFormRef({ solicitacoes_acerto: [{ tipo_acerto: 'x' }] });

            await act(async () => {
                await mockCapturedTopoProps.validaContaAoSalvar();
            });

            expect(getContasComMovimentoNaPc).not.toHaveBeenCalled();
            expect(postSolicitacoesParaAcertosDocumentos).not.toHaveBeenCalled();
        });

        it('submete direto quando a conta associada não está encerrada', async () => {
            getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'conta-1', status: 'ATIVA', periodo_encerramento_conta: null }]);
            renderComponent();
            await waitForCarregado();
            setFormRef({ solicitacoes_acerto: [{ tipo_acerto: 'tipo-acerto-inclusao-credito' }] });

            await act(async () => {
                await mockCapturedTopoProps.validaContaAoSalvar();
            });

            expect(postSolicitacoesParaAcertosDocumentos).toHaveBeenCalled();
        });

        it('submete direto quando a conta não é encontrada na lista de contas com movimento', async () => {
            getContasComMovimentoNaPc.mockResolvedValue([]);
            renderComponent();
            await waitForCarregado();
            setFormRef({ solicitacoes_acerto: [{ tipo_acerto: 'tipo-acerto-inclusao-credito' }] });

            await act(async () => {
                await mockCapturedTopoProps.validaContaAoSalvar();
            });

            expect(postSolicitacoesParaAcertosDocumentos).toHaveBeenCalled();
        });

        it('submete direto quando a conta está encerrada mas nenhum acerto altera o saldo', async () => {
            getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'conta-1', status: 'INATIVA', periodo_encerramento_conta: 'periodo-1' }]);
            renderComponent();
            await waitForCarregado();
            await waitFor(() => expect(mockCapturedFormularioProps.tiposDeAcertoDocumentosAgrupados.length).toBeGreaterThan(0));
            setFormRef({ solicitacoes_acerto: [{ tipo_acerto: 'tipo-acerto-outro' }] });

            await act(async () => {
                await mockCapturedTopoProps.validaContaAoSalvar();
            });

            expect(postSolicitacoesParaAcertosDocumentos).toHaveBeenCalled();
        });

        it('exibe o modal de conta encerrada quando há acerto que altera o saldo da conta encerrada', async () => {
            getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'conta-1', status: 'INATIVA', periodo_encerramento_conta: 'periodo-1' }]);
            renderComponent();
            await waitForCarregado();
            await waitFor(() => expect(mockCapturedFormularioProps.tiposDeAcertoDocumentosAgrupados.length).toBeGreaterThan(0));
            setFormRef({ solicitacoes_acerto: [{ tipo_acerto: 'tipo-acerto-altera-saldo' }] });

            await act(async () => {
                await mockCapturedTopoProps.validaContaAoSalvar();
            });

            expect(postSolicitacoesParaAcertosDocumentos).not.toHaveBeenCalled();
            expect(screen.getByTestId('mock-modal-conta-encerrada')).toBeInTheDocument();
        });

        it('confirma o envio a partir do modal de conta encerrada', async () => {
            getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'conta-1', status: 'INATIVA', periodo_encerramento_conta: 'periodo-1' }]);
            renderComponent();
            await waitForCarregado();
            await waitFor(() => expect(mockCapturedFormularioProps.tiposDeAcertoDocumentosAgrupados.length).toBeGreaterThan(0));
            setFormRef({ solicitacoes_acerto: [{ tipo_acerto: 'tipo-acerto-altera-saldo' }] });

            await act(async () => {
                await mockCapturedTopoProps.validaContaAoSalvar();
            });
            expect(screen.getByTestId('mock-modal-conta-encerrada')).toBeInTheDocument();

            await act(async () => {
                await mockCapturedModalConfirmacaoProps.handleOk();
            });

            expect(postSolicitacoesParaAcertosDocumentos).toHaveBeenCalled();
            expect(screen.queryByTestId('mock-modal-conta-encerrada')).not.toBeInTheDocument();
        });

        it('onSubmitFormAcertos (via handleOk do modal) não envia nada se o formulário ficou inválido nesse meio-tempo', async () => {
            getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'conta-1', status: 'INATIVA', periodo_encerramento_conta: 'periodo-1' }]);
            renderComponent();
            await waitForCarregado();
            await waitFor(() => expect(mockCapturedFormularioProps.tiposDeAcertoDocumentosAgrupados.length).toBeGreaterThan(0));
            setFormRef({ solicitacoes_acerto: [{ tipo_acerto: 'tipo-acerto-altera-saldo' }] });

            await act(async () => {
                await mockCapturedTopoProps.validaContaAoSalvar();
            });
            expect(screen.getByTestId('mock-modal-conta-encerrada')).toBeInTheDocument();

            // onSubmitFormAcertos tem sua própria guarda (redundante com a de
            // validaContaAoSalvar) — simulamos o formulário ficando inválido entre a
            // exibição do modal e a confirmação para exercê-la diretamente.
            setFormRef({ solicitacoes_acerto: [{ tipo_acerto: 'tipo-acerto-altera-saldo' }] }, { solicitacoes_acerto: 'erro' });

            await act(async () => {
                await mockCapturedModalConfirmacaoProps.handleOk();
            });

            expect(postSolicitacoesParaAcertosDocumentos).not.toHaveBeenCalled();
        });

        it('cancela pelo modal de conta encerrada sem enviar', async () => {
            getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'conta-1', status: 'INATIVA', periodo_encerramento_conta: 'periodo-1' }]);
            renderComponent();
            await waitForCarregado();
            await waitFor(() => expect(mockCapturedFormularioProps.tiposDeAcertoDocumentosAgrupados.length).toBeGreaterThan(0));
            setFormRef({ solicitacoes_acerto: [{ tipo_acerto: 'tipo-acerto-altera-saldo' }] });

            await act(async () => {
                await mockCapturedTopoProps.validaContaAoSalvar();
            });

            act(() => {
                mockCapturedModalConfirmacaoProps.handleCancel();
            });

            expect(postSolicitacoesParaAcertosDocumentos).not.toHaveBeenCalled();
            expect(screen.queryByTestId('mock-modal-conta-encerrada')).not.toBeInTheDocument();
        });

        it('trata erro ao submeter as solicitações de acerto', async () => {
            postSolicitacoesParaAcertosDocumentos.mockRejectedValue(new Error('falhou'));
            renderComponent();
            await waitForCarregado();
            setFormRef({ solicitacoes_acerto: [{ tipo_acerto: 'tipo-acerto-inclusao-credito' }] });

            await act(async () => {
                await mockCapturedTopoProps.validaContaAoSalvar();
            });

            expect(postSolicitacoesParaAcertosDocumentos).toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalledWith('/dre-detalhe-prestacao-de-contas/pc-1#conferencia_de_documentos');
        });

        // Nota: `documentos[0].tipo_documento_prestacao_conta === null` não é testável em
        // isolamento aqui — carregaTiposDeAcertoDocumentos() (outro efeito, disparado no
        // mount) acessa `documentos[0].tipo_documento_prestacao_conta.uuid` sem guarda de
        // nulidade e quebra antes que validaContaAoSalvar/onSubmitFormAcertos rode. Os
        // ramos `tipo_documento`/`conta_associacao` nulos dentro de onSubmitFormAcertos
        // são, na prática, inalcançáveis por esse motivo.
    });

    describe('handlers de texto/cor de categoria', () => {
        it('adiciona um texto/cor de categoria vazio', async () => {
            renderComponent();
            await waitForCarregado();

            act(() => {
                mockCapturedFormularioProps.adicionaTextoECorCategoriaVazio();
            });

            expect(mockCapturedFormularioProps.textoCategoria).toContain('');
            expect(mockCapturedFormularioProps.corTextoCategoria).toContain('');
        });

        it('remove o texto/cor de categoria pelo índice', async () => {
            getSolicitacaoDeAcertosDocumentos.mockResolvedValue({
                solicitacoes_de_ajuste_da_analise: [
                    { uuid: 'acerto-1', copiado: false, tipo_acerto: { uuid: 'tipo-acerto-1', categoria: 'cat-1' }, detalhamento: '' },
                ],
            });
            renderComponent();
            await waitForCarregado();
            await waitFor(() => {
                expect(mockCapturedFormularioProps.textoCategoria).toEqual(['Categoria Verde']);
            });

            act(() => {
                mockCapturedFormularioProps.removeTextoECorCategoriaTipoDeAcertoJaCadastrado(0);
            });

            expect(mockCapturedFormularioProps.textoCategoria).toEqual([]);
        });

        it('handleChangeTipoDeAcertoDocumento atualiza texto/cor conforme a categoria selecionada (verde e vermelha)', async () => {
            renderComponent();
            await waitForCarregado();
            await waitFor(() => {
                expect(getTabelas).toHaveBeenCalled();
            });

            const optionVerde = { getAttribute: () => 'cat-1' };
            const eventoVerde = { target: { selectedIndex: 0, options: [optionVerde] } };
            act(() => {
                mockCapturedFormularioProps.handleChangeTipoDeAcertoDocumento(eventoVerde, 0);
            });
            expect(mockCapturedFormularioProps.textoCategoria[0]).toBe('Categoria Verde');
            expect(mockCapturedFormularioProps.corTextoCategoria[0]).toBe('texto-categoria-documento-verde');

            const optionVermelha = { getAttribute: () => 'cat-2' };
            const eventoVermelha = { target: { selectedIndex: 0, options: [optionVermelha] } };
            act(() => {
                mockCapturedFormularioProps.handleChangeTipoDeAcertoDocumento(eventoVermelha, 1);
            });
            expect(mockCapturedFormularioProps.textoCategoria[1]).toBe('Categoria Vermelha');
            expect(mockCapturedFormularioProps.corTextoCategoria[1]).toBe('texto-categoria-documento-vermelho');

            // índice já existente é substituído, não duplicado
            const eventoSubstitui = { target: { selectedIndex: 0, options: [optionVerde] } };
            act(() => {
                mockCapturedFormularioProps.handleChangeTipoDeAcertoDocumento(eventoSubstitui, 1);
            });
            expect(mockCapturedFormularioProps.textoCategoria[1]).toBe('Categoria Verde');
        });

        it('handleChangeTipoDeAcertoDocumento limpa texto/cor quando a categoria não é encontrada', async () => {
            renderComponent();
            await waitForCarregado();
            await waitFor(() => {
                expect(getTabelas).toHaveBeenCalled();
            });

            const optionInexistente = { getAttribute: () => 'categoria-inexistente' };
            const evento = { target: { selectedIndex: 0, options: [optionInexistente] } };
            act(() => {
                mockCapturedFormularioProps.handleChangeTipoDeAcertoDocumento(evento, 0);
            });
            expect(mockCapturedFormularioProps.textoCategoria[0]).toBe('');
            expect(mockCapturedFormularioProps.corTextoCategoria[0]).toBe('');

            // índice já existente (vazio) é mantido vazio, exercendo o outro ramo do "senão"
            act(() => {
                mockCapturedFormularioProps.handleChangeTipoDeAcertoDocumento(evento, 0);
            });
            expect(mockCapturedFormularioProps.textoCategoria[0]).toBe('');
        });
    });

    it('ehSolicitacaoCopiada retorna true/false conforme o campo copiado', async () => {
        renderComponent();
        await waitForCarregado();

        expect(mockCapturedFormularioProps.ehSolicitacaoCopiada({ copiado: true })).toBe(true);
        expect(mockCapturedFormularioProps.ehSolicitacaoCopiada({ copiado: false })).toBe(false);
    });
});
