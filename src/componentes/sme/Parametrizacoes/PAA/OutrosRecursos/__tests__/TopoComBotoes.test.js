import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TopoComBotoes } from '../TopoComBotoes';
import { OutrosRecursosPaaContext } from '../context/index';
import * as Permissao from '../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes';

jest.mock('../../../../../Globais/UI', () => ({
  IconButton: ({ onClick, label, disabled }) => (
    <button onClick={onClick} disabled={disabled} data-testid="botao-adicionar">
      {label}
    </button>
  )
}));

describe('TopoComBotoes', () => {
  beforeEach(() => {
      window.matchMedia = jest.fn().mockImplementation((query) => ({
          matches: false,
          addListener: jest.fn(),
          removeListener: jest.fn(),
      }));
  });
  const mockSetShowModalForm = jest.fn();
  const mockSetStateFormModal = jest.fn();
  const initialStateFormModal = { nome: '', status: '' };

  const renderComponente = (temPermissao = true) => {
    jest.spyOn(Permissao, 'RetornaSeTemPermissaoEdicaoPainelParametrizacoes').mockReturnValue(temPermissao);

    return render(
      <OutrosRecursosPaaContext.Provider value={{
        setShowModalForm: mockSetShowModalForm,
        setStateFormModal: mockSetStateFormModal,
        initialStateFormModal
      }}>
        <TopoComBotoes />
      </OutrosRecursosPaaContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o botão e chama as funções corretamente ao clicar', () => {
    const { getByTestId } = renderComponente();

    const botao = getByTestId('botao-adicionar');
    fireEvent.click(botao);

    expect(mockSetStateFormModal).toHaveBeenCalledWith(initialStateFormModal);
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
  });

  it('desabilita o botão quando não há permissão', () => {
    const { getByTestId } = renderComponente(false);

    const botao = getByTestId('botao-adicionar');
    expect(botao).toBeDisabled();
  });
});
