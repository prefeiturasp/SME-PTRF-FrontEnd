import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListaDeUnidades } from '../ListaDeUnidades';
import { GestaoDeUsuariosAdicionarUnidadeContext } from '../../context/GestaoUsuariosAdicionarUnidadeProvider';
import { useUnidadesDisponiveisInclusao } from '../../hooks/useUnidadesDisponiveisInclusao';
import { useIncluirUnidade } from '../../hooks/useIncluirUnidade';
import { useUsuario } from '../../../GestaoDeUsuariosForm/hooks/useUsuario';

// ── Router ────────────────────────────────────────────────────────────────────
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ id_usuario: '42' }),
}));

// ── Hooks ─────────────────────────────────────────────────────────────────────
jest.mock('../../hooks/useUnidadesDisponiveisInclusao', () => ({
    useUnidadesDisponiveisInclusao: jest.fn(),
}));

jest.mock('../../hooks/useIncluirUnidade', () => ({
    useIncluirUnidade: jest.fn(),
}));

jest.mock('../../../GestaoDeUsuariosForm/hooks/useUsuario', () => ({
    useUsuario: jest.fn(),
}));

// ── PrimeReact ────────────────────────────────────────────────────────────────
jest.mock('primereact/datatable', () => ({
    DataTable: (props) => {
        const mockReact = require('react');
        const { value, children } = props;
        return mockReact.createElement(
            'div',
            { 'data-testid': 'data-table' },
            value && value.map((row, i) =>
                mockReact.createElement(
                    'div',
                    { key: i, 'data-testid': `row-${i}` },
                    mockReact.Children.map(children, (col) =>
                        col && col.props && col.props.body
                            ? col.props.body(row)
                            : row[col?.props?.field]
                    )
                )
            )
        );
    },
}));

jest.mock('primereact/column', () => ({
    Column: () => null,
}));

// ── Globais ───────────────────────────────────────────────────────────────────
jest.mock('../../../../../utils/Loading', () => ({
    __esModule: true,
    default: () => <div data-testid="loading" />,
}));

jest.mock('../../../Mensagens/MsgImgCentralizada', () => ({
    MsgImgCentralizada: ({ texto }) => <div data-testid="msg-img-centralizada">{texto}</div>,
}));

jest.mock('../../../ModalLegendaInformacao/LegendaInformacao', () => ({
    LegendaInformacao: () => <div data-testid="legenda-informacao" />,
}));

jest.mock('../../../TableTags', () => ({
    TableTags: () => <div data-testid="table-tags" />,
}));

jest.mock('./Paginacao', () => ({
    Paginacao: ({ count }) => <div data-testid="paginacao">{count}</div>,
}), { virtual: true });

jest.mock('../Paginacao', () => ({
    Paginacao: ({ count }) => <div data-testid="paginacao">{count}</div>,
}));

jest.mock('../../../../assets/img/img-404.svg', () => 'img-404-mock', { virtual: true });

// ── Helpers ───────────────────────────────────────────────────────────────────
const buildContext = (overrides = {}) => ({
    search: '',
    setSearch: jest.fn(),
    submitFiltro: false,
    setSubmitFiltro: jest.fn(),
    currentPage: 1,
    setCurrentPage: jest.fn(),
    firstPage: 0,
    setFirstPage: jest.fn(),
    showModalLegendaInformacao: false,
    setShowModalLegendaInformacao: jest.fn(),
    ...overrides,
});

const buildWrapper = (contextValue) => ({ children }) => (
    <GestaoDeUsuariosAdicionarUnidadeContext.Provider value={contextValue}>
        {children}
    </GestaoDeUsuariosAdicionarUnidadeContext.Provider>
);

const mockMutate = jest.fn();

const USUARIO = { username: 'fulano', id: 42 };

const UNIDADES = [
    { uuid: 'uuid-a', codigo_eol: '000001', nome_com_tipo: 'EMEF Escola A' },
    { uuid: 'uuid-b', codigo_eol: '000002', nome_com_tipo: 'EMEF Escola B' },
];

