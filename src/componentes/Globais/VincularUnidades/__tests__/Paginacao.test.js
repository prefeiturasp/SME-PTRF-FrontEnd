import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Paginacao } from '../Paginacao';

jest.mock('primereact/paginator', () => ({
  Paginator: ({ onPageChange, ...props }) => (
    <button
      data-testid="paginator"
      onClick={() =>
        onPageChange({
          page: 1,
          first: 10,
        })
      }
    >
      Mock Paginator
    </button>
  ),
}));


describe('Paginacao', () => {
  test('não deve renderizar o paginator quando count <= rowsPerPage', () => {
    render(
      <Paginacao
        data={{ count: 10 }}
        rowsPerPage={10}
      />
    );

    expect(screen.queryByTestId('paginator')).not.toBeInTheDocument();
  });

  test('deve renderizar o paginator quando count > rowsPerPage', () => {
    render(
      <Paginacao
        data={{ count: 25 }}
        rowsPerPage={10}
      />
    );

    expect(screen.getByTestId('paginator')).toBeInTheDocument();
  });

  test('deve chamar onPageChange com página correta e first correto', () => {
    const onPageChange = jest.fn();

    render(
      <Paginacao
        data={{ count: 30 }}
        rowsPerPage={10}
        firstPage={0}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByTestId('paginator'));

    expect(onPageChange).toHaveBeenCalledWith(2, 10);
  });

  test('deve usar valores default quando props não são informadas', () => {
    const onPageChange = jest.fn();

    render(
      <Paginacao
        data={{ count: 20 }}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByTestId('paginator'));

    expect(onPageChange).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number)
    );
  });

  test('não deve quebrar quando data é undefined', () => {
    render(<Paginacao />);

    expect(screen.queryByTestId('paginator')).not.toBeInTheDocument();
  });
});
