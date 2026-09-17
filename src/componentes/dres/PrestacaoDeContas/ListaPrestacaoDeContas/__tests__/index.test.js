import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { ListaPrestacaoDeContas } from '../index';
import { SidebarContext } from '../../../../../context/Sidebar';
import { NotificacaoContext } from '../../../../../context/Notificacoes';
import { getPeriodos } from '../../../../../services/dres/Dashboard.service';
import {
    getPrestacoesDeContas,
    getPrestacoesDeContasNaoRecebidaNaoGerada,
    getQtdeUnidadesDre,
    getPrestacoesDeContasTodosOsStatus,
    getTabelasPrestacoesDeContas,
} from '../../../../../services/dres/PrestacaoDeContas.service';
import { getTabelaAssociacoes } from '../../../../../services/dres/Associacoes.service';
import { getTecnicosDre } from '../../../../../services/dres/TecnicosDre.service';
import { colunasAprovada, colunasEmAnalise, colunasNaoRecebidas, colunasTodosOsStatus } from '../objetoColunasDinamicas';

jest.mock('../../../../../services/dres/Dashboard.service', () => ({
    getPeriodos: jest.fn(),
}));

jest.mock('../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getPrestacoesDeContas: jest.fn(),
    getPrestacoesDeContasNaoRecebidaNaoGerada: jest.fn(),
    getQtdeUnidadesDre: jest.fn(),
    getPrestacoesDeContasTodosOsStatus: jest.fn(),
    getTabelasPrestacoesDeContas: jest.fn(),
}));

jest.mock('../../../../../services/dres/Associacoes.service', () => ({
    getTabelaAssociacoes: jest.fn(),
}));

