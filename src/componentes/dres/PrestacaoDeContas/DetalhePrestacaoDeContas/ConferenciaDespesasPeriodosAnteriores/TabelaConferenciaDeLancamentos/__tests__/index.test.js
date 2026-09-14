import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabelaConferenciaDeLancamentos from '../index';
import { usePostMarcarComoCorreto } from '../../hooks/usePostMarcarComoCorreto';
import { usePostMarcarComoNaoCorreto } from '../../hooks/usePostMarcarComoNaoCorreto';
import { useGetDespesasPeriodosAnterioresParaConferencia } from '../../hooks/useGetDespesasPeriodosAnterioresParaConferencia';
import { ModalConfirm } from '../../../../../../Globais/Modal/ModalConfirm';
import { addDetalharAcertos, limparDetalharAcertos } from '../../../../../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/actions';

jest.mock('../../hooks/usePostMarcarComoCorreto', () => ({
    usePostMarcarComoCorreto: jest.fn(),
}));

jest.mock('../../hooks/usePostMarcarComoNaoCorreto', () => ({
    usePostMarcarComoNaoCorreto: jest.fn(),
}));

jest.mock('../../hooks/useGetDespesasPeriodosAnterioresParaConferencia', () => ({
    useGetDespesasPeriodosAnterioresParaConferencia: jest.fn(),
}));

jest.mock('../../../../../../Globais/Modal/ModalConfirm', () => ({
    ModalConfirm: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
}));

jest.mock('../../../../../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/actions', () => ({
    addDetalharAcertos: jest.fn((payload) => ({ type: 'ADD_DETALHAR_ACERTOS', payload })),
    limparDetalharAcertos: jest.fn(() => ({ type: 'LIMPAR_DETALHAR_ACERTOS' })),
}));

jest.mock('../../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useValorTemplate', () => () => (rowData) => `valor-${rowData?.uuid}`);
jest.mock('../../../../../../../hooks/Globais/useDataTemplate', () => () => (a, b, data) => `data-${data}`);
jest.mock('../../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useConferidoTemplate', () => () => (rowData) => `conferido-${rowData?.uuid}`);
jest.mock('../../../../../../../hooks/Globais/useCarregaTabelaDespesa', () => ({
    useCarregaTabelaDespesa: jest.fn(() => []),
}));
jest.mock('../../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useRowExpansionDespesaTemplate', () => () => (data) => `expansao-despesa-${data?.uuid}`);
jest.mock('../../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useNumeroDocumentoTemplate', () => () => (rowData) => `numero-doc-${rowData?.uuid}`);

let mockCapturedDataTableProps = null;
jest.mock('primereact/datatable', () => ({
    DataTable: (props) => {
        mockCapturedDataTableProps = props;
        return <div data-testid="mock-datatable">{props.children}</div>;
    },
}));

let mockCapturedColumnProps = [];
jest.mock('primereact/column', () => ({
    Column: (props) => {
        mockCapturedColumnProps.push(props);
        return <div data-testid={`mock-column-${props.field || 'selecionar'}`} />;
    },
}));

let mockCapturedFiltrosProps = null;
jest.mock('../../Filtros', () => ({
    Filtros: (props) => {
        mockCapturedFiltrosProps = props;
        return <div data-testid="mock-filtros" />;
    },
}));

let mockCapturedAcoesProps = null;
jest.mock('../Acoes', () => ({
    Acoes: (props) => {
        mockCapturedAcoesProps = props;
        return (
            <div data-testid="mock-acoes">
                <button data-testid="acoes-cancelar" onClick={props.desmarcarTodos}>Cancelar</button>
                {props.exibirBtnMarcarComoCorreto && <button data-testid="acoes-marcar-correto" onClick={props.marcarComoCorreto}>Marcar como Correto</button>}
                {props.exibirBtnMarcarComoNaoConferido && <button data-testid="acoes-marcar-nao-conferido" onClick={props.marcarComoNaoConferido}>Marcar como não conferido</button>}
                <button data-testid="acoes-detalhar" onClick={props.detalharAcertos}>Detalhar acertos</button>
            </div>
        );
    },
}));

