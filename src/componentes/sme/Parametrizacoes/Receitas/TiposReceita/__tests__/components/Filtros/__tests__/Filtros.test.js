import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getDres } from '../../../../../../../../../services/sme/Parametrizacoes.service';
import { Filtros } from '../../../../components/Filtros';

// Mock para a função de fetchDres
jest.mock('../../../../../../../../../services/sme/Parametrizacoes.service', () => ({
  getDres: jest.fn()
}));

describe('Filtros', () => {
  const propsMock = {
    filtros: { nome_ou_codigo: '', dre: '' },
    onFilterChange: jest.fn(),
    setFiltros: jest.fn(),
    limpaFiltros: jest.fn(),
  };

  beforeEach(() => {
    // Configuração do mock para retornar uma lista de DREs
    getDres.mockResolvedValue([
      { uuid: '1', nome: 'DRE 1' },
      { uuid: '2', nome: 'DRE 2' }
    ]);

    render(<Filtros {...propsMock} />);
  });

  it('testa as labels e botões', () => {
    expect(screen.getByLabelText(/Buscar por nome ou código EOL da unidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filtrar por DRE/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
  });

  it('testa a reatividade ao alterar o campo de filtro', async () => {
    const input = screen.getByLabelText(/Buscar por nome ou código EOL da unidade/i);
    fireEvent.change(input, { target: { name: "nome_ou_codigo", value: "60000" } });

    expect(propsMock.setFiltros).toHaveBeenCalledWith({ nome_ou_codigo: '60000', dre: '' });
  });

  it('testa a chamada de LimpaFiltros ao clicar em Limpar', () => {
    const limparButton = screen.getByRole('button', { name: /limpar/i });
    fireEvent.click(limparButton);

    expect(propsMock.limpaFiltros).toHaveBeenCalled();
  });

  it('testa a chamada de Filtrar ao clicar em Filtrar', () => {
    const input = screen.getByLabelText(/Buscar por nome ou código EOL da unidade/i);
    fireEvent.change(input, { target: { name: "nome_ou_codigo", value: "Teste" } });

    const button = screen.getByRole('button', { name: /filtrar/i });
    fireEvent.click(button);

    expect(propsMock.onFilterChange).toHaveBeenCalled();
  });

  it('testa o comportamento ao selecionar uma DRE', async () => {
    await waitFor(() => {
      const select = screen.getByLabelText(/Filtrar por DRE/i);
      fireEvent.change(select, { target: { value: '1' } });

      expect(propsMock.setFiltros).toHaveBeenCalledWith({
        nome_ou_codigo: '',
        dre: '1',
      });
    });
  });

  it('testa o carregamento das DREs e renderização da lista', async () => {
    await waitFor(() => {
      const select = screen.getByLabelText(/Filtrar por DRE/i);
      expect(select).toBeInTheDocument();
      expect(select.children.length).toBeGreaterThan(1); // Deve ter mais de 1 opção
    });
  });

  it('testa quando a lista de DREs estiver vazia', async () => {
    // Mock para retornar uma lista vazia
    getDres.mockResolvedValue([]);
    render(<Filtros {...propsMock} />);

    await waitFor(() => {
      const select = screen.getByLabelText(/Filtrar por DRE/i);
      expect(select.children.length).toBe(1); // Apenas a opção "Selecione uma DRE"
    });
  });
});
