import React from 'react';
import { render, screen } from '@testing-library/react';
import { DetalhamentoAcoesPdde } from '../index';
import * as hook from '../hooks/useGetAcoesPdde';

jest.mock('../Tabela', () => () => <div data-testid="mock-tabela">Tabela Mock</div>);

describe('DetalhamentoAcoesPdde', () => {
  it('deve exibir o componente de loading quando isLoading for true', () => {
    jest.spyOn(hook, 'useGetAcoesPdde').mockReturnValue({
      data: [],
      isLoading: true,
      count: 0,
    });

    render(<DetalhamentoAcoesPdde />);
    expect(screen.getByTestId('mock-tabela')).toBeInTheDocument();
  });

  it('deve passar os dados corretamente para o componente Tabela', () => {
    const mockData = [{ id: 1, nome: 'Ação Teste' }];
    const mockCount = 10;

    jest.spyOn(hook, 'useGetAcoesPdde').mockReturnValue({
      data: mockData,
      isLoading: false,
      count: mockCount,
    });

    render(<DetalhamentoAcoesPdde />);
    expect(screen.getByTestId('mock-tabela')).toBeInTheDocument();
  });
});