jest.mock('../../../../../services/dres/TecnicosDre.service', () => ({
    getTecnicosDre: jest.fn(),
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

let mockCapturedTopoProps = null;
jest.mock('../TopoSelectPeriodoBotaoVoltar', () => ({
    TopoSelectPeriodoBotaoVoltar: (props) => {
        mockCapturedTopoProps = props;
        return <div data-testid="mock-topo" />;
    },
}));

jest.mock('../BarraDeStatus', () => ({
    BarraDeStatus: () => <div data-testid="mock-barra-status" />,
}));

let mockCapturedFormFiltrosProps = null;
jest.mock('../FormFiltros', () => ({
    FormFiltros: (props) => {
        mockCapturedFormFiltrosProps = props;
        return <div data-testid="mock-form-filtros" />;
    },
}));

let mockCapturedTabelaDinamicaProps = null;
jest.mock('../TabelaDinamica', () => ({
    TabelaDinamica: (props) => {
        mockCapturedTabelaDinamicaProps = props;
        return <div data-testid="mock-tabela-dinamica" />;
    },
}));

const buildPrestacao = (overrides = {}) => ({
    uuid: 'pc-1',
    status: 'EM_ANALISE',
    unidade_nome: 'Escola A',
    unidade_tipo_unidade: 'EMEF',
    processo_sei: '123',
    tecnico_atribuido: 'Fulano',
    data_recebimento: '2024-01-01',
    associacao_uuid: 'assoc-1',
    associacao: {
        cnpj: '00.000.000/0000-00',
        unidade: { codigo_eol: '123456' },
        presidente_associacao: { nome: 'Presidente' },
        presidente_conselho_fiscal: { nome: 'Conselheiro' },
    },
    periodo_uuid: 'periodo-1',
    ...overrides,
});

const renderComponent = () =>
    render(
        <MemoryRouter>
            <SidebarContext.Provider value={{ setIrParaUrl: jest.fn().mockResolvedValue(undefined), setSideBarStatus: jest.fn(), sideBarStatus: true, irParaUrl: true }}>
                <NotificacaoContext.Provider value={{ setShow: jest.fn(), setExibeModalTemDevolucao: jest.fn(), setExibeMensagemFixaTemDevolucao: jest.fn() }}>
                    <ListaPrestacaoDeContas />
                </NotificacaoContext.Provider>
            </SidebarContext.Provider>
        </MemoryRouter>
    );

const waitForCarregado = () =>
    waitFor(() => {
        expect(screen.getByTestId('mock-form-filtros')).toBeInTheDocument();
    });

describe('ListaPrestacaoDeContas', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedNavigateProps = [];
        mockCapturedTopoProps = null;
        mockCapturedFormFiltrosProps = null;
        mockCapturedTabelaDinamicaProps = null;
        mockUseParams.mockReturnValue({});

        getPeriodos.mockResolvedValue([]);
        getQtdeUnidadesDre.mockResolvedValue({ qtd_unidades: 10 });
        getTabelaAssociacoes.mockResolvedValue({});
        getTabelasPrestacoesDeContas.mockResolvedValue({});
        getTecnicosDre.mockResolvedValue([]);
        getPrestacoesDeContas.mockResolvedValue([]);
        getPrestacoesDeContasNaoRecebidaNaoGerada.mockResolvedValue([]);
        getPrestacoesDeContasTodosOsStatus.mockResolvedValue([]);
    });

    it('exibe o Loading enquanto as prestações de contas do período estão sendo carregadas', async () => {
        getPeriodos.mockResolvedValue([{ uuid: 'periodo-1' }]);
        getPrestacoesDeContasTodosOsStatus.mockImplementation(() => new Promise(() => {}));

        renderComponent();

        expect(await screen.findByText('Carregando...')).toBeInTheDocument();
    });

    it('não busca prestações quando não há período escolhido (sem períodos disponíveis)', async () => {
        renderComponent();
        await waitForCarregado();

        expect(getPrestacoesDeContasTodosOsStatus).not.toHaveBeenCalled();
        expect(getPrestacoesDeContas).not.toHaveBeenCalled();
        expect(screen.getByText(/Nenhuma prestação retornada/)).toBeInTheDocument();
    });

    it('usa o período da URL quando informado, senão o primeiro período retornado', async () => {
        getPeriodos.mockResolvedValue([{ uuid: 'periodo-a' }, { uuid: 'periodo-b' }]);
        renderComponent();
        await waitForCarregado();

        await waitFor(() => {
            expect(getQtdeUnidadesDre).toHaveBeenCalledWith('periodo-a');
        });
    });

    it('usa o período informado na URL em vez do primeiro da lista', async () => {
        mockUseParams.mockReturnValue({ periodo_uuid: 'periodo-da-url' });
        getPeriodos.mockResolvedValue([{ uuid: 'periodo-a' }]);
        renderComponent();
        await waitForCarregado();

        await waitFor(() => {
            expect(getQtdeUnidadesDre).toHaveBeenCalledWith('periodo-da-url');
        });
    });

    it.each([
        ['NAO_RECEBIDA', ['NAO_RECEBIDA', 'NAO_APRESENTADA']],
        ['APROVADA', ['APROVADA', 'APROVADA_RESSALVA']],
        ['DEVOLVIDA', ['DEVOLVIDA', 'DEVOLVIDA_RETORNADA', 'DEVOLVIDA_RECEBIDA']],
        ['EM_ANALISE', ['EM_ANALISE']],
    ])('converte o status %s da URL para o conjunto de status selecionados esperado', async (statusUrl, esperado) => {
        mockUseParams.mockReturnValue({ status_prestacao: statusUrl });
        getPeriodos.mockResolvedValue([{ uuid: 'periodo-1' }]);
        renderComponent();
        await waitForCarregado();

        await waitFor(() => {
            expect(mockCapturedFormFiltrosProps.selectedStatusPc).toEqual(esperado);
        });
    });

    it.each([
        [['EM_ANALISE'], colunasEmAnalise],
        [['REPROVADA'], colunasEmAnalise],
        [['APROVADA'], colunasAprovada],
        [['APROVADA_RESSALVA'], colunasAprovada],
        [['TODOS'], colunasTodosOsStatus],
        [['NAO_RECEBIDA'], colunasNaoRecebidas],
        [['NAO_RECEBIDA', 'NAO_APRESENTADA'], colunasTodosOsStatus],
    ])('popula as colunas corretas para selectedStatusPc=%j', async (statusList, colunasEsperadas) => {
        // Setamos selectedStatusPc sempre via handleChangeSelectStatusPc (nunca pela URL):
        // carregaStatus() tem casos especiais para os status de URL "NAO_RECEBIDA"/"APROVADA"/
        // "DEVOLVIDA" que os expandem para 2-3 itens (ex.: URL "APROVADA" vira selectedStatusPc
        // = ["APROVADA","APROVADA_RESSALVA"], length 2) — usar a URL misturaria esse
        // comportamento com o de populaColunas() que queremos isolar aqui.
        getPeriodos.mockResolvedValue([{ uuid: 'periodo-1' }]);
        // TabelaDinamica só é montada quando há prestações — sem isso, `columns` é
        // calculado mas nunca chega a um prop capturável. NAO_RECEBIDA+NAO_APRESENTADA
        // juntos usam um endpoint diferente dos demais casos.
        getPrestacoesDeContasTodosOsStatus.mockResolvedValue([buildPrestacao()]);
        getPrestacoesDeContas.mockResolvedValue([buildPrestacao()]);
        getPrestacoesDeContasNaoRecebidaNaoGerada.mockResolvedValue([buildPrestacao()]);
        renderComponent();
        await waitForCarregado();

        act(() => {
            mockCapturedFormFiltrosProps.handleChangeSelectStatusPc(statusList);
        });

        await waitFor(() => {
            expect(mockCapturedTabelaDinamicaProps).not.toBeNull();
        });
        await waitFor(() => {
            expect(mockCapturedTabelaDinamicaProps.columns).toBe(colunasEsperadas);
        });
    });

    it('busca todos os status quando TODOS está selecionado', async () => {
        getPeriodos.mockResolvedValue([{ uuid: 'periodo-1' }]);
        renderComponent();
        await waitForCarregado();

        act(() => {
            mockCapturedFormFiltrosProps.handleChangeSelectStatusPc(['TODOS']);
        });

        await waitFor(() => {
            expect(getPrestacoesDeContasTodosOsStatus).toHaveBeenCalled();
        });
    });

    it('busca prestações não recebidas/não geradas quando o status é NAO_APRESENTADA', async () => {
        mockUseParams.mockReturnValue({ status_prestacao: 'NAO_APRESENTADA' });
        getPeriodos.mockResolvedValue([{ uuid: 'periodo-1' }]);
        renderComponent();
        await waitForCarregado();

        await waitFor(() => {
            expect(getPrestacoesDeContasNaoRecebidaNaoGerada).toHaveBeenCalled();
        });
    });

    it('busca prestações não recebidas/não geradas quando o status combina NAO_APRESENTADA e NAO_RECEBIDA', async () => {
        mockUseParams.mockReturnValue({ status_prestacao: 'NAO_RECEBIDA' });
        getPeriodos.mockResolvedValue([{ uuid: 'periodo-1' }]);
        renderComponent();
        await waitForCarregado();

        await waitFor(() => {
            expect(getPrestacoesDeContasNaoRecebidaNaoGerada).toHaveBeenCalled();
        });
    });

    it('busca prestações filtradas com data de início/fim formatadas quando o status não inclui NAO_APRESENTADA', async () => {
        mockUseParams.mockReturnValue({ status_prestacao: 'EM_ANALISE' });
        getPeriodos.mockResolvedValue([{ uuid: 'periodo-1' }]);
        renderComponent();
        await waitForCarregado();
        // Garante que a busca disparada pelo mount (quando periodoEscolhido resolve
        // de forma assíncrona) já terminou antes de mexermos nos filtros — evita uma
        // corrida entre esse efeito e as chamadas a handleChangeFiltros a seguir.
        await waitFor(() => {
            expect(getPrestacoesDeContas).toHaveBeenCalled();
        });
        getPrestacoesDeContas.mockClear();

        // Cada handleChangeFiltros precisa de seu próprio act() — como ambos leem
        // stateFiltros do closure atual, chamá-los no mesmo lote faria o segundo
        // sobrescrever a mudança do primeiro (closure ainda não atualizado).
        act(() => {
            mockCapturedFormFiltrosProps.handleChangeFiltros('filtrar_por_data_inicio', '2024-01-01');
        });
        act(() => {
            mockCapturedFormFiltrosProps.handleChangeFiltros('filtrar_por_data_fim', '2024-01-31');
        });
        expect(mockCapturedFormFiltrosProps.stateFiltros).toEqual(
            expect.objectContaining({ filtrar_por_data_inicio: '2024-01-01', filtrar_por_data_fim: '2024-01-31' })
        );

        await act(async () => {
            await mockCapturedFormFiltrosProps.handleSubmitFiltros();
        });

        // As datas passam por moment(new Date(...)) — não comparamos o valor exato
        // para não depender do timezone de execução; conferimos apenas que foram
        // formatadas (não vazias) e os demais parâmetros.
        expect(getPrestacoesDeContas).toHaveBeenCalledTimes(1);
        const [, , , , , dataInicioEnviada, dataFimEnviada] = getPrestacoesDeContas.mock.calls[0];
        expect(dataInicioEnviada).not.toBe('');
        expect(dataFimEnviada).not.toBe('');
    });

    it('busca todos os status quando o status combina NAO_APRESENTADA com um status diferente de NAO_RECEBIDA', async () => {
        getPeriodos.mockResolvedValue([{ uuid: 'periodo-1' }]);
        renderComponent();
        await waitForCarregado();

        act(() => {
            mockCapturedFormFiltrosProps.handleChangeSelectStatusPc(['NAO_APRESENTADA', 'EM_ANALISE']);
        });

        await waitFor(() => {
            expect(getPrestacoesDeContasTodosOsStatus).toHaveBeenCalled();
        });
    });

    it('troca o período ao selecionar outro no topo, recarregando as prestações', async () => {
        getPeriodos.mockResolvedValue([{ uuid: 'periodo-1' }]);
        renderComponent();
        await waitForCarregado();

        act(() => {
            mockCapturedTopoProps.handleChangePeriodos('periodo-2');
        });

        await waitFor(() => {
            expect(getQtdeUnidadesDre).toHaveBeenCalledWith('periodo-2');
        });
    });

    it('limpa os filtros, forçando um novo carregamento das prestações', async () => {
        getPeriodos.mockResolvedValue([{ uuid: 'periodo-1' }]);
        renderComponent();
        await waitForCarregado();

        getPrestacoesDeContasTodosOsStatus.mockClear();
        await act(async () => {
            await mockCapturedFormFiltrosProps.limpaFiltros();
        });

        expect(mockCapturedFormFiltrosProps.stateFiltros.filtrar_por_termo).toBe('');
    });

    it('renderiza a tabela dinâmica quando há prestações retornadas', async () => {
        getPeriodos.mockResolvedValue([{ uuid: 'periodo-1' }]);
        getPrestacoesDeContasTodosOsStatus.mockResolvedValue([buildPrestacao()]);
        renderComponent();
        await waitForCarregado();

        await waitFor(() => {
            expect(screen.getByTestId('mock-tabela-dinamica')).toBeInTheDocument();
        });
    });

    describe('templates de coluna', () => {
        const setupComTabela = async () => {
            getPeriodos.mockResolvedValue([{ uuid: 'periodo-1' }]);
            getPrestacoesDeContasTodosOsStatus.mockResolvedValue([buildPrestacao()]);
            renderComponent();
            await waitForCarregado();
            await waitFor(() => {
                expect(screen.getByTestId('mock-tabela-dinamica')).toBeInTheDocument();
            });
        };

        it('statusTemplate exibe o texto do status ou vazio quando não há status', async () => {
            await setupComTabela();
            const { statusTemplate } = mockCapturedTabelaDinamicaProps;

            const { container } = render(statusTemplate({ status: 'EM_ANALISE' }));
            expect(container.textContent).toBe('Em análise');

            const { container: containerVazio } = render(statusTemplate({}));
            expect(containerVazio.textContent).toBe('');
        });

        it.each([
            ['NAO_RECEBIDA', 'Não recebida'],
            ['NAO_APRESENTADA', 'Não apresentada'],
            ['RECEBIDA', 'Recebida'],
            ['DEVOLVIDA', 'Devolvida para acertos'],
            ['DEVOLVIDA_RETORNADA', 'Apresentada após acertos'],
            ['DEVOLVIDA_RECEBIDA', 'Recebida após acertos'],
            ['EM_ANALISE', 'Em análise'],
            ['APROVADA', 'Aprovada'],
            ['APROVADA_RESSALVA', 'Aprovada com ressalva'],
            ['REPROVADA', 'Reprovada'],
            ['TODOS', 'Todos'],
            ['STATUS_INEXISTENTE', 'SEM STATUS'],
        ])('statusTemplate mapeia o status %s para "%s"', async (status, textoEsperado) => {
            await setupComTabela();
            const { statusTemplate } = mockCapturedTabelaDinamicaProps;

            const { container } = render(statusTemplate({ status }));
            expect(container.textContent).toBe(textoEsperado);
        });

        it('dataTemplate formata a data ou exibe "-" quando ausente', async () => {
            await setupComTabela();
            const { dataTemplate } = mockCapturedTabelaDinamicaProps;

            const { container } = render(dataTemplate({ data_recebimento: '2024-03-15' }, { field: 'data_recebimento' }));
            expect(container.textContent).toBe('15/03/2024');

            const { container: containerVazio } = render(dataTemplate({}, { field: 'data_recebimento' }));
            expect(containerVazio.textContent).toBe('-');
        });

        it('nomeTemplate exibe tipo + nome da unidade ou vazio', async () => {
            await setupComTabela();
            const { nomeTemplate } = mockCapturedTabelaDinamicaProps;

            const { container } = render(nomeTemplate({ unidade_nome: 'Escola A', unidade_tipo_unidade: 'EMEF' }));
            expect(container.textContent).toBe('EMEF Escola A');

            const { container: containerVazio } = render(nomeTemplate({}));
            expect(containerVazio.textContent).toBe('');
        });

        it('seiTemplate exibe o processo SEI ou "-" quando ausente', async () => {
            await setupComTabela();
            const { seiTemplate } = mockCapturedTabelaDinamicaProps;

            const { container } = render(seiTemplate({ processo_sei: '123' }));
            expect(container.textContent).toBe('123');

            const { container: containerVazio } = render(seiTemplate({}));
            expect(containerVazio.textContent).toBe('-');
        });

        it('tecnicoTemplate exibe o valor do campo ou "-" quando ausente', async () => {
            await setupComTabela();
            const { tecnicoTemplate } = mockCapturedTabelaDinamicaProps;

            const { container } = render(tecnicoTemplate({ tecnico_atribuido: 'Fulano' }, { field: 'tecnico_atribuido' }));
            expect(container.textContent).toBe('Fulano');

            const { container: containerVazio } = render(tecnicoTemplate({}, { field: 'tecnico_atribuido' }));
            expect(containerVazio.textContent).toBe('-');
        });

        it.each([
            ['APROVADA'],
            ['APROVADA_RESSALVA'],
            ['REPROVADA'],
            ['DEVOLVIDA'],
        ])('acoesTemplate exibe link de visualizar (ícone de olho) para status %s', async (status) => {
            await setupComTabela();
            const { acoesTemplate } = mockCapturedTabelaDinamicaProps;

            const jsx = acoesTemplate(buildPrestacao({ status, uuid: 'pc-x' }));
            const { container } = render(<MemoryRouter>{jsx}</MemoryRouter>);

            const link = container.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', '/dre-detalhe-prestacao-de-contas/pc-x');
        });

        it('acoesTemplate exibe link de editar (ícone de lápis) para outros status', async () => {
            await setupComTabela();
            const { acoesTemplate } = mockCapturedTabelaDinamicaProps;

            const jsx = acoesTemplate(buildPrestacao({ status: 'EM_ANALISE', uuid: 'pc-x' }));
            const { container } = render(<MemoryRouter>{jsx}</MemoryRouter>);

            expect(container.querySelector('a')).toBeInTheDocument();
        });

        it('acoesTemplate grava a PC não apresentada no localStorage e sinaliza redirecionamento', async () => {
            await setupComTabela();
            const { acoesTemplate } = mockCapturedTabelaDinamicaProps;
            const prestacao = buildPrestacao({ status: 'NAO_APRESENTADA' });

            // Extraímos o onClick diretamente do elemento (em vez de renderizar e
            // disparar um clique DOM em outro root) — ver [[testing-patterns-general]].
            const jsx = acoesTemplate(prestacao);
            const botao = jsx.props.children;
            expect(botao.props.onClick).toBeInstanceOf(Function);

            act(() => {
                botao.props.onClick();
            });

            const salvo = JSON.parse(localStorage.getItem('prestacao_de_contas_nao_apresentada'));
            expect(salvo.associacao.uuid).toBe('assoc-1');
            expect(salvo.status).toBe('NAO_APRESENTADA');

            await waitFor(() => {
                expect(mockCapturedNavigateProps.some((p) => p.to?.pathname === '/dre-detalhe-prestacao-de-contas-nao-apresentada')).toBe(true);
            });
        });
    });
});
