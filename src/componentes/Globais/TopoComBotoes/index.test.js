import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TopoComBotoes } from '../TopoComBotoes';

import * as Permissao from '../../sme/Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes';

jest.mock('../../Globais/UI', () => ({
  IconButton: ({ onClick, label, disabled, 'data-testid': dataTestId }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId || 'botao-icone'}
    >
      {label}
    </button>
  ),
}));

describe('TopoComBotoes', () => {
  const mockOnClick = jest.fn();

  const renderComponente = (temPermissao = true) => {
    jest
      .spyOn(Permissao, 'RetornaSeTemPermissaoEdicaoPainelParametrizacoes')
      .mockReturnValue(temPermissao);

    return render(
      <TopoComBotoes onClick={mockOnClick} label="Adicionar" icone="faPlus" />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o botão e permite clique quando há permissão', () => {
    const { getByTestId } = renderComponente(true);

    const botao = getByTestId('botao-icone');
    expect(botao).not.toBeDisabled();

    fireEvent.click(botao);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('desabilita o botão quando não há permissão', () => {
    const { getByTestId } = renderComponente(false);

    const botao = getByTestId('botao-icone');
    expect(botao).toBeDisabled();

    fireEvent.click(botao);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('renderiza o label corretamente', () => {
    const { getByTestId } = renderComponente(true);
    expect(getByTestId('botao-icone')).toHaveTextContent('Adicionar');
  });
});
