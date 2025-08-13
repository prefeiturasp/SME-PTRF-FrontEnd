import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BarraAcaoEmLote } from '../BarraAcaoEmLote';

const mockSetPrioridadesSelecionadas = jest.fn();
const mockHandleExcluirPrioridades = jest.fn();

const renderizaComponente = (prioridadesSelecionadas = ['uuid1', 'uuid2']) => {
  return render(
    <BarraAcaoEmLote
      setPrioridadesSelecionadas={mockSetPrioridadesSelecionadas}
      prioridadesSelecionadas={prioridadesSelecionadas}
      handleExcluirPrioridades={mockHandleExcluirPrioridades}
    />
  );
};

describe('BarraAcaoEmLote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza a barra com o número correto de prioridades selecionadas', () => {
    renderizaComponente(['uuid1', 'uuid2', 'uuid3']);

    expect(screen.getByText('3 prioridades selecionadas')).toBeInTheDocument();
  });

  test('renderiza texto singular quando há apenas uma prioridade selecionada', () => {
    renderizaComponente(['uuid1']);

    expect(screen.getByText('1 prioridade selecionada')).toBeInTheDocument();
  });

  test('chama handleExcluirPrioridades quando clica no botão excluir', () => {
    renderizaComponente();

    const botaoExcluir = screen.getByRole('button', { name: /excluir prioridade/i });
    fireEvent.click(botaoExcluir);

    expect(mockHandleExcluirPrioridades).toHaveBeenCalledTimes(1);
  });

  test('chama setPrioridadesSelecionadas com array vazio quando clica no botão cancelar', () => {
    renderizaComponente();

    const botaoCancelar = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(botaoCancelar);

    expect(mockSetPrioridadesSelecionadas).toHaveBeenCalledWith([]);
  });

  test('renderiza os botões com os ícones corretos', () => {
    renderizaComponente();

    const botaoExcluir = screen.getByRole('button', { name: /excluir prioridade/i });
    const botaoCancelar = screen.getByRole('button', { name: /cancelar/i });

    expect(botaoExcluir).toBeInTheDocument();
    expect(botaoCancelar).toBeInTheDocument();
  });

  test('renderiza o separador entre os botões', () => {
    renderizaComponente();

    const separador = screen.getByText('|');
    expect(separador).toBeInTheDocument();
  });
}); 