import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabelaConferenciaDeLancamentos from '../TabelaConferenciaDeLancamentos';
import {
    postLancamentosParaConferenciaMarcarComoCorreto,
    postLancamentosParaConferenciaMarcarNaoConferido,
} from '../../../../../../services/dres/PrestacaoDeContas.service';
import { mantemEstadoAcompanhamentoDePc } from '../../../../../../services/mantemEstadoAcompanhamentoDePc.service';
import { visoesService } from '../../../../../../services/visoes.service';
import { addDetalharAcertos, limparDetalharAcertos } from '../../../../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/actions';

jest.mock('../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    postLancamentosParaConferenciaMarcarComoCorreto: jest.fn(),
    postLancamentosParaConferenciaMarcarNaoConferido: jest.fn(),
}));

jest.mock('../../../../../../services/mantemEstadoAcompanhamentoDePc.service', () => ({
    mantemEstadoAcompanhamentoDePc: {
        getAcompanhamentoDePcUsuarioLogado: jest.fn(),
        setAcompanhamentoDePcPorUsuario: jest.fn(),
        setOrdenamentoTabelaLancamentos: jest.fn(),
    },
}));

jest.mock('../../../../../../services/visoes.service', () => ({
    visoesService: {
        getUsuarioLogin: jest.fn(() => 'usuario-1'),
    },
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

jest.mock('../../../../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/actions', () => ({
    addDetalharAcertos: jest.fn((payload) => ({ type: 'ADD_DETALHAR_ACERTOS', payload })),
    limparDetalharAcertos: jest.fn(() => ({ type: 'LIMPAR_DETALHAR_ACERTOS' })),
}));

jest.mock('../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useValorTemplate', () => () => (rowData) => `valor-${rowData?.uuid}`);
jest.mock('../../../../../../hooks/Globais/useDataTemplate', () => () => (a, b, data) => `data-${data}`);
jest.mock('../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useConferidoTemplate', () => () => (rowData) => `conferido-${rowData?.uuid}`);
jest.mock('../../../../../../hooks/Globais/useCarregaTabelaDespesa', () => ({
    useCarregaTabelaDespesa: jest.fn(() => []),
}));
jest.mock('../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useRowExpansionDespesaTemplate', () => () => (data) => `expansao-despesa-${data?.uuid}`);
jest.mock('../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useRowExpansionReceitaTemplate', () => () => (data) => `expansao-receita-${data?.uuid}`);
jest.mock('../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useNumeroDocumentoTemplate', () => () => (rowData) => `numero-doc-${rowData?.uuid}`);

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
jest.mock('../Filtros', () => ({
    Filtros: (props) => {
        mockCapturedFiltrosProps = props;
        return <div data-testid="mock-filtros" />;
    },
}));

let mockCapturedModalCheck = null;
jest.mock('../Modais/ModalCheckNaoPermitidoConfererenciaDeLancamentos', () => ({
    ModalCheckNaoPermitidoConfererenciaDeLancamentos: (props) => {
        mockCapturedModalCheck = props;
        return props.show ? <div data-testid="mock-modal-check">{props.texto}</div> : null;
    },
}));

let mockCapturedModalLegenda = null;
jest.mock('../Modais/ModalLegendaConferenciaLancamentos', () => ({
    ModalLegendaConferenciaLancamentos: (props) => {
        mockCapturedModalLegenda = props;
        return props.show ? <div data-testid="mock-modal-legenda" /> : null;
    },
}));

jest.mock('../../../../../Globais/TableTags', () => ({
    TableTags: () => <div data-testid="mock-table-tags" />,
}));

jest.mock('../../../../../Globais/ModalLegendaInformacao/LegendaInformacao', () => ({
    LegendaInformacao: () => <div data-testid="mock-legenda-informacao" />,
}));

const acompanhamentoPadrao = {
    conferencia_de_lancamentos: {
        conta_uuid: 'conta-1',
        filtrar_por_acao: '',
        filtrar_por_lancamento: '',
        paginacao_atual: 0,
        filtrar_por_data_inicio: '',
        filtrar_por_data_fim: '',
        filtrar_por_nome_fornecedor: '',
        filtrar_por_numero_de_documento: '',
        filtrar_por_tipo_de_documento: '',
        filtrar_por_tipo_de_pagamento: '',
        filtrar_por_informacao: [],
        filtrar_por_conferencia: [],
        ordenamento_tabela_lancamentos: [],
    },
};

const buildLancamento = (overrides = {}) => ({
    uuid: 'lanc-1',
    tipo_transacao: 'Gasto',
    documento_mestre: { uuid: 'doc-1' },
    analise_lancamento: null,
    is_repasse: false,
    selecionado: false,
    ...overrides,
});

const baseProps = {
    setLancamentosParaConferencia: jest.fn(),
    lancamentosParaConferencia: [],
    contaUuid: 'conta-1',
    carregaLancamentosParaConferencia: jest.fn(),
    prestacaoDeContas: { uuid: 'pc-1', analise_atual: { uuid: 'analise-1' } },
    editavel: true,
    handleChangeCheckBoxOrdenarPorImposto: jest.fn(),
    stateCheckBoxOrdenarPorImposto: false,
    setStateCheckBoxOrdenarPorImposto: jest.fn(),
};

const renderComponent = (overrideProps = {}) =>
    render(<TabelaConferenciaDeLancamentos {...baseProps} {...overrideProps} />);

// Renderiza um trecho de JSX (ex.: o retorno de um `body`/`header` de Column)
// em um container isolado, para não colidir com os elementos já montados
// pelo `renderComponent` principal (getByRole/getByText por padrão buscam em
// todo o document.body).
const renderIsolado = (node) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    return render(node, { container, baseElement: container });
};

// O checkbox de seleção da linha é renderizado a partir de `body={selecionarTemplate}`
// (chamado pelo mock da Column, que não invoca de fato o PrimeReact). Extraímos o
// onChange diretamente do elemento JSX retornado e chamamos dentro de act() — evita
// tanto o problema de "múltiplos checkboxes" (a página real também tem o checkbox de
// ordenar por imposto) quanto o problema de atualização de estado entre roots do React
// (ver [[testing-patterns-general]]) que ocorreria ao montar esse elemento isoladamente
// e disparar um evento DOM nele.
const marcarCheckboxDoLancamento = (lancamento, checked = true) => {
    const selecionarTemplate = mockCapturedColumnProps.filter((c) => !c.field && c.body).pop().body;
    const inputElement = selecionarTemplate(lancamento).props.children;
    act(() => {
        inputElement.props.onChange({ target: { checked } });
    });
};

// Mesma lógica para os itens do menu (Dropdown) do cabeçalho da coluna de seleção:
// header={selecionarHeader()} já é o elemento JSX (a função é chamada no próprio JSX
// do componente), então extraímos o onClick do Dropdown.Item pelo índice.
const clicarItemMenuSelecionarHeader = (index) => {
    const header = mockCapturedColumnProps.filter((c) => !c.field && c.header).pop().header;
    const dropdownMenu = header.props.children.props.children[1];
    const item = dropdownMenu.props.children[index];
    act(() => {
        item.props.onClick({ preventDefault: () => {} });
    });
};

describe('TabelaConferenciaDeLancamentos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedDataTableProps = null;
        mockCapturedColumnProps = [];
        mockCapturedFiltrosProps = null;
        mockCapturedModalCheck = null;
        mockCapturedModalLegenda = null;
        mantemEstadoAcompanhamentoDePc.getAcompanhamentoDePcUsuarioLogado.mockReturnValue(acompanhamentoPadrao);
        visoesService.getUsuarioLogin.mockReturnValue('usuario-1');
        postLancamentosParaConferenciaMarcarComoCorreto.mockResolvedValue({});
        postLancamentosParaConferenciaMarcarNaoConferido.mockResolvedValue({});
    });

    it('renderiza os filtros e a mensagem de quantidade quando não há lançamentos', () => {
        renderComponent({ lancamentosParaConferencia: [] });

        expect(screen.getByTestId('mock-filtros')).toBeInTheDocument();
        expect(screen.getByText(/Exibindo/)).toBeInTheDocument();
        expect(screen.queryByTestId('mock-datatable')).not.toBeInTheDocument();
    });

    it('renderiza a tabela e o checkbox de ordenar por imposto quando há lançamentos', () => {
        renderComponent({ lancamentosParaConferencia: [buildLancamento()] });

        expect(screen.getByTestId('mock-datatable')).toBeInTheDocument();
        expect(screen.getByLabelText(/Ordenar com imposto/)).toBeInTheDocument();
    });

    it('desmarca todos os lançamentos quando contaUuid muda', () => {
        const setLancamentosParaConferencia = jest.fn();
        const { rerender } = render(
            <TabelaConferenciaDeLancamentos
                {...baseProps}
                lancamentosParaConferencia={[buildLancamento({ selecionado: true })]}
                setLancamentosParaConferencia={setLancamentosParaConferencia}
                contaUuid="conta-1"
            />
        );
        setLancamentosParaConferencia.mockClear();

        rerender(
            <TabelaConferenciaDeLancamentos
                {...baseProps}
                lancamentosParaConferencia={[buildLancamento({ selecionado: true })]}
                setLancamentosParaConferencia={setLancamentosParaConferencia}
                contaUuid="conta-2"
            />
        );

        expect(setLancamentosParaConferencia).toHaveBeenCalledWith([
            expect.objectContaining({ selecionado: false }),
        ]);
    });

    it('seleciona um lançamento ao marcar o checkbox da linha e exibe a barra de seleção', () => {
        const setLancamentosParaConferencia = jest.fn();
        const lancamento = buildLancamento();
        renderComponent({ lancamentosParaConferencia: [lancamento], setLancamentosParaConferencia });

        marcarCheckboxDoLancamento(lancamento);

        expect(setLancamentosParaConferencia).toHaveBeenCalledWith([
            expect.objectContaining({ selecionado: true }),
        ]);
    });

    it('não altera a seleção quando editavel é falso', () => {
        const setLancamentosParaConferencia = jest.fn();
        const lancamento = buildLancamento();
        renderComponent({ lancamentosParaConferencia: [lancamento], setLancamentosParaConferencia, editavel: false });
        setLancamentosParaConferencia.mockClear(); // limpa a chamada feita pelo desmarcarTodos() do mount

        marcarCheckboxDoLancamento(lancamento);

        expect(setLancamentosParaConferencia).not.toHaveBeenCalled();
    });

    it('exibe a barra de seleção e permite selecionar todos não conferidos / cancelar pelo menu do cabeçalho', () => {
        const setLancamentosParaConferencia = jest.fn();
        renderComponent({
            lancamentosParaConferencia: [buildLancamento({ selecionado: true }), buildLancamento({ uuid: 'lanc-2', documento_mestre: { uuid: 'doc-2' }, selecionado: false })],
            setLancamentosParaConferencia,
        });

        // desmarcarTodos() roda também no mount (useEffect[contaUuid]); limpamos antes
        // de cada verificação para focar apenas na chamada disparada pelo clique.
        setLancamentosParaConferencia.mockClear();
        clicarItemMenuSelecionarHeader(2); // "Selecionar todos não conferidos" (status = null)
        expect(setLancamentosParaConferencia).toHaveBeenCalled();

        setLancamentosParaConferencia.mockClear();
        clicarItemMenuSelecionarHeader(0); // "Selecionar todos corretos"
        expect(setLancamentosParaConferencia).toHaveBeenCalled();

        setLancamentosParaConferencia.mockClear();
        clicarItemMenuSelecionarHeader(1); // "Selecionar todos com solicitação de ajuste"
        expect(setLancamentosParaConferencia).toHaveBeenCalled();

        setLancamentosParaConferencia.mockClear();
        clicarItemMenuSelecionarHeader(3); // "Desmarcar todos"
        expect(setLancamentosParaConferencia).toHaveBeenCalled();
    });

    it('marca como correto os lançamentos selecionados e recarrega a lista', async () => {
        const setLancamentosParaConferencia = jest.fn();
        const carregaLancamentosParaConferencia = jest.fn();
        const lancamento = buildLancamento({ selecionado: true });
        renderComponent({
            lancamentosParaConferencia: [lancamento],
            setLancamentosParaConferencia,
            carregaLancamentosParaConferencia,
        });

        marcarCheckboxDoLancamento(lancamento);

        const botaoMarcarComoCorreto = screen.getByText('Marcar como Correto');
        await act(async () => {
            fireEvent.click(botaoMarcarComoCorreto);
        });

        expect(postLancamentosParaConferenciaMarcarComoCorreto).toHaveBeenCalledWith(
            'pc-1',
            expect.objectContaining({ analise_prestacao: 'analise-1' })
        );
        expect(carregaLancamentosParaConferencia).toHaveBeenCalled();
    });

    it('trata erro ao marcar como correto', async () => {
        postLancamentosParaConferenciaMarcarComoCorreto.mockRejectedValue(new Error('falhou'));
        const lancamento = buildLancamento({ selecionado: true });
        renderComponent({ lancamentosParaConferencia: [lancamento] });

        marcarCheckboxDoLancamento(lancamento);

        await act(async () => {
            fireEvent.click(screen.getByText('Marcar como Correto'));
        });

        expect(postLancamentosParaConferenciaMarcarComoCorreto).toHaveBeenCalled();
    });

    it('marca como não conferido um lançamento já correto (via seleção do checkbox de um item CORRETO)', async () => {
        const carregaLancamentosParaConferencia = jest.fn();
        const lancamento = buildLancamento({ selecionado: true, analise_lancamento: { resultado: 'CORRETO' } });
        renderComponent({
            lancamentosParaConferencia: [lancamento],
            carregaLancamentosParaConferencia,
        });

        marcarCheckboxDoLancamento(lancamento);

        await act(async () => {
            fireEvent.click(screen.getByText('Marcar como não conferido'));
        });

        expect(postLancamentosParaConferenciaMarcarNaoConferido).toHaveBeenCalledWith(
            'pc-1',
            expect.objectContaining({ analise_prestacao: 'analise-1' })
        );
        expect(carregaLancamentosParaConferencia).toHaveBeenCalled();
    });

    it('trata erro ao marcar como não conferido', async () => {
        postLancamentosParaConferenciaMarcarNaoConferido.mockRejectedValue(new Error('falhou'));
        const lancamento = buildLancamento({ selecionado: true, analise_lancamento: { resultado: 'CORRETO' } });
        renderComponent({ lancamentosParaConferencia: [lancamento] });

        marcarCheckboxDoLancamento(lancamento);

        await act(async () => {
            fireEvent.click(screen.getByText('Marcar como não conferido'));
        });

        expect(postLancamentosParaConferenciaMarcarNaoConferido).toHaveBeenCalled();
    });

    it('detalha acertos dos lançamentos selecionados navegando para a página de detalhe', async () => {
        const lancamento = buildLancamento({ selecionado: true });
        renderComponent({ lancamentosParaConferencia: [lancamento], prestacaoDeContas: { uuid: 'pc-1', analise_atual: { uuid: 'analise-1' } } });

        marcarCheckboxDoLancamento(lancamento);

        await act(async () => {
            fireEvent.click(screen.getByText('Detalhar acertos'));
        });

        expect(limparDetalharAcertos).toHaveBeenCalled();
        expect(addDetalharAcertos).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/dre-detalhe-prestacao-de-contas-detalhar-acertos/pc-1');
    });

    it('redireciona ao clicar em uma linha quando editável', () => {
        renderComponent({ lancamentosParaConferencia: [buildLancamento()] });

        act(() => {
            mockCapturedDataTableProps.onRowClick({ data: buildLancamento() });
        });

        expect(limparDetalharAcertos).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/dre-detalhe-prestacao-de-contas-detalhar-acertos/pc-1');
    });

    it('não redireciona ao clicar em uma linha quando não editável', () => {
        renderComponent({ lancamentosParaConferencia: [buildLancamento()], editavel: false });

        act(() => {
            mockCapturedDataTableProps.onRowClick({ data: buildLancamento() });
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('bloqueia a seleção conjunta de um lançamento de repasse com outros já selecionados', () => {
        // A `desmarcarTodos()` do mount() muta os objetos originais (Object.assign) e
        // o setLancamentosParaConferencia mockado não realimenta a prop — por isso a
        // seleção "já selecionada" precisa ser feita de fato via checkbox após o mount,
        // em vez de vir pronta no fixture (que seria desfeita pelo efeito de mount).
        const lancamentoRepasse = buildLancamento({ uuid: 'lanc-repasse', documento_mestre: { uuid: 'doc-repasse' }, is_repasse: true });
        const lancamentoNormal = buildLancamento({ uuid: 'lanc-normal', documento_mestre: { uuid: 'doc-normal' } });
        renderComponent({ lancamentosParaConferencia: [lancamentoRepasse, lancamentoNormal] });

        marcarCheckboxDoLancamento(lancamentoNormal);
        marcarCheckboxDoLancamento(lancamentoRepasse);

        expect(screen.getByTestId('mock-modal-check')).toBeInTheDocument();
    });

    it('bloqueia a seleção de um lançamento com status incompatível com o já selecionado', () => {
        const lancamentoCorreto = buildLancamento({ uuid: 'lanc-correto', documento_mestre: { uuid: 'doc-correto' }, analise_lancamento: { resultado: 'CORRETO' } });
        const lancamentoAjuste = buildLancamento({ uuid: 'lanc-ajuste', documento_mestre: { uuid: 'doc-ajuste' }, analise_lancamento: { resultado: 'AJUSTE' } });
        renderComponent({ lancamentosParaConferencia: [lancamentoCorreto, lancamentoAjuste] });

        marcarCheckboxDoLancamento(lancamentoCorreto);
        marcarCheckboxDoLancamento(lancamentoAjuste);

        expect(screen.getByTestId('mock-modal-check')).toBeInTheDocument();
    });

    it('permite desmarcar um lançamento já selecionado mesmo quando incompatível seria bloqueado para marcar', () => {
        const setLancamentosParaConferencia = jest.fn();
        const lancamento = buildLancamento({ selecionado: true });
        renderComponent({ lancamentosParaConferencia: [lancamento], setLancamentosParaConferencia });
        setLancamentosParaConferencia.mockClear();

        marcarCheckboxDoLancamento(lancamento, false);

        expect(setLancamentosParaConferencia).toHaveBeenCalled();
    });

    it('fecha o modal de seleção não permitida', () => {
        const lancamentoRepasse = buildLancamento({ uuid: 'lanc-repasse', documento_mestre: { uuid: 'doc-repasse' }, is_repasse: true });
        const lancamentoNormal = buildLancamento({ uuid: 'lanc-normal', documento_mestre: { uuid: 'doc-normal' } });
        renderComponent({ lancamentosParaConferencia: [lancamentoRepasse, lancamentoNormal] });

        marcarCheckboxDoLancamento(lancamentoNormal);
        marcarCheckboxDoLancamento(lancamentoRepasse);
        expect(screen.getByTestId('mock-modal-check')).toBeInTheDocument();

        act(() => {
            mockCapturedModalCheck.handleClose();
        });

        expect(screen.queryByTestId('mock-modal-check')).not.toBeInTheDocument();
    });

    it('abre e fecha o modal de legenda', () => {
        renderComponent({ lancamentosParaConferencia: [buildLancamento()] });

        act(() => {
            screen.getByText('Legenda conferência').click();
        });
        expect(screen.getByTestId('mock-modal-legenda')).toBeInTheDocument();

        act(() => {
            mockCapturedModalLegenda.primeiroBotaoOnclick();
        });
        expect(screen.queryByTestId('mock-modal-legenda')).not.toBeInTheDocument();
    });

    it('aplica os filtros e recarrega a lista', async () => {
        const carregaLancamentosParaConferencia = jest.fn();
        renderComponent({ carregaLancamentosParaConferencia });

        await act(async () => {
            await mockCapturedFiltrosProps.handleSubmitFiltros();
        });

        expect(carregaLancamentosParaConferencia).toHaveBeenCalled();
    });

    it('limpa os filtros e recarrega a lista', async () => {
        const carregaLancamentosParaConferencia = jest.fn();
        renderComponent({ carregaLancamentosParaConferencia });

        await act(async () => {
            await mockCapturedFiltrosProps.limpaFiltros();
        });

        expect(carregaLancamentosParaConferencia).toHaveBeenCalledWith(expect.anything(), expect.anything(), null, null, 0);
    });

    it('atualiza os filtros individuais, de data, de informações e de conferência', () => {
        renderComponent();

        act(() => {
            mockCapturedFiltrosProps.handleChangeFiltros('filtrar_por_lancamento', 'abc');
        });
        expect(mockCapturedFiltrosProps.stateFiltros.filtrar_por_lancamento).toBe('abc');

        act(() => {
            mockCapturedFiltrosProps.handleClearDate();
        });
        expect(mockCapturedFiltrosProps.stateFiltros.filtrar_por_data_inicio).toBe('');

        act(() => {
            mockCapturedFiltrosProps.handleChangeFiltroInformacoes(['tag-1']);
        });
        expect(mockCapturedFiltrosProps.stateFiltros.filtrar_por_informacoes).toEqual(['tag-1']);

        act(() => {
            mockCapturedFiltrosProps.handleChangeFiltroConferencia(['CORRETO']);
        });
        expect(mockCapturedFiltrosProps.stateFiltros.filtrar_por_conferencia).toEqual(['CORRETO']);
    });

    it('paginação salva a página atual no localStorage do usuário', () => {
        renderComponent({ lancamentosParaConferencia: [buildLancamento()] });

        act(() => {
            mockCapturedDataTableProps.onPage({ first: 10, rows: 10, page: 1 });
        });

        expect(mantemEstadoAcompanhamentoDePc.setAcompanhamentoDePcPorUsuario).toHaveBeenCalledWith(
            'usuario-1',
            expect.objectContaining({ prestacao_de_conta_uuid: 'pc-1' })
        );
    });

    it('ordenação salva o critério de ordenação', () => {
        renderComponent({ lancamentosParaConferencia: [buildLancamento()] });

        act(() => {
            mockCapturedDataTableProps.onSort({ multiSortMeta: [{ field: 'data', order: 1 }] });
        });

        expect(mantemEstadoAcompanhamentoDePc.setOrdenamentoTabelaLancamentos).toHaveBeenCalledWith(
            'usuario-1',
            [{ field: 'data', order: 1 }]
        );
    });

    it('exibe tooltip de estorno vinculado para lançamentos de crédito com rateio estornado (data do documento)', () => {
        const lancamentoCredito = buildLancamento({
            tipo_transacao: 'Crédito',
            documento_mestre: {
                uuid: 'doc-credito',
                rateio_estornado: { uuid: 'rateio-1', data_documento: '2024-01-01' },
            },
        });
        renderComponent({ lancamentosParaConferencia: [lancamentoCredito] });

        const tipoTemplate = mockCapturedColumnProps.find((c) => c.field === 'tipo_transacao').body;
        const { container } = renderIsolado(<>{tipoTemplate(lancamentoCredito)}</>);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('exibe tooltip de estorno vinculado usando a data da transação quando não há data do documento', () => {
        const lancamentoCredito = buildLancamento({
            tipo_transacao: 'Crédito',
            documento_mestre: {
                uuid: 'doc-credito-2',
                rateio_estornado: { uuid: 'rateio-2', data_transacao: '2024-02-01' },
            },
        });
        renderComponent({ lancamentosParaConferencia: [lancamentoCredito] });

        const tipoTemplate = mockCapturedColumnProps.find((c) => c.field === 'tipo_transacao').body;
        const { container } = renderIsolado(<>{tipoTemplate(lancamentoCredito)}</>);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('exibe apenas o texto do tipo de transação de crédito sem rateio estornado', () => {
        const lancamentoCredito = buildLancamento({ tipo_transacao: 'Crédito', documento_mestre: { uuid: 'doc-credito-3' } });
        renderComponent({ lancamentosParaConferencia: [lancamentoCredito] });

        const tipoTemplate = mockCapturedColumnProps.find((c) => c.field === 'tipo_transacao').body;
        const { getByText } = renderIsolado(<>{tipoTemplate(lancamentoCredito)}</>);
        expect(getByText('Crédito')).toBeInTheDocument();
    });

    it('exibe o texto do tipo de transação Gasto', () => {
        const lancamentoGasto = buildLancamento({ tipo_transacao: 'Gasto' });
        renderComponent({ lancamentosParaConferencia: [lancamentoGasto] });

        const tipoTemplate = mockCapturedColumnProps.find((c) => c.field === 'tipo_transacao').body;
        const { getByText } = renderIsolado(<>{tipoTemplate(lancamentoGasto)}</>);
        expect(getByText('Gasto')).toBeInTheDocument();
    });

    it('marca a linha de um lançamento já conferido corretamente com a classe correspondente', () => {
        renderComponent({ lancamentosParaConferencia: [buildLancamento({ analise_lancamento: { resultado: 'CORRETO' } })] });

        const rowClassNameFn = mockCapturedDataTableProps.rowClassName;
        expect(rowClassNameFn({ analise_lancamento: { resultado: 'CORRETO' } })).toEqual({
            'linha-conferencia-de-lancamentos-correto': true,
        });
        expect(rowClassNameFn({})).toBeUndefined();
    });

    it('expande receitas e despesas usando os templates apropriados', () => {
        renderComponent({ lancamentosParaConferencia: [buildLancamento()] });

        const rowExpansionTemplate = mockCapturedDataTableProps.rowExpansionTemplate;
        expect(rowExpansionTemplate({ tipo_transacao: 'Crédito', uuid: 'x' })).toBe('expansao-receita-x');
        expect(rowExpansionTemplate({ tipo_transacao: 'Gasto', uuid: 'y' })).toBe('expansao-despesa-y');
    });

    it('controla a expansão de linhas via onRowToggle', () => {
        renderComponent({ lancamentosParaConferencia: [buildLancamento()] });

        act(() => {
            mockCapturedDataTableProps.onRowToggle({ data: { 'lanc-1': true } });
        });

        expect(mockCapturedDataTableProps.expandedRows).toEqual({ 'lanc-1': true });
    });

    it('alterna o checkbox de ordenar por imposto vinculado às despesas', () => {
        const handleChangeCheckBoxOrdenarPorImposto = jest.fn();
        renderComponent({ lancamentosParaConferencia: [buildLancamento()], handleChangeCheckBoxOrdenarPorImposto });

        fireEvent.click(screen.getByLabelText(/Ordenar com imposto/));

        expect(handleChangeCheckBoxOrdenarPorImposto).toHaveBeenCalledWith(true);
    });

    it('exibe as tags de informações do lançamento na coluna Informações', () => {
        const lancamento = buildLancamento();
        renderComponent({ lancamentosParaConferencia: [lancamento] });

        const informacoesTemplate = mockCapturedColumnProps.find((c) => c.field === 'informacoes').body;
        renderIsolado(informacoesTemplate(lancamento));

        expect(screen.getByTestId('mock-table-tags')).toBeInTheDocument();
    });

    it('permite selecionar um segundo lançamento com status compatível ao já selecionado', () => {
        const lancamentoAjusteJaSelecionado = buildLancamento({ uuid: 'lanc-ajuste-1', documento_mestre: { uuid: 'doc-ajuste-1' }, analise_lancamento: { resultado: 'AJUSTE' } });
        const lancamentoNaoConferido = buildLancamento({ uuid: 'lanc-nao-conferido', documento_mestre: { uuid: 'doc-nao-conferido' } });
        renderComponent({ lancamentosParaConferencia: [lancamentoAjusteJaSelecionado, lancamentoNaoConferido] });

        marcarCheckboxDoLancamento(lancamentoAjusteJaSelecionado);
        marcarCheckboxDoLancamento(lancamentoNaoConferido);

        expect(screen.queryByTestId('mock-modal-check')).not.toBeInTheDocument();
        expect(screen.getByText(/2 lançamentos selecionados/)).toBeInTheDocument();
    });
});
