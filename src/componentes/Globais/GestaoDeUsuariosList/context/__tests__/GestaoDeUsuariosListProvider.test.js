import React, { useContext } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
    GestaoDeUsuariosListProvider,
    GestaoDeUsuariosListContext,
} from '../GestaoDeUsuariosListProvider';
import { visoesService } from '../../../../../services/visoes.service';

jest.mock('../../../../../services/visoes.service', () => ({
    visoesService: {
        getItemUsuarioLogado: jest.fn(),
    },
}));

const INITIAL_FILTER = {
    search: '',
    grupo: '',
    tipoUsuario: '',
    nomeUnidade: '',
    apenasUsuariosDaUnidade: false,
};

const ConsumerComponent = () => {
    const ctx = useContext(GestaoDeUsuariosListContext);
    return (
        <div>
            <span data-testid="visaoBase">{ctx.visaoBase}</span>
            <span data-testid="uuidUnidadeBase">{ctx.uuidUnidadeBase}</span>
            <span data-testid="filter">{JSON.stringify(ctx.filter)}</span>
            <span data-testid="initialFilter">{JSON.stringify(ctx.initialFilter)}</span>
            <span data-testid="totalPages">{String(ctx.totalPages)}</span>
            <span data-testid="currentPage">{String(ctx.currentPage)}</span>
            <span data-testid="count">{String(ctx.count)}</span>

            <button onClick={() => ctx.setFilter({ search: 'João', grupo: '1', tipoUsuario: 'servidor', nomeUnidade: '', apenasUsuariosDaUnidade: false })}>
                Set Filter
            </button>
            <button onClick={() => ctx.setFilter(ctx.initialFilter)}>Reset Filter</button>
            <button onClick={() => ctx.setTotalPages(5)}>Set TotalPages 5</button>
            <button onClick={() => ctx.setCurrentPage(3)}>Set CurrentPage 3</button>
            <button onClick={() => ctx.setCurrentPage(1)}>Set CurrentPage 1</button>
            <button onClick={() => ctx.setCount(42)}>Set Count 42</button>
        </div>
    );
};

const renderProvider = () =>
    render(
        <GestaoDeUsuariosListProvider>
            <ConsumerComponent />
        </GestaoDeUsuariosListProvider>
    );

describe('GestaoDeUsuariosListProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        visoesService.getItemUsuarioLogado.mockReturnValue('');
    });

    describe('visaoBase e uuidUnidadeBase', () => {
        it('lê visao_selecionada.nome e unidade_selecionada.uuid do visoesService', () => {
            visoesService.getItemUsuarioLogado.mockImplementation((key) => {
                if (key === 'visao_selecionada.nome') return 'DRE';
                if (key === 'unidade_selecionada.uuid') return 'uuid-dre-123';
                return '';
            });

            renderProvider();

            expect(screen.getByTestId('visaoBase')).toHaveTextContent('DRE');
            expect(screen.getByTestId('uuidUnidadeBase')).toHaveTextContent('uuid-dre-123');
        });

        it('define uuidUnidadeBase como "SME" quando visão selecionada é SME', () => {
            visoesService.getItemUsuarioLogado.mockImplementation((key) => {
                if (key === 'visao_selecionada.nome') return 'SME';
                if (key === 'unidade_selecionada.uuid') return 'uuid-ignorado';
                return '';
            });

            renderProvider();

            expect(screen.getByTestId('visaoBase')).toHaveTextContent('SME');
            expect(screen.getByTestId('uuidUnidadeBase')).toHaveTextContent('SME');
        });

        it('usa uuid da unidade quando visão é UE', () => {
            visoesService.getItemUsuarioLogado.mockImplementation((key) => {
                if (key === 'visao_selecionada.nome') return 'UE';
                if (key === 'unidade_selecionada.uuid') return 'uuid-ue-789';
                return '';
            });

            renderProvider();

            expect(screen.getByTestId('uuidUnidadeBase')).toHaveTextContent('uuid-ue-789');
        });

        it('aceita visaoBase vazia quando visoesService retorna string vazia', () => {
            renderProvider();

            expect(screen.getByTestId('visaoBase')).toHaveTextContent('');
            expect(screen.getByTestId('uuidUnidadeBase')).toHaveTextContent('');
        });
    });

    describe('initialFilter', () => {
        it('expõe initialFilter com todos os campos zerados', () => {
            renderProvider();

            const initialFilter = JSON.parse(screen.getByTestId('initialFilter').textContent);
            expect(initialFilter).toEqual(INITIAL_FILTER);
        });

        it('initialFilter e filter começam com o mesmo valor', () => {
            renderProvider();

            expect(screen.getByTestId('filter').textContent).toBe(
                screen.getByTestId('initialFilter').textContent
            );
        });
    });

    describe('filter e setFilter', () => {
        it('inicia filter com os valores zerados do initialFilter', () => {
            renderProvider();

            expect(JSON.parse(screen.getByTestId('filter').textContent)).toEqual(INITIAL_FILTER);
        });

        it('atualiza filter via setFilter', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set Filter'));
            });

            const filter = JSON.parse(screen.getByTestId('filter').textContent);
            expect(filter.search).toBe('João');
            expect(filter.tipoUsuario).toBe('servidor');
        });

        it('reseta filter para initialFilter via setFilter(initialFilter)', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set Filter'));
            });
            act(() => {
                fireEvent.click(screen.getByText('Reset Filter'));
            });

            expect(JSON.parse(screen.getByTestId('filter').textContent)).toEqual(INITIAL_FILTER);
        });
    });

    describe('totalPages e setTotalPages', () => {
        it('inicia totalPages como 1', () => {
            renderProvider();

            expect(screen.getByTestId('totalPages')).toHaveTextContent('1');
        });

        it('atualiza totalPages via setTotalPages', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set TotalPages 5'));
            });

            expect(screen.getByTestId('totalPages')).toHaveTextContent('5');
        });
    });

    describe('currentPage e setCurrentPage', () => {
        it('inicia currentPage como 1', () => {
            renderProvider();

            expect(screen.getByTestId('currentPage')).toHaveTextContent('1');
        });

        it('atualiza currentPage via setCurrentPage', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set CurrentPage 3'));
            });

            expect(screen.getByTestId('currentPage')).toHaveTextContent('3');
        });

        it('permite voltar currentPage ao valor inicial', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set CurrentPage 3'));
            });
            act(() => {
                fireEvent.click(screen.getByText('Set CurrentPage 1'));
            });

            expect(screen.getByTestId('currentPage')).toHaveTextContent('1');
        });
    });

    describe('count e setCount', () => {
        it('inicia count como 0', () => {
            renderProvider();

            expect(screen.getByTestId('count')).toHaveTextContent('0');
        });

        it('atualiza count via setCount', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set Count 42'));
            });

            expect(screen.getByTestId('count')).toHaveTextContent('42');
        });
    });

    describe('renderização de filhos', () => {
        it('renderiza os filhos dentro do provider', () => {
            render(
                <GestaoDeUsuariosListProvider>
                    <span data-testid="filho">filho</span>
                </GestaoDeUsuariosListProvider>
            );

            expect(screen.getByTestId('filho')).toBeInTheDocument();
        });
    });

    describe('GestaoDeUsuariosListContext — valores padrão do createContext', () => {
        it('expõe visaoBase vazia no contexto padrão (sem provider)', () => {
            const Consumer = () => {
                const ctx = useContext(GestaoDeUsuariosListContext);
                return <span data-testid="visao">{ctx.visaoBase}</span>;
            };
            render(<Consumer />);
            expect(screen.getByTestId('visao')).toHaveTextContent('');
        });

        it('expõe totalPages como 1 no contexto padrão (sem provider)', () => {
            const Consumer = () => {
                const ctx = useContext(GestaoDeUsuariosListContext);
                return <span data-testid="total">{String(ctx.totalPages)}</span>;
            };
            render(<Consumer />);
            expect(screen.getByTestId('total')).toHaveTextContent('1');
        });

        it('expõe currentPage como 1 no contexto padrão (sem provider)', () => {
            const Consumer = () => {
                const ctx = useContext(GestaoDeUsuariosListContext);
                return <span data-testid="page">{String(ctx.currentPage)}</span>;
            };
            render(<Consumer />);
            expect(screen.getByTestId('page')).toHaveTextContent('1');
        });

        it('expõe count como 0 no contexto padrão (sem provider)', () => {
            const Consumer = () => {
                const ctx = useContext(GestaoDeUsuariosListContext);
                return <span data-testid="count">{String(ctx.count)}</span>;
            };
            render(<Consumer />);
            expect(screen.getByTestId('count')).toHaveTextContent('0');
        });

        it('expõe initialFilter com todos os campos zerados no contexto padrão (sem provider)', () => {
            const Consumer = () => {
                const ctx = useContext(GestaoDeUsuariosListContext);
                return <span data-testid="init">{JSON.stringify(ctx.initialFilter)}</span>;
            };
            render(<Consumer />);
            expect(JSON.parse(screen.getByTestId('init').textContent)).toEqual(INITIAL_FILTER);
        });
    });
});