let mockCapturedModalLegenda = null;
jest.mock('../../Modais/ModalLegendaConferenciaLancamentos', () => ({
    ModalLegendaConferenciaLancamentos: (props) => {
        mockCapturedModalLegenda = props;
        return props.show ? <div data-testid="mock-modal-legenda" /> : null;
    },
}));

jest.mock('../../../../../../Globais/TableTags', () => ({
    TableTags: () => <div data-testid="mock-table-tags" />,
}));

jest.mock('../../../../../../Globais/ModalLegendaInformacao/LegendaInformacao', () => ({
    LegendaInformacao: () => <div data-testid="mock-legenda-informacao" />,
}));

jest.mock('../../../../../../../utils/Loading', () => () => <div data-testid="mock-loading">Carregando...</div>);

const buildLancamento = (overrides = {}) => ({
    uuid: 'lanc-1',
    documento_mestre: { uuid: 'doc-1' },
    analise_lancamento: null,
    selecionado: false,
    ...overrides,
});

let mockRefetch;
let mockSetLancamentos;

const setupUseGetDespesas = (lancamentos = [], overrides = {}) => {
    useGetDespesasPeriodosAnterioresParaConferencia.mockImplementation((setLancamentosParaConferencia) => {
        mockSetLancamentos = setLancamentosParaConferencia;
        return {
            isLoading: false,
            isFetching: false,
            refetch: mockRefetch,
            ...overrides,
        };
    });
};

const baseProps = {
    contaUUID: 'conta-1',
    prestacaoDeContas: { uuid: 'pc-1', analise_atual: { uuid: 'analise-1' } },
    editavel: true,
    filters: { paginacao_atual: 0, ordenar_por_imposto: false, ordenamento_tabela_lancamentos: [] },
    onChangeFilters: jest.fn(),
};

const renderComponent = (overrideProps = {}) =>
    render(<TabelaConferenciaDeLancamentos {...baseProps} {...overrideProps} />);

const carregarLancamentos = (lancamentos) => {
    act(() => {
        mockSetLancamentos(lancamentos);
    });
};

// O checkbox de seleção da linha vem de body={selecionarTemplate}; extraímos o onChange
// diretamente do elemento retornado (evita montar em um root React separado — ver
// [[coverage-prestacaodecontas-dres-detalhe]] / [[testing-patterns-general]]).
const marcarCheckboxDoLancamento = (lancamento, checked = true) => {
    const selecionarTemplate = mockCapturedColumnProps.filter((c) => !c.field && c.body).pop().body;
    const inputElement = selecionarTemplate(lancamento).props.children;
    act(() => {
        inputElement.props.onChange({ target: { checked } });
    });
};

const clicarItemMenuSelecionarHeader = (index) => {
    const header = mockCapturedColumnProps.filter((c) => !c.field && c.header).pop().header;
    const dropdownMenu = header.props.children.props.children[1];
    const item = dropdownMenu.props.children[index];
    act(() => {
        item.props.onClick({ preventDefault: () => {} });
    });
};

