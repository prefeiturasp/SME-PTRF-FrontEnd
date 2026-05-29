import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Paginacao } from '../Paginacao';
import { GestaoDeUsuariosListContext } from '../../context/GestaoDeUsuariosListProvider';

const mockSetCurrentPage = jest.fn();
let capturedPaginatorProps = null;

jest.mock('primereact/paginator', () => ({
    Paginator: (props) => {
        capturedPaginatorProps = props;
        return (
            <div data-testid="paginator">
                <button
                    data-testid="paginator-page-change"
                    onClick={() => props.onPageChange({ page: 2, first: 20 })}
                >
                    Próxima
                </button>
            </div>
        );
    },
}));

const renderPaginacao = (ctxOverride = {}) => {
    const contextValue = {
        count: 50,
        setCurrentPage: mockSetCurrentPage,
        ...ctxOverride,
    };
    return render(
        <GestaoDeUsuariosListContext.Provider value={contextValue}>
            <Paginacao />
        </GestaoDeUsuariosListContext.Provider>
    );
};

describe('Paginacao', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        capturedPaginatorProps = null;
    });

    it('renderiza o componente Paginator', () => {
        renderPaginacao();
        expect(screen.getByTestId('paginator')).toBeInTheDocument();
    });

    it('passa totalRecords correto para o Paginator', () => {
        renderPaginacao({ count: 100 });
        expect(capturedPaginatorProps.totalRecords).toBe(100);
    });

    it('passa rows=10 para o Paginator', () => {
        renderPaginacao();
        expect(capturedPaginatorProps.rows).toBe(10);
    });

    it('inicia com first=0 no Paginator', () => {
        renderPaginacao();
        expect(capturedPaginatorProps.first).toBe(0);
    });

    it('passa o template correto para o Paginator', () => {
        renderPaginacao();
        expect(capturedPaginatorProps.template).toBe('PrevPageLink PageLinks NextPageLink');
    });

    it('chama setCurrentPage com page+1 ao mudar de página', () => {
        renderPaginacao();
        act(() => {
            screen.getByTestId('paginator-page-change').click();
        });
        expect(mockSetCurrentPage).toHaveBeenCalledWith(3);
    });

    it('atualiza first ao mudar de página', () => {
        renderPaginacao();
        act(() => {
            screen.getByTestId('paginator-page-change').click();
        });
        expect(capturedPaginatorProps.first).toBe(20);
    });
});
