import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import {
    GestaoDeUsuariosAdicionarUnidadeContext,
    GestaoDeUsuariosAdicionarUnidadeProvider,
} from '../GestaoUsuariosAdicionarUnidadeProvider';

const ConsumerTeste = () => {
    const ctx = useContext(GestaoDeUsuariosAdicionarUnidadeContext);
    return (
        <div>
            <span data-testid="search">{ctx.search}</span>
            <span data-testid="submitFiltro">{String(ctx.submitFiltro)}</span>
            <span data-testid="currentPage">{ctx.currentPage}</span>
            <span data-testid="firstPage">{ctx.firstPage}</span>
            <span data-testid="showModalLegendaInformacao">{String(ctx.showModalLegendaInformacao)}</span>
            <button onClick={() => ctx.setSearch('novo search')}>setSearch</button>
            <button onClick={() => ctx.setSubmitFiltro(true)}>setSubmitFiltro</button>
            <button onClick={() => ctx.setCurrentPage(5)}>setCurrentPage</button>
            <button onClick={() => ctx.setFirstPage(3)}>setFirstPage</button>
            <button onClick={() => ctx.setShowModalLegendaInformacao(true)}>setShowModalLegendaInformacao</button>
        </div>
    );
};

describe('GestaoDeUsuariosAdicionarUnidadeContext — valores padrão', () => {
    it('deve ter search vazio por padrão', () => {
        const ctx = React.createContext(null);
        const defaultValue = GestaoDeUsuariosAdicionarUnidadeContext._currentValue;
        expect(defaultValue.search).toBe('');
    });

    it('deve ter submitFiltro false por padrão', () => {
        const defaultValue = GestaoDeUsuariosAdicionarUnidadeContext._currentValue;
        expect(defaultValue.submitFiltro).toBe(false);
    });

    it('deve ter currentPage 1 por padrão', () => {
        const defaultValue = GestaoDeUsuariosAdicionarUnidadeContext._currentValue;
        expect(defaultValue.currentPage).toBe(1);
    });

    it('deve ter firstPage 1 por padrão', () => {
        const defaultValue = GestaoDeUsuariosAdicionarUnidadeContext._currentValue;
        expect(defaultValue.firstPage).toBe(1);
    });

    it('deve ter showModalLegendaInformacao false por padrão', () => {
        const defaultValue = GestaoDeUsuariosAdicionarUnidadeContext._currentValue;
        expect(defaultValue.showModalLegendaInformacao).toBe(false);
    });

    it('deve ter setSearch como função por padrão', () => {
        const defaultValue = GestaoDeUsuariosAdicionarUnidadeContext._currentValue;
        expect(typeof defaultValue.setSearch).toBe('function');
    });

    it('deve ter setSubmitFiltro como função por padrão', () => {
        const defaultValue = GestaoDeUsuariosAdicionarUnidadeContext._currentValue;
        expect(typeof defaultValue.setSubmitFiltro).toBe('function');
    });

    it('deve ter setCurrentPage como função por padrão', () => {
        const defaultValue = GestaoDeUsuariosAdicionarUnidadeContext._currentValue;
        expect(typeof defaultValue.setCurrentPage).toBe('function');
    });

    it('deve ter setFirstPage como função por padrão', () => {
        const defaultValue = GestaoDeUsuariosAdicionarUnidadeContext._currentValue;
        expect(typeof defaultValue.setFirstPage).toBe('function');
    });

    it('deve ter setShowModalLegendaInformacao como função por padrão', () => {
        const defaultValue = GestaoDeUsuariosAdicionarUnidadeContext._currentValue;
        expect(typeof defaultValue.setShowModalLegendaInformacao).toBe('function');
    });
});