describe('ConferenciaDespesasPeriodosAnteriores/TabelaConferenciaDeLancamentos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedDataTableProps = null;
        mockCapturedColumnProps = [];
        mockCapturedFiltrosProps = null;
        mockCapturedAcoesProps = null;
        mockCapturedModalLegenda = null;
        mockRefetch = jest.fn();
        mockSetLancamentos = null;

        setupUseGetDespesas();
        usePostMarcarComoCorreto.mockReturnValue({ mutationPostMarcarComoCorreto: { mutate: jest.fn() } });
        usePostMarcarComoNaoCorreto.mockReturnValue({ mutationPostMarcarComoNaoCorreto: { mutate: jest.fn() } });
    });

    it('exibe o Loading enquanto os dados estão carregando/buscando', () => {
        setupUseGetDespesas([], { isLoading: true });
        renderComponent();

        expect(screen.getByTestId('mock-loading')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-datatable')).not.toBeInTheDocument();
    });

    it('exibe o Loading quando isFetching é true mesmo com isLoading false', () => {
        setupUseGetDespesas([], { isFetching: true });
        renderComponent();

        expect(screen.getByTestId('mock-loading')).toBeInTheDocument();
    });

    it('renderiza a tabela e o total de lançamentos quando carregados', () => {
        renderComponent();
        carregarLancamentos([buildLancamento(), buildLancamento({ uuid: 'lanc-2', documento_mestre: { uuid: 'doc-2' } })]);

        expect(screen.getByTestId('mock-datatable')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByLabelText(/Ordenar com imposto/)).toBeInTheDocument();
    });

    it('não exibe o checkbox de ordenar por imposto quando não há lançamentos', () => {
        renderComponent();
        carregarLancamentos([]);

        expect(screen.queryByLabelText(/Ordenar com imposto/)).not.toBeInTheDocument();
    });

    it('refaz a busca quando os filtros mudam (exceto na primeira renderização)', () => {
        const { rerender } = renderComponent();
        expect(mockRefetch).not.toHaveBeenCalled();

        rerender(<TabelaConferenciaDeLancamentos {...baseProps} filters={{ ...baseProps.filters, filtrar_por_lancamento: 'abc' }} />);

        expect(mockRefetch).toHaveBeenCalled();
    });

    it('seleciona um lançamento ao marcar o checkbox e exibe as ações', () => {
        renderComponent();
        const lancamento = buildLancamento();
        carregarLancamentos([lancamento]);

        marcarCheckboxDoLancamento(lancamento);

        expect(screen.getByTestId('mock-acoes')).toBeInTheDocument();
        expect(mockCapturedAcoesProps.totalLancamentosSelecionados).toBe(1);
    });

    it('não altera a seleção quando editavel é falso', () => {
        renderComponent({ editavel: false });
        const lancamento = buildLancamento();
        carregarLancamentos([lancamento]);

        marcarCheckboxDoLancamento(lancamento);

        expect(screen.queryByTestId('mock-acoes')).not.toBeInTheDocument();
    });

    it('seleciona todos não conferidos, corretos, com ajuste e desmarca todos pelo menu do cabeçalho', () => {
        renderComponent();
        carregarLancamentos([
            buildLancamento(),
            buildLancamento({ uuid: 'lanc-correto', documento_mestre: { uuid: 'doc-correto' }, analise_lancamento: { resultado: 'CORRETO' } }),
            buildLancamento({ uuid: 'lanc-ajuste', documento_mestre: { uuid: 'doc-ajuste' }, analise_lancamento: { resultado: 'AJUSTE' } }),
        ]);

        clicarItemMenuSelecionarHeader(2); // não conferidos
        expect(mockCapturedAcoesProps.totalLancamentosSelecionados).toBe(1);

        clicarItemMenuSelecionarHeader(0); // corretos
        expect(mockCapturedAcoesProps.totalLancamentosSelecionados).toBe(1);

        clicarItemMenuSelecionarHeader(1); // ajuste
        expect(mockCapturedAcoesProps.totalLancamentosSelecionados).toBe(1);

        clicarItemMenuSelecionarHeader(3); // desmarcar todos
        expect(screen.queryByTestId('mock-acoes')).not.toBeInTheDocument();
    });

    it('marca os lançamentos selecionados como corretos', () => {
        const mutate = jest.fn();
        usePostMarcarComoCorreto.mockReturnValue({ mutationPostMarcarComoCorreto: { mutate } });
        renderComponent();
        const lancamento = buildLancamento();
        carregarLancamentos([lancamento]);
        marcarCheckboxDoLancamento(lancamento);

        fireEvent.click(screen.getByTestId('acoes-marcar-correto'));

        expect(mutate).toHaveBeenCalledWith({
            prestacaoDeContasUUID: 'pc-1',
            payload: {
                analise_prestacao: 'analise-1',
                lancamentos_corretos: [{ tipo_lancamento: 'GASTO', lancamento: 'doc-1' }],
            },
        });
    });

    it('marca os lançamentos selecionados (já corretos) como não conferidos', () => {
        const mutate = jest.fn();
        usePostMarcarComoNaoCorreto.mockReturnValue({ mutationPostMarcarComoNaoCorreto: { mutate } });
        renderComponent();
        const lancamento = buildLancamento({ analise_lancamento: { resultado: 'CORRETO' } });
        carregarLancamentos([lancamento]);
        marcarCheckboxDoLancamento(lancamento);

        fireEvent.click(screen.getByTestId('acoes-marcar-nao-conferido'));

        expect(mutate).toHaveBeenCalledWith({
            prestacaoDeContasUUID: 'pc-1',
            payload: {
                analise_prestacao: 'analise-1',
                lancamentos_nao_conferidos: [{ tipo_lancamento: 'GASTO', lancamento: 'doc-1' }],
            },
        });
    });

    it('bloqueia a seleção de um lançamento com status incompatível e chama ModalConfirm', () => {
        renderComponent();
        const lancamentoCorreto = buildLancamento({ analise_lancamento: { resultado: 'CORRETO' } });
        const lancamentoAjuste = buildLancamento({ uuid: 'lanc-ajuste', documento_mestre: { uuid: 'doc-ajuste' }, analise_lancamento: { resultado: 'AJUSTE' } });
        carregarLancamentos([lancamentoCorreto, lancamentoAjuste]);

        marcarCheckboxDoLancamento(lancamentoCorreto);
        marcarCheckboxDoLancamento(lancamentoAjuste);

        expect(ModalConfirm).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Seleção não permitida', dispatch: mockDispatch })
        );
        expect(mockCapturedAcoesProps.totalLancamentosSelecionados).toBe(1);
    });

    it('permite marcar um lançamento com status compatível ao já selecionado (a seleção via checkbox é sempre de um único item)', () => {
        // Diferente da TabelaConferenciaDeLancamentos "irmã": aqui tratarSelecionado()
        // sempre reconstrói a seleção com base em um único item (o clicado), então
        // clicar em um segundo checkbox substitui a seleção em vez de acumulá-la — mas
        // ainda passa pela checagem de compatibilidade de verificaSePodeSerCheckado.
        renderComponent();
        const lancamentoAjuste = buildLancamento({ analise_lancamento: { resultado: 'AJUSTE' } });
        const lancamentoNaoConferido = buildLancamento({ uuid: 'lanc-2', documento_mestre: { uuid: 'doc-2' } });
        carregarLancamentos([lancamentoAjuste, lancamentoNaoConferido]);

        marcarCheckboxDoLancamento(lancamentoAjuste);
        marcarCheckboxDoLancamento(lancamentoNaoConferido);

        expect(ModalConfirm).not.toHaveBeenCalled();
        expect(mockCapturedAcoesProps.totalLancamentosSelecionados).toBe(1);
    });

    it('detalha acertos navegando para a página de detalhe com o estado de despesas de períodos anteriores', () => {
        renderComponent();
        const lancamento = buildLancamento();
        carregarLancamentos([lancamento]);
        marcarCheckboxDoLancamento(lancamento);

        fireEvent.click(screen.getByTestId('acoes-detalhar'));

        expect(limparDetalharAcertos).toHaveBeenCalled();
        expect(addDetalharAcertos).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(
            '/dre-detalhe-prestacao-de-contas-detalhar-acertos/pc-1',
            { replace: true, state: { aplicavel_despesas_periodos_anteriores: true } }
        );
    });

    it('redireciona ao clicar em uma linha quando editável', () => {
        renderComponent();
        carregarLancamentos([buildLancamento()]);

        act(() => {
            mockCapturedDataTableProps.onRowClick({ data: buildLancamento() });
        });

        expect(mockNavigate).toHaveBeenCalled();
    });

    it('não redireciona ao clicar em uma linha quando não editável', () => {
        renderComponent({ editavel: false });
        carregarLancamentos([buildLancamento()]);

        act(() => {
            mockCapturedDataTableProps.onRowClick({ data: buildLancamento() });
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('paginação e ordenação notificam onChangeFilters', () => {
        const onChangeFilters = jest.fn();
        renderComponent({ onChangeFilters });
        carregarLancamentos([buildLancamento()]);

        act(() => {
            mockCapturedDataTableProps.onPage({ first: 10, rows: 10, page: 1 });
        });
        expect(onChangeFilters).toHaveBeenCalledWith({ paginacao_atual: 10 });

        act(() => {
            mockCapturedDataTableProps.onSort({ multiSortMeta: [{ field: 'data', order: 1 }] });
        });
        expect(onChangeFilters).toHaveBeenCalledWith({ ordenamento_tabela_lancamentos: [{ field: 'data', order: 1 }] });
    });

    it('alterna o checkbox de ordenar por imposto e notifica onChangeFilters', () => {
        const onChangeFilters = jest.fn();
        renderComponent({ onChangeFilters });
        carregarLancamentos([buildLancamento()]);

        fireEvent.click(screen.getByLabelText(/Ordenar com imposto/));

        expect(onChangeFilters).toHaveBeenCalledWith({ ordenar_por_imposto: true });
    });

    it('sincroniza a paginação e o checkbox de imposto quando os filtros externos mudam', () => {
        const { rerender } = renderComponent();
        carregarLancamentos([buildLancamento()]);

        rerender(
            <TabelaConferenciaDeLancamentos
                {...baseProps}
                filters={{ paginacao_atual: 20, ordenar_por_imposto: true, ordenamento_tabela_lancamentos: [] }}
            />
        );

        expect(screen.getByLabelText(/Ordenar com imposto/)).toBeChecked();
    });

    it('abre e fecha o modal de legenda', () => {
        renderComponent();
        carregarLancamentos([buildLancamento()]);

        fireEvent.click(screen.getByText('Legenda conferência'));
        expect(screen.getByTestId('mock-modal-legenda')).toBeInTheDocument();

        act(() => {
            mockCapturedModalLegenda.primeiroBotaoOnclick();
        });
        expect(screen.queryByTestId('mock-modal-legenda')).not.toBeInTheDocument();
    });

    it('exibe as tags de informações do lançamento na coluna Informações', () => {
        renderComponent();
        const lancamento = buildLancamento();
        carregarLancamentos([lancamento]);

        const informacoesTemplate = mockCapturedColumnProps.find((c) => c.field === 'informacoes').body;
        render(informacoesTemplate(lancamento));

        expect(screen.getByTestId('mock-table-tags')).toBeInTheDocument();
    });

    it('marca a linha de um lançamento já conferido corretamente com a classe correspondente', () => {
        renderComponent();
        carregarLancamentos([buildLancamento()]);

        const rowClassNameFn = mockCapturedDataTableProps.rowClassName;
        expect(rowClassNameFn({ analise_lancamento: { resultado: 'CORRETO' } })).toEqual({
            'linha-conferencia-de-lancamentos-correto': true,
        });
        expect(rowClassNameFn({})).toBeUndefined();
    });

    it('expande a linha usando o template de despesa', () => {
        renderComponent();
        carregarLancamentos([buildLancamento()]);

        const rowExpansionTemplate = mockCapturedDataTableProps.rowExpansionTemplate;
        expect(rowExpansionTemplate({ uuid: 'x' })).toBe('expansao-despesa-x');
    });

    it('controla a expansão de linhas via onRowToggle', () => {
        renderComponent();
        carregarLancamentos([buildLancamento()]);

        act(() => {
            mockCapturedDataTableProps.onRowToggle({ data: { 'lanc-1': true } });
        });

        expect(mockCapturedDataTableProps.expandedRows).toEqual({ 'lanc-1': true });
    });

    it('não renderiza a tabela quando o filtro paginado passado via Filtros muda', () => {
        renderComponent();
        expect(mockCapturedFiltrosProps.filters).toEqual(baseProps.filters);

        act(() => {
            mockCapturedFiltrosProps.onChangeFiltersState({ paginacao_atual: 5 });
        });
        expect(baseProps.onChangeFilters).toHaveBeenCalledWith({ paginacao_atual: 5 });
    });
});
