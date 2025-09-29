
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DetalhedasPrestacoesPage } from '../index';

jest.mock('../../../../paginas/PaginasContainer', () => ({
  PaginasContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="paginas-container">{children}</div>
  ),
}));

jest.mock(
  '../../../../componentes/escolas/PrestacaoDeContas/DetalheDasPrestacoes',
  () => ({
    DetalheDasPrestacoes: () => (
      <div data-testid="detalhe-das-prestacoes">Detalhe Mock</div>
    ),
  })
);


describe('DetalhedasPrestacoesPage', () => {
  it('renderiza o PaginasContainer e o DetalheDasPrestacoes', () => {
    const { container } = render(<DetalhedasPrestacoesPage />);

    expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
    expect(
      container.querySelector('.page-content-inner.pt-0')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('detalhe-das-prestacoes')
    ).toBeInTheDocument();
  });
});