describe('GestaoDeUsuariosAdicionarUnidadeProvider', () => {
    it('deve renderizar os filhos', () => {
        render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <span data-testid="filho">conteúdo filho</span>
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );
        expect(screen.getByTestId('filho')).toBeInTheDocument();
    });

    it('deve fornecer os valores iniciais corretos via contexto', () => {
        render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <ConsumerTeste />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );
        expect(screen.getByTestId('search').textContent).toBe('');
        expect(screen.getByTestId('submitFiltro').textContent).toBe('false');
        expect(screen.getByTestId('currentPage').textContent).toBe('1');
        expect(screen.getByTestId('firstPage').textContent).toBe('1');
        expect(screen.getByTestId('showModalLegendaInformacao').textContent).toBe('false');
    });

    it('deve atualizar search ao chamar setSearch', () => {
        render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <ConsumerTeste />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );
        act(() => {
            screen.getByRole('button', { name: 'setSearch' }).click();
        });
        expect(screen.getByTestId('search').textContent).toBe('novo search');
    });

    it('deve atualizar submitFiltro ao chamar setSubmitFiltro', () => {
        render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <ConsumerTeste />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );
        act(() => {
            screen.getByRole('button', { name: 'setSubmitFiltro' }).click();
        });
        expect(screen.getByTestId('submitFiltro').textContent).toBe('true');
    });

    it('deve atualizar currentPage ao chamar setCurrentPage', () => {
        render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <ConsumerTeste />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );
        act(() => {
            screen.getByRole('button', { name: 'setCurrentPage' }).click();
        });
        expect(screen.getByTestId('currentPage').textContent).toBe('5');
    });

    it('deve atualizar firstPage ao chamar setFirstPage', () => {
        render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <ConsumerTeste />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );
        act(() => {
            screen.getByRole('button', { name: 'setFirstPage' }).click();
        });
        expect(screen.getByTestId('firstPage').textContent).toBe('3');
    });

    it('deve atualizar showModalLegendaInformacao ao chamar setShowModalLegendaInformacao', () => {
        render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <ConsumerTeste />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );
        act(() => {
            screen.getByRole('button', { name: 'setShowModalLegendaInformacao' }).click();
        });
        expect(screen.getByTestId('showModalLegendaInformacao').textContent).toBe('true');
    });

    it('deve expor setSearch como função no contexto', () => {
        let capturedCtx;
        const Capturador = () => {
            capturedCtx = useContext(GestaoDeUsuariosAdicionarUnidadeContext);
            return null;
        };
        render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <Capturador />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );
        expect(typeof capturedCtx.setSearch).toBe('function');
    });

    it('deve expor setSubmitFiltro como função no contexto', () => {
        let capturedCtx;
        const Capturador = () => {
            capturedCtx = useContext(GestaoDeUsuariosAdicionarUnidadeContext);
            return null;
        };
        render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <Capturador />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );
        expect(typeof capturedCtx.setSubmitFiltro).toBe('function');
    });

    it('deve expor setCurrentPage como função no contexto', () => {
        let capturedCtx;
        const Capturador = () => {
            capturedCtx = useContext(GestaoDeUsuariosAdicionarUnidadeContext);
            return null;
        };
        render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <Capturador />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );
        expect(typeof capturedCtx.setCurrentPage).toBe('function');
    });

    it('deve expor setFirstPage como função no contexto', () => {
        let capturedCtx;
        const Capturador = () => {
            capturedCtx = useContext(GestaoDeUsuariosAdicionarUnidadeContext);
            return null;
        };
        render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <Capturador />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );
        expect(typeof capturedCtx.setFirstPage).toBe('function');
    });

    it('deve expor setShowModalLegendaInformacao como função no contexto', () => {
        let capturedCtx;
        const Capturador = () => {
            capturedCtx = useContext(GestaoDeUsuariosAdicionarUnidadeContext);
            return null;
        };
        render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <Capturador />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );
        expect(typeof capturedCtx.setShowModalLegendaInformacao).toBe('function');
    });

    it('deve manter a mesma referência do contextValue enquanto os estados não mudam (memoização)', () => {
        const refs = [];
        const Capturador = () => {
            const ctx = useContext(GestaoDeUsuariosAdicionarUnidadeContext);
            refs.push(ctx);
            return null;
        };

        const { rerender } = render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <Capturador />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );

        rerender(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <Capturador />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );

        expect(refs.length).toBeGreaterThanOrEqual(2);
        expect(refs[0]).toBe(refs[refs.length - 1]);
    });

    it('deve gerar nova referência do contextValue após mudança de estado (memoização)', () => {
        const refs = [];
        const Capturador = () => {
            const ctx = useContext(GestaoDeUsuariosAdicionarUnidadeContext);
            refs.push(ctx);
            return (
                <button onClick={() => ctx.setSearch('novo')}>atualizar</button>
            );
        };

        render(
            <GestaoDeUsuariosAdicionarUnidadeProvider>
                <Capturador />
            </GestaoDeUsuariosAdicionarUnidadeProvider>
        );

        act(() => {
            screen.getByRole('button', { name: 'atualizar' }).click();
        });

        expect(refs.length).toBeGreaterThanOrEqual(2);
        expect(refs[0]).not.toBe(refs[refs.length - 1]);
    });
});
