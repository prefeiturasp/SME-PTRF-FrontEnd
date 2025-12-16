import React from 'react';
import { MemoryRouter, useNavigate } from "react-router-dom";
import { render, fireEvent } from '@testing-library/react';
import { TopoComBotoes } from '../TopoComBotoes';
import { PeriodosPaaContext } from '../context/index';
import * as Permissao from '../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes';


jest.mock('../../../../../Globais/UI', () => ({
  IconButton: ({ onClick, label, disabled }) => (
    <button onClick={onClick} disabled={disabled} data-testid="botao-adicionar">
      {label}
    </button>
  )
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

describe('TopoComBotoes', () => {
  const initialStateFormModal = { referencia: '', outro_recurso: '' };

  const renderComponente = (temPermissao = true) => {
    jest.spyOn(Permissao, 'RetornaSeTemPermissaoEdicaoPainelParametrizacoes').mockReturnValue(temPermissao);

    return render(
      <MemoryRouter>
        <PeriodosPaaContext.Provider value={{
          initialStateFormModal
        }}>
          <TopoComBotoes />
        </PeriodosPaaContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renderiza o botão e chama as funções corretamente ao clicar', () => {
    const { getByTestId } = renderComponente();

    const botao = getByTestId('botao-adicionar');
    fireEvent.click(botao);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/cadastro-periodo-paa');
  });

});
