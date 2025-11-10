import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExecucaoDoPaa } from '../index';

// Mock do PaginasContainer
jest.mock('../../../../../paginas/PaginasContainer', () => ({
  PaginasContainer: ({ children }) => (
    <div data-testid="paginas-container">{children}</div>
  ),
}));

describe('ExecucaoDoPaa', () => {
  it('renderiza o componente corretamente', () => {
    render(<ExecucaoDoPaa />);

    expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
    expect(screen.getByText('Execução do PAA')).toBeInTheDocument();

  });

  it('aplica as classes de estilo esperadas', () => {
    render(<ExecucaoDoPaa />);

    const title = screen.getByText('Execução do PAA');
    expect(title).toHaveClass('titulo-itens-painel');
    expect(title).toHaveClass('mt-5');
  });
});