describe('ListaDeUnidades', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useUsuario.mockReturnValue({ data: USUARIO });
        useIncluirUnidade.mockReturnValue({ mutationIncluirUnidade: { mutate: mockMutate } });
    });

    it('deve exibir Loading quando isFetching é true', () => {
        useUnidadesDisponiveisInclusao.mockReturnValue({
            isLoading: true,
            isFetching: true,
            data: { count: 0, results: [] },
        });

        const ctx = buildContext();
        render(<ListaDeUnidades />, { wrapper: buildWrapper(ctx) });

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('deve exibir DataTable quando isFetching=false e count > 0', () => {
        useUnidadesDisponiveisInclusao.mockReturnValue({
            isLoading: false,
            isFetching: false,
            data: { count: 2, results: UNIDADES },
        });

        const ctx = buildContext();
        render(<ListaDeUnidades />, { wrapper: buildWrapper(ctx) });

        expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    it('deve exibir LegendaInformacao quando isFetching=false e count > 0', () => {
        useUnidadesDisponiveisInclusao.mockReturnValue({
            isLoading: false,
            isFetching: false,
            data: { count: 1, results: [UNIDADES[0]] },
        });

        render(<ListaDeUnidades />, { wrapper: buildWrapper(buildContext()) });

        expect(screen.getByTestId('legenda-informacao')).toBeInTheDocument();
    });

    it('deve exibir Paginacao com o count correto quando há resultados', () => {
        useUnidadesDisponiveisInclusao.mockReturnValue({
            isLoading: false,
            isFetching: false,
            data: { count: 25, results: UNIDADES },
        });

        render(<ListaDeUnidades />, { wrapper: buildWrapper(buildContext()) });

        expect(screen.getByTestId('paginacao')).toHaveTextContent('25');
    });

    it('deve exibir MsgImgCentralizada quando isFetching=false e count = 0', () => {
        useUnidadesDisponiveisInclusao.mockReturnValue({
            isLoading: false,
            isFetching: false,
            data: { count: 0, results: [] },
        });

        render(<ListaDeUnidades />, { wrapper: buildWrapper(buildContext()) });

        expect(screen.getByTestId('msg-img-centralizada')).toBeInTheDocument();
    });

    it('deve exibir mensagem de filtro quando submitFiltro=false e isLoading=true', () => {
        useUnidadesDisponiveisInclusao.mockReturnValue({
            isLoading: true,
            isFetching: false,
            data: { count: 0, results: [] },
        });

        const ctx = buildContext({ submitFiltro: false });
        render(<ListaDeUnidades />, { wrapper: buildWrapper(ctx) });

        expect(screen.getByTestId('msg-img-centralizada')).toHaveTextContent(
            /use parte do nome ou código eol/i
        );
    });

    it('deve exibir mensagem de sem resultados quando count = 0 e submitFiltro=true', () => {
        useUnidadesDisponiveisInclusao.mockReturnValue({
            isLoading: false,
            isFetching: false,
            data: { count: 0, results: [] },
        });

        const ctx = buildContext({ submitFiltro: true });
        render(<ListaDeUnidades />, { wrapper: buildWrapper(ctx) });

        expect(screen.getByTestId('msg-img-centralizada')).toHaveTextContent(
            /não encontramos resultados/i
        );
    });

    it('deve renderizar o nome da unidade em negrito no template da coluna', () => {
        useUnidadesDisponiveisInclusao.mockReturnValue({
            isLoading: false,
            isFetching: false,
            data: { count: 1, results: [UNIDADES[0]] },
        });

        render(<ListaDeUnidades />, { wrapper: buildWrapper(buildContext()) });

        expect(screen.getByText('EMEF Escola A')).toBeInTheDocument();
    });

    it('deve chamar mutationIncluirUnidade.mutate com payload correto ao clicar em "Habilitar acesso"', () => {
        useUnidadesDisponiveisInclusao.mockReturnValue({
            isLoading: false,
            isFetching: false,
            data: { count: 1, results: [UNIDADES[0]] },
        });

        render(<ListaDeUnidades />, { wrapper: buildWrapper(buildContext()) });

        fireEvent.click(screen.getByRole('button', { name: /habilitar acesso/i }));

        expect(mockMutate).toHaveBeenCalledWith({
            payload: {
                username: USUARIO.username,
                uuid_unidade: UNIDADES[0].uuid,
            },
        });
    });

    it('deve chamar mutate com a unidade correta quando há múltiplas linhas', () => {
        useUnidadesDisponiveisInclusao.mockReturnValue({
            isLoading: false,
            isFetching: false,
            data: { count: 2, results: UNIDADES },
        });

        render(<ListaDeUnidades />, { wrapper: buildWrapper(buildContext()) });

        const buttons = screen.getAllByRole('button', { name: /habilitar acesso/i });
        fireEvent.click(buttons[1]);

        expect(mockMutate).toHaveBeenCalledWith({
            payload: {
                username: USUARIO.username,
                uuid_unidade: UNIDADES[1].uuid,
            },
        });
    });
});
