import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Paginacao } from '../Paginacao';
import { PeriodosPaaContext } from '../context/index';
import * as useGetHook from '../hooks/useGet'; // para mockar o hook useGet

jest.mock('primereact/paginator', () => ({
  Paginator: ({ onPageChange }) => (
    <button onClick={() => onPageChange({ page: 1, first: 10 })} data-testid="paginator">
      Próxima página
    </button>
  )
}));

describe('Paginacao component', () => {
  it('renderiza e executa onPageChange corretamente', () => {
    const mockSetCurrentPage = jest.fn();
    const mockSetFirstPage = jest.fn();

    // Mock do hook useGet
    jest.spyOn(useGetHook, 'useGet').mockReturnValue({
      isLoading: false,
      total: true,
      data: {
        count: 50
      }
    });

    const contextValues = {
      setCurrentPage: mockSetCurrentPage,
      setFirstPage: mockSetFirstPage,
      firstPage: 0,
      rowsPerPage: 10,
    };

    const { getByTestId } = render(
      <PeriodosPaaContext.Provider value={contextValues}>
        <Paginacao />
      </PeriodosPaaContext.Provider>
    );

    const paginatorButton = getByTestId('paginator');
    fireEvent.click(paginatorButton);

    expect(mockSetCurrentPage).toHaveBeenCalledWith(2); // page 1 + 1
    expect(mockSetFirstPage).toHaveBeenCalledWith(10);
  });

  it('não renderiza se isLoading for true', () => {
    jest.spyOn(useGetHook, 'useGet').mockReturnValue({
      isLoading: true,
      total: true,
      data: {
        count: 50
      }
    });

    const contextValues = {
      setCurrentPage: jest.fn(),
      setFirstPage: jest.fn(),
      firstPage: 0,
      rowsPerPage: 10,
    };

    const { queryByTestId } = render(
      <PeriodosPaaContext.Provider value={contextValues}>
        <Paginacao />
      </PeriodosPaaContext.Provider>
    );

    expect(queryByTestId('paginator')).toBeNull();
  });
});
