import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Paginacao } from '../Paginacao';
import { OutrosRecursosPeriodosPaaContext } from '../context/index';
import * as useGetHook from '../hooks/useGet'; // para mockar o hook useGet

// jest.mock('primereact/paginator', () => ({
//   Paginator: ({ onPageChange }) => (
//     <button onClick={() => onPageChange({ page: 1, first: 10 })} data-testid="paginator">
//       Próxima página
//     </button>
//   )
// }));

describe('Paginacao component', () => {
  // it('renderiza e executa onPageChange corretamente', () => {
  //   const mockSetCurrentPage = jest.fn();
  //   const mockSetFirstPage = jest.fn();

  //   // Mock do hook useGet
  //   jest.spyOn(useGetHook, 'useGetOutrosRecursos').mockReturnValue({
  //     isLoading: false,
  //     total: true,
  //     data: {
  //       count: 50
  //     }
  //   });

  //   const contextValues = {
  //     setCurrentPage: mockSetCurrentPage,
  //     setFirstPage: mockSetFirstPage,
  //     firstPage: 0,
  //     rowsPerPage: 10,
  //   };

  //   const { getByTestId } = render(
  //     <OutrosRecursosPeriodosPaaContext.Provider value={contextValues}>
  //       <Paginacao />
  //     </OutrosRecursosPeriodosPaaContext.Provider>
  //   );

  //   const paginatorButton = getByTestId('paginator');
  //   fireEvent.click(paginatorButton);

  //   expect(mockSetCurrentPage).toHaveBeenCalledWith(2); // page 1 + 1
  //   expect(mockSetFirstPage).toHaveBeenCalledWith(10);
  // });

  it('não renderiza se rowsperPage > count', async() => {
    jest.spyOn(useGetHook, 'useGetOutrosRecursos').mockReturnValue({
      isLoading: false,
      total: 1,
      data: {
        count: 1
      }
    });

    const contextValues = {
      setCurrentPage: jest.fn(),
      setFirstPage: jest.fn(),
      firstPage: 0,
      rowsPerPage: 10,
    };

    render(
      <OutrosRecursosPeriodosPaaContext.Provider value={contextValues}>
        <Paginacao />
      </OutrosRecursosPeriodosPaaContext.Provider>
    );

    const botaoPaginator = screen.queryByRole('button', { name: 'Page 2', selector: '.p-paginator-page' });
    expect(botaoPaginator).not.toBeInTheDocument();
  });
  it('renderiza se rowsperPage <= count', async() => {
    jest.spyOn(useGetHook, 'useGetOutrosRecursos').mockReturnValue({
      isLoading: false,
      total: 50,
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

    render(
      <OutrosRecursosPeriodosPaaContext.Provider value={contextValues}>
        <Paginacao />
      </OutrosRecursosPeriodosPaaContext.Provider>
    );

    const botaoPaginator = screen.getByRole('button', { name: 'Page 2', selector: '.p-paginator-page' });
    expect(botaoPaginator).toBeInTheDocument();
  });
});
