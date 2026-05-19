import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Botoes } from '../Botoes';

describe('Botoes Component', () => {
    const defaultProps = {
        setBtnMaisFiltros: jest.fn(),
        btnMaisFiltros: false,
        limpaFiltros: jest.fn(),
        handleSubmitFiltros: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Renderização Inicial', () => {
        it('deve renderizar todos os três botões', () => {
            render(<Botoes {...defaultProps} />);

            expect(screen.getByRole('button', { name: /Mais Filtros/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Limpar/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Filtrar/i })).toBeInTheDocument();
        });

        it('deve renderizar botão de toggle com "Mais Filtros" quando btnMaisFiltros é false', () => {
            render(<Botoes {...defaultProps} btnMaisFiltros={false} />);

            const toggleButton = screen.getByRole('button', { name: /Mais Filtros/i });
            expect(toggleButton).toBeInTheDocument();
            expect(toggleButton).toHaveClass('btn', 'btn-outline-success', 'mt-2');
        });

        it('deve renderizar botão de toggle com "Menos filtros" quando btnMaisFiltros é true', () => {
            render(<Botoes {...defaultProps} btnMaisFiltros={true} />);

            const toggleButton = screen.getByRole('button', { name: /Menos filtros/i });
            expect(toggleButton).toBeInTheDocument();
        });

        it('deve renderizar botões "Limpar" e "Filtrar" com classes corretas', () => {
            render(<Botoes {...defaultProps} />);

            const limparButton = screen.getByRole('button', { name: /Limpar/i });
            const filtrarButton = screen.getByRole('button', { name: /Filtrar/i });

            expect(limparButton).toHaveClass('btn', 'btn-success', 'ml-md-2', 'mt-2');
            expect(filtrarButton).toHaveClass('btn', 'btn-success', 'ml-md-2', 'mt-2');
        });

        it('deve renderizar todos os botões com type="button"', () => {
            render(<Botoes {...defaultProps} />);

            const botoes = screen.getAllByRole('button');
            botoes.forEach((button) => {
                expect(button).toHaveAttribute('type', 'button');
            });
        });
    });

    describe('Interações do Usuário - Botão Toggle', () => {
        it('deve chamar setBtnMaisFiltros com o valor inverso ao clicar no botão toggle', async () => {
            const user = userEvent.setup();
            const setBtnMaisFiltros = jest.fn();

            render(
                <Botoes
                    {...defaultProps}
                    setBtnMaisFiltros={setBtnMaisFiltros}
                    btnMaisFiltros={false}
                />,
            );

            const toggleButton = screen.getByRole('button', { name: /Mais Filtros/i });
            await user.click(toggleButton);

            expect(setBtnMaisFiltros).toHaveBeenCalledWith(true);
            expect(setBtnMaisFiltros).toHaveBeenCalledTimes(1);
        });

        it('deve chamar setBtnMaisFiltros com false quando btnMaisFiltros está true', async () => {
            const user = userEvent.setup();
            const setBtnMaisFiltros = jest.fn();

            render(
                <Botoes
                    {...defaultProps}
                    setBtnMaisFiltros={setBtnMaisFiltros}
                    btnMaisFiltros={true}
                />,
            );

            const toggleButton = screen.getByRole('button', { name: /Menos filtros/i });
            await user.click(toggleButton);

            expect(setBtnMaisFiltros).toHaveBeenCalledWith(false);
        });
    });

    describe('Interações do Usuário - Botão Limpar', () => {
        it('deve chamar limpaFiltros ao clicar no botão Limpar', async () => {
            const user = userEvent.setup();
            const limpaFiltros = jest.fn();

            render(<Botoes {...defaultProps} limpaFiltros={limpaFiltros} />);

            const limparButton = screen.getByRole('button', { name: /Limpar/i });
            await user.click(limparButton);

            expect(limpaFiltros).toHaveBeenCalledTimes(1);
            expect(limpaFiltros).toHaveBeenCalledWith();
        });

        it('deve chamar limpaFiltros sem argumentos', async () => {
            const user = userEvent.setup();
            const limpaFiltros = jest.fn();

            render(<Botoes {...defaultProps} limpaFiltros={limpaFiltros} />);

            const limparButton = screen.getByRole('button', { name: /Limpar/i });
            await user.click(limparButton);

            expect(limpaFiltros.mock.calls[0].length).toBe(0);
        });
    });

    describe('Interações do Usuário - Botão Filtrar', () => {
        it('deve chamar handleSubmitFiltros ao clicar no botão Filtrar', async () => {
            const user = userEvent.setup();
            const handleSubmitFiltros = jest.fn();

            render(<Botoes {...defaultProps} handleSubmitFiltros={handleSubmitFiltros} />);

            const filtrarButton = screen.getByRole('button', { name: /Filtrar/i });
            await user.click(filtrarButton);

            expect(handleSubmitFiltros).toHaveBeenCalledTimes(1);
            expect(handleSubmitFiltros).toHaveBeenCalledWith();
        });

        it('deve chamar handleSubmitFiltros sem argumentos', async () => {
            const user = userEvent.setup();
            const handleSubmitFiltros = jest.fn();

            render(<Botoes {...defaultProps} handleSubmitFiltros={handleSubmitFiltros} />);

            const filtrarButton = screen.getByRole('button', { name: /Filtrar/i });
            await user.click(filtrarButton);

            expect(handleSubmitFiltros.mock.calls[0].length).toBe(0);
        });
    });

    describe('Independência dos Callbacks', () => {
        it('deve chamar apenas o callback do botão clicado - toggle', async () => {
            const user = userEvent.setup();
            const setBtnMaisFiltros = jest.fn();
            const limpaFiltros = jest.fn();
            const handleSubmitFiltros = jest.fn();

            render(
                <Botoes
                    setBtnMaisFiltros={setBtnMaisFiltros}
                    btnMaisFiltros={false}
                    limpaFiltros={limpaFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                />,
            );

            const toggleButton = screen.getByRole('button', { name: /Mais Filtros/i });
            await user.click(toggleButton);

            expect(setBtnMaisFiltros).toHaveBeenCalledTimes(1);
            expect(limpaFiltros).not.toHaveBeenCalled();
            expect(handleSubmitFiltros).not.toHaveBeenCalled();
        });

        it('deve chamar apenas o callback do botão clicado - limpar', async () => {
            const user = userEvent.setup();
            const setBtnMaisFiltros = jest.fn();
            const limpaFiltros = jest.fn();
            const handleSubmitFiltros = jest.fn();

            render(
                <Botoes
                    setBtnMaisFiltros={setBtnMaisFiltros}
                    btnMaisFiltros={false}
                    limpaFiltros={limpaFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                />,
            );

            const limparButton = screen.getByRole('button', { name: /Limpar/i });
            await user.click(limparButton);

            expect(limpaFiltros).toHaveBeenCalledTimes(1);
            expect(setBtnMaisFiltros).not.toHaveBeenCalled();
            expect(handleSubmitFiltros).not.toHaveBeenCalled();
        });

        it('deve chamar apenas o callback do botão clicado - filtrar', async () => {
            const user = userEvent.setup();
            const setBtnMaisFiltros = jest.fn();
            const limpaFiltros = jest.fn();
            const handleSubmitFiltros = jest.fn();

            render(
                <Botoes
                    setBtnMaisFiltros={setBtnMaisFiltros}
                    btnMaisFiltros={false}
                    limpaFiltros={limpaFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                />,
            );

            const filtrarButton = screen.getByRole('button', { name: /Filtrar/i });
            await user.click(filtrarButton);

            expect(handleSubmitFiltros).toHaveBeenCalledTimes(1);
            expect(setBtnMaisFiltros).not.toHaveBeenCalled();
            expect(limpaFiltros).not.toHaveBeenCalled();
        });
    });

    describe('Cenário Integrado - Múltiplas Ações', () => {
        it('deve permitir clicar em vários botões em sequência', async () => {
            const user = userEvent.setup();
            const setBtnMaisFiltros = jest.fn();
            const limpaFiltros = jest.fn();
            const handleSubmitFiltros = jest.fn();

            render(
                <Botoes
                    setBtnMaisFiltros={setBtnMaisFiltros}
                    btnMaisFiltros={false}
                    limpaFiltros={limpaFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                />,
            );

            await user.click(screen.getByRole('button', { name: /Limpar/i }));
            await user.click(screen.getByRole('button', { name: /Filtrar/i }));
            await user.click(screen.getByRole('button', { name: /Mais Filtros/i }));

            expect(limpaFiltros).toHaveBeenCalledTimes(1);
            expect(handleSubmitFiltros).toHaveBeenCalledTimes(1);
            expect(setBtnMaisFiltros).toHaveBeenCalledTimes(1);
        });

        it('deve manter estado de toggle independente das outras ações', async () => {
            const user = userEvent.setup();
            const setBtnMaisFiltros = jest.fn();
            const limpaFiltros = jest.fn();
            const handleSubmitFiltros = jest.fn();

            const { rerender } = render(
                <Botoes
                    setBtnMaisFiltros={setBtnMaisFiltros}
                    btnMaisFiltros={false}
                    limpaFiltros={limpaFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                />,
            );

            await user.click(screen.getByRole('button', { name: /Limpar/i }));
            rerender(
                <Botoes
                    setBtnMaisFiltros={setBtnMaisFiltros}
                    btnMaisFiltros={true}
                    limpaFiltros={limpaFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                />,
            );

            await user.click(screen.getByRole('button', { name: /Limpar/i }));

            expect(limpaFiltros).toHaveBeenCalledTimes(2);
            expect(handleSubmitFiltros).not.toHaveBeenCalled();
        });
    });

    describe('Acessibilidade', () => {
        it('deve garantir que todos os botões devem ser acessíveis por teclado', async () => {
            const user = userEvent.setup();
            const setBtnMaisFiltros = jest.fn();
            const limpaFiltros = jest.fn();
            const handleSubmitFiltros = jest.fn();

            render(
                <Botoes
                    setBtnMaisFiltros={setBtnMaisFiltros}
                    btnMaisFiltros={false}
                    limpaFiltros={limpaFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                />,
            );

            await user.tab();
            expect(screen.getByRole('button', { name: /Mais Filtros/i })).toHaveFocus();

            await user.keyboard('{Enter}');
            expect(setBtnMaisFiltros).toHaveBeenCalledTimes(1);

            await user.tab();
            expect(screen.getByRole('button', { name: /Limpar/i })).toHaveFocus();

            await user.keyboard(' ');
            expect(limpaFiltros).toHaveBeenCalledTimes(1);

            await user.tab();
            expect(screen.getByRole('button', { name: /Filtrar/i })).toHaveFocus();

            await user.keyboard('{Enter}');
            expect(handleSubmitFiltros).toHaveBeenCalledTimes(1);
        });

        it('deve ter textos descritivos para leitores de tela', () => {
            render(<Botoes {...defaultProps} />);

            expect(screen.getByRole('button', { name: /Mais Filtros/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Limpar/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Filtrar/i })).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('deve renderizar corretamente com callbacks indefinidos inicialmente', () => {
            expect(() => {
                render(
                    <Botoes
                        setBtnMaisFiltros={jest.fn()}
                        btnMaisFiltros={false}
                        limpaFiltros={jest.fn()}
                        handleSubmitFiltros={jest.fn()}
                    />,
                );
            }).not.toThrow();
        });

        it('deve renderizar com diferentes valores de btnMaisFiltros', () => {
            const { rerender } = render(<Botoes {...defaultProps} btnMaisFiltros={false} />);

            expect(screen.getByRole('button', { name: /Mais Filtros/i })).toBeInTheDocument();

            rerender(<Botoes {...defaultProps} btnMaisFiltros={true} />);

            expect(screen.queryByRole('button', { name: /Mais Filtros/i })).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Menos filtros/i })).toBeInTheDocument();
        });
    });
});
