import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Paa } from '../index';
import * as service from '../../../../services/dres/Paa.service';
import { useNavigate } from 'react-router-dom';
import { useRecursoSelecionadoContext } from '../../../../context/RecursoSelecionado';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../../../../services/dres/Paa.service');

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

jest.mock('../../../../context/RecursoSelecionado', () => ({
    useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock('.././TabelaPaa', () => ({
    TabelaPaa: ({ listaPaa, aoMudarPagina }) => (
        <div data-testid='tabela'>
            <span data-testid='total-itens'>{(listaPaa?.results || []).length} itens</span>
            <button onClick={() => aoMudarPagina({ page: 1 })}>Next Page</button>
        </div>
    ),
}));

jest.mock('.././FiltrosPaa', () => ({
    FiltrosPaa: ({ aoSubmeterFiltros, limpaFiltros, aoAlterarFiltro, tipoUnidadeManual }) => (
        <div data-testid='filtros-container'>
            <span data-testid='manual-status'>{tipoUnidadeManual ? 'manual' : 'auto'}</span>

            <button onClick={aoSubmeterFiltros}>Filtrar</button>

            <button onClick={limpaFiltros}>Limpar</button>

            <button onClick={() => aoAlterarFiltro('unidade', 'ABC-UUID')}>Mudar Unidade</button>

            <button onClick={() => aoAlterarFiltro('tipo_unidade', 'Escola Técnica')}>
                Mudar Tipo Manual
            </button>

            <button onClick={() => aoAlterarFiltro('status', ['ATIVO', 'PENDENTE'])}>
                Mudar Status Multi
            </button>
        </div>
    ),
}));

jest.mock('../../../../utils/Loading', () => () => <div data-testid='loading'>Loading...</div>);

jest.mock('../../../Globais/Mensagens/MsgImgCentralizada', () => ({
    MsgImgCentralizada: ({ texto }) => <div data-testid='msg-centralizada'>{texto}</div>,
}));

jest.mock('../../../Globais/Mensagens/MsgImgLadoDireito', () => ({
    MsgImgLadoDireito: ({ texto }) => <div data-testid='msg-lado-direito'>{texto}</div>,
}));

jest.mock('../../../Globais/UI/Icon', () => ({
    Icon: () => <span>icon</span>,
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('Paa Component DRE', () => {
    const navigateMock = jest.fn();
    const mockUuid = 'recurso-123';

    beforeEach(() => {
        jest.clearAllMocks();

        useNavigate.mockReturnValue(navigateMock);

        useRecursoSelecionadoContext.mockReturnValue({
            recursoSelecionado: { uuid: mockUuid },
        });
    });

    test('deve renderizar loading inicialmente e carregar dados', async () => {
        service.getTabelaPaaDre.mockResolvedValue({});
        service.getPaaPorDre.mockResolvedValue({ results: [], count: 0 });

        render(<Paa />, {
            wrapper: createWrapper(),
        });

        expect(screen.getByTestId('loading')).toBeInTheDocument();

        await waitFor(() => {
            expect(service.getTabelaPaaDre).toHaveBeenCalledWith(mockUuid);
        });
    });

    test('deve renderizar tabela quando há dados retornados pela API', async () => {
        service.getTabelaPaaDre.mockResolvedValue({ unidades: [] });

        service.getPaaPorDre.mockResolvedValue({
            results: [{ id: 1 }, { id: 2 }],
            count: 2,
        });

        render(<Paa />, {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(screen.getByTestId('total-itens')).toHaveTextContent('2 itens');
        });
    });

    test('deve formatar filtros de array para string separada por vírgula ao chamar a API', async () => {
        service.getTabelaPaaDre.mockResolvedValue({});

        service.getPaaPorDre.mockResolvedValue({
            results: [{ id: 1 }],
            count: 1,
        });

        render(<Paa />, {
            wrapper: createWrapper(),
        });

        await screen.findByTestId('tabela');

        fireEvent.click(screen.getByText('Mudar Status Multi'));
        fireEvent.click(screen.getByText('Filtrar'));

        await waitFor(() => {
            expect(service.getPaaPorDre).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    status: 'ATIVO,PENDENTE',
                }),
                mockUuid,
            );
        });
    });

    test('deve preencher tipo_unidade automaticamente ao selecionar uma unidade da lista', async () => {
        const mockTabela = {
            unidades: [{ uuid: 'ABC-UUID', tipo_unidade: 'EMEF' }],
        };

        service.getTabelaPaaDre.mockResolvedValue(mockTabela);

        service.getPaaPorDre.mockResolvedValue({
            results: [{ id: 1 }],
            count: 1,
        });

        render(<Paa />, {
            wrapper: createWrapper(),
        });

        await screen.findByTestId('tabela');

        fireEvent.click(screen.getByText('Mudar Unidade'));

        expect(screen.getByTestId('manual-status')).toHaveTextContent('auto');

        fireEvent.click(screen.getByText('Filtrar'));

        await waitFor(() => {
            expect(service.getPaaPorDre).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    unidade: 'ABC-UUID',
                    tipo_unidade: 'EMEF',
                }),
                mockUuid,
            );
        });
    });

    test('deve ativar modo tipoUnidadeManual ao alterar o tipo de unidade diretamente', async () => {
        service.getTabelaPaaDre.mockResolvedValue({});

        service.getPaaPorDre.mockResolvedValue({
            results: [{ id: 1 }],
            count: 1,
        });

        render(<Paa />, {
            wrapper: createWrapper(),
        });

        await screen.findByTestId('tabela');

        fireEvent.click(screen.getByText('Mudar Tipo Manual'));

        expect(screen.getByTestId('manual-status')).toHaveTextContent('manual');
    });

    test('deve atualizar a lista ao mudar de página mantendo filtros', async () => {
        service.getTabelaPaaDre.mockResolvedValue({});

        service.getPaaPorDre.mockResolvedValue({
            results: [{ id: 1 }],
            count: 1,
        });

        render(<Paa />, {
            wrapper: createWrapper(),
        });

        await screen.findByTestId('tabela');

        fireEvent.click(screen.getByText('Mudar Unidade'));

        fireEvent.click(screen.getByText('Filtrar'));

        fireEvent.click(screen.getByText('Next Page'));

        await waitFor(() => {
            expect(service.getPaaPorDre).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    page: 2,
                    unidade: 'ABC-UUID',
                }),
                mockUuid,
            );
        });
    });

    test('deve resetar todos os estados ao clicar em limpar filtros', async () => {
        service.getTabelaPaaDre.mockResolvedValue({});

        service.getPaaPorDre.mockResolvedValue({
            results: [{ id: 1 }],
            count: 1,
        });

        render(<Paa />, {
            wrapper: createWrapper(),
        });

        await screen.findByTestId('tabela');

        fireEvent.click(screen.getByText('Limpar'));

        await waitFor(() => {
            expect(service.getPaaPorDre).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    page: 1,
                    unidade: '',
                    status: '',
                }),
                mockUuid,
            );

            expect(screen.getByTestId('manual-status')).toHaveTextContent('auto');
        });
    });

    test('deve lidar com erros de API removendo o loading e exibindo mensagem', async () => {
        service.getTabelaPaaDre.mockRejectedValue(new Error('Erro'));

        service.getPaaPorDre.mockRejectedValue(new Error('Erro'));

        render(<Paa />, {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();

            expect(screen.getByTestId('msg-lado-direito')).toBeInTheDocument();
        });
    });

    test('deve alternar entre MsgImgLadoDireito e MsgImgCentralizada dependendo do uso de filtros', async () => {
        service.getTabelaPaaDre.mockResolvedValue({});

        service.getPaaPorDre
            .mockResolvedValueOnce({
                results: [{ id: 1 }],
                count: 1,
            })
            .mockResolvedValueOnce({
                results: [],
                count: 0,
            });

        render(<Paa />, {
            wrapper: createWrapper(),
        });

        await screen.findByTestId('tabela');

        fireEvent.click(screen.getByText('Mudar Status Multi'));

        fireEvent.click(screen.getByText('Filtrar'));

        await waitFor(() => {
            expect(screen.getByTestId('msg-centralizada')).toHaveTextContent(
                'Nenhum resultado encontrado.',
            );
        });
    });

    test('não deve disparar chamadas se o recurso selecionado não possuir UUID', () => {
        useRecursoSelecionadoContext.mockReturnValue({
            recursoSelecionado: null,
        });

        render(<Paa />, {
            wrapper: createWrapper(),
        });

        expect(service.getPaaPorDre).not.toHaveBeenCalled();

        expect(screen.getByTestId('msg-lado-direito')).toBeInTheDocument();
    });
});
