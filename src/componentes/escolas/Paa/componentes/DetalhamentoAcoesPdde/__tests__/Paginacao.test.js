import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Paginacao } from '../Paginacao';

jest.mock('primereact/paginator', () => ({
  Paginator: ({ onPageChange }) => (
    <button data-testid="paginator" onClick={() => onPageChange({ page: 1, first: 20 })}>
      Paginator Mock
    </button>
  ),
}));

describe('Paginacao', () => {
  const setup = (propsOverride = {}) => {
    const defaultProps = {
      acoes: [{ id: 1, nome: 'Ação Teste' }],
      setCurrentPage: jest.fn(),
      setFirstPage: jest.fn(),
      isLoading: false,
      count: 40,
      firstPage: 0,
    };

    const props = { ...defaultProps, ...propsOverride };
    render(<Paginacao {...props} />);
    return props;
  };

  it('deve renderizar o Paginator quando não está carregando e há ações', () => {
    setup();
    expect(screen.getByTestId('paginator')).toBeInTheDocument();
  });

  it('não deve renderizar o Paginator quando está carregando', () => {
    setup({ isLoading: true });
    expect(screen.queryByTestId('paginator')).not.toBeInTheDocument();
  });

  it('não deve renderizar o Paginator quando não há ações', () => {
    setup({ acoes: [] });
    expect(screen.queryByTestId('paginator')).not.toBeInTheDocument();
  });

  it('deve chamar setCurrentPage e setFirstPage ao mudar de página', () => {
    const { setCurrentPage, setFirstPage } = setup();

    fireEvent.click(screen.getByTestId('paginator'));

    expect(setCurrentPage).toHaveBeenCalledWith(2);
    expect(setFirstPage).toHaveBeenCalledWith(20);
  });
});
