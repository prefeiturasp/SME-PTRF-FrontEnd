import React from 'react';
import { render, screen } from '@testing-library/react';
import { DetalhamentoAcoesPdde } from '../index';
import * as hook from '../hooks/useGetAcoesPdde';
import { visoesService } from '../../../../../../services/visoes.service';

jest.mock('../Tabela', () => () => <div data-testid="mock-tabela">Tabela Mock</div>);
jest.mock('../TabelaAcoesPDDE', () => () => <div data-testid="mock-tabela-pdde">Tabela Mock PDDE</div>);
jest.mock('../../../../../../services/visoes.service', () => ({
  visoesService: {
    featureFlagAtiva: jest.fn(),
  },
}));

describe('DetalhamentoAcoesPdde', () => {
  it('deve exibir o componente de loading quando isLoading for true', () => {
    visoesService.featureFlagAtiva.mockReturnValue(false);
    jest.spyOn(hook, 'useGetAcoesPdde').mockReturnValue({
      data: [],
      isLoading: true,
      count: 0,
    });

    render(<DetalhamentoAcoesPdde />);
    expect(screen.getByTestId('mock-tabela')).toBeInTheDocument();
  });

  it('deve renderizar a Tabela antiga (e não a TabelaAcoesPDDE) quando a flag estiver desligada', () => {
    visoesService.featureFlagAtiva.mockReturnValue(false);
    const mockData = [{ id: 1, nome: 'Ação Teste' }];
    const mockCount = 10;

    jest.spyOn(hook, 'useGetAcoesPdde').mockReturnValue({
      data: mockData,
      isLoading: false,
      count: mockCount,
    });

    render(<DetalhamentoAcoesPdde />);
    expect(screen.getByText("Ações PDDE")).toBeInTheDocument();
    expect(screen.getByTestId('mock-tabela')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-tabela-pdde')).not.toBeInTheDocument();
  });

  it('deve renderizar apenas a TabelaAcoesPDDE quando a flag estiver ligada', () => {
    visoesService.featureFlagAtiva.mockReturnValue(true);

    jest.spyOn(hook, 'useGetAcoesPdde').mockReturnValue({
      data: [],
      isLoading: false,
      count: 0,
    });

    render(<DetalhamentoAcoesPdde />);
    expect(screen.getByText("Ações PDDE")).toBeInTheDocument();
    expect(screen.getByTestId('mock-tabela-pdde')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-tabela')).not.toBeInTheDocument();
  });
});
