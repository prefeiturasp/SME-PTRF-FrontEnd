import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { FiltroRecolhido } from '../FiltroRecolhido';

jest.mock('../Botoes', () => ({
    Botoes: ({ btnMaisFiltros, setBtnMaisFiltros, limpaFiltros, handleSubmitFiltros }) => (
        <div data-testid='botoes-mock'>
            <button onClick={setBtnMaisFiltros} data-testid='btn-mais-filtros'>
                {btnMaisFiltros ? 'Menos filtros' : 'Mais filtros'}
            </button>
            <button onClick={limpaFiltros} data-testid='btn-limpa-filtros'>
                Limpar filtros
            </button>
            <button onClick={handleSubmitFiltros} data-testid='btn-submit-filtros'>
                Filtrar
            </button>
        </div>
    ),
}));

describe('FiltroRecolhido Component', () => {
    const defaultProps = {
        stateFiltros: {
            filtrar_por_acao: '',
        },
        tabelasDespesa: {
            acoes_associacao: [
                { uuid: 'uuid-1', nome: 'Ação 1' },
                { uuid: 'uuid-2', nome: 'Ação 2' },
            ],
        },
        handleChangeFiltros: jest.fn(),
        btnMaisFiltros: false,
        setBtnMaisFiltros: jest.fn(),
        limpaFiltros: jest.fn(),
        handleSubmitFiltros: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Renderização', () => {
        it('deve renderizar o componente corretamente com dados padrão', () => {
            render(<FiltroRecolhido {...defaultProps} />);

            expect(screen.getByLabelText('Ação')).toBeInTheDocument();
            expect(screen.getByRole('combobox', { name: 'Ação' })).toBeInTheDocument();
            expect(screen.getByTestId('botoes-mock')).toBeInTheDocument();
        });

        it('deve renderizar o select com opção padrão "Selecione"', () => {
            render(<FiltroRecolhido {...defaultProps} />);

            const select = screen.getByRole('combobox', { name: 'Ação' });
            expect(select).toHaveValue('');
            expect(screen.getByText('Selecione')).toBeInTheDocument();
        });

        it('deve renderizar as opções de ação quando tabelasDespesa tem dados', () => {
            render(<FiltroRecolhido {...defaultProps} />);

            expect(screen.getByText('Ação 1')).toBeInTheDocument();
            expect(screen.getByText('Ação 2')).toBeInTheDocument();
        });

        it('deve renderizar sem opções quando tabelasDespesa.acoes_associacao está vazio', () => {
            const props = {
                ...defaultProps,
                tabelasDespesa: { acoes_associacao: [] },
            };
            render(<FiltroRecolhido {...props} />);

            const select = screen.getByRole('combobox', { name: 'Ação' });
            expect(select.children).toHaveLength(1);
            expect(screen.getByText('Selecione')).toBeInTheDocument();
        });

        it('deve renderizar sem opções quando tabelasDespesa é null', () => {
            const props = {
                ...defaultProps,
                tabelasDespesa: null,
            };
            render(<FiltroRecolhido {...props} />);

            const select = screen.getByRole('combobox', { name: 'Ação' });
            expect(select.children).toHaveLength(1);
            expect(screen.getByText('Selecione')).toBeInTheDocument();
        });

        it('deve renderizar o componente Botoes com props corretas', () => {
            render(<FiltroRecolhido {...defaultProps} />);

            expect(screen.getByTestId('botoes-mock')).toBeInTheDocument();
            expect(screen.getByTestId('btn-mais-filtros')).toHaveTextContent('Mais filtros');
        });
    });

    describe('Interações do Usuário', () => {
        it('deve chamar handleChangeFiltros ao selecionar uma ação', async () => {
            const user = userEvent.setup();
            render(<FiltroRecolhido {...defaultProps} />);

            const select = screen.getByRole('combobox', { name: 'Ação' });
            await user.selectOptions(select, 'uuid-1');

            expect(defaultProps.handleChangeFiltros).toHaveBeenCalledWith(
                'filtrar_por_acao',
                'uuid-1',
            );
            expect(defaultProps.handleChangeFiltros).toHaveBeenCalledTimes(1);
        });

        it('deve atualizar o valor do select quando stateFiltros.filtrar_por_acao muda', () => {
            const props = {
                ...defaultProps,
                stateFiltros: { filtrar_por_acao: 'uuid-2' },
            };
            render(<FiltroRecolhido {...props} />);

            const select = screen.getByRole('combobox', { name: 'Ação' });
            expect(select).toHaveValue('uuid-2');
        });

        it('deve permitir interação com o componente Botoes', async () => {
            const user = userEvent.setup();
            render(<FiltroRecolhido {...defaultProps} />);

            const btnMaisFiltros = screen.getByTestId('btn-mais-filtros');
            await user.click(btnMaisFiltros);

            expect(defaultProps.setBtnMaisFiltros).toHaveBeenCalledTimes(1);

            const btnLimpa = screen.getByTestId('btn-limpa-filtros');
            await user.click(btnLimpa);

            expect(defaultProps.limpaFiltros).toHaveBeenCalledTimes(1);

            const btnSubmit = screen.getByTestId('btn-submit-filtros');
            await user.click(btnSubmit);

            expect(defaultProps.handleSubmitFiltros).toHaveBeenCalledTimes(1);
        });
    });

    describe('Cenários de Borda', () => {
        it('deve renderizar corretamente quando tabelasDespesa.acoes_associacao é undefined', () => {
            const props = {
                ...defaultProps,
                tabelasDespesa: {},
            };
            render(<FiltroRecolhido {...props} />);

            const select = screen.getByRole('combobox', { name: 'Ação' });
            expect(select.children).toHaveLength(1);
        });

        it('deve manter funcionalidade mesmo com props mínimas', () => {
            const minimalProps = {
                stateFiltros: { filtrar_por_acao: '' },
                tabelasDespesa: null,
                handleChangeFiltros: jest.fn(),
                btnMaisFiltros: false,
                setBtnMaisFiltros: jest.fn(),
                limpaFiltros: jest.fn(),
                handleSubmitFiltros: jest.fn(),
            };
            render(<FiltroRecolhido {...minimalProps} />);

            expect(screen.getByLabelText('Ação')).toBeInTheDocument();
            expect(screen.getByTestId('botoes-mock')).toBeInTheDocument();
        });
    });

    describe('Acessibilidade', () => {
        it('deve ter label associada ao select', () => {
            render(<FiltroRecolhido {...defaultProps} />);

            const select = screen.getByRole('combobox', { name: 'Ação' });
            expect(select).toHaveAttribute('id', 'filtrar_por_acao');
            expect(select).toHaveAttribute('name', 'filtrar_por_acao');
        });

        it('deve renderizar select com opções acessíveis', () => {
            render(<FiltroRecolhido {...defaultProps} />);

            const options = screen.getAllByRole('option');
            expect(options).toHaveLength(3);
            expect(options[0]).toHaveTextContent('Selecione');
            expect(options[1]).toHaveTextContent('Ação 1');
            expect(options[2]).toHaveTextContent('Ação 2');
        });
    });
});
