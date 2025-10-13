import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TopoComBotoes } from '../TopoComBotoes';
import { AtividadesEstatutariasContext } from '../context/index';
import * as Permissao from '../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes';

jest.mock('../../../../../Globais/UI', () => ({
  IconButton: ({ onClick, label, disabled }) => (
    <button onClick={onClick} disabled={disabled} data-testid="botao-adicionar">
      {label}
    </button>
  )
}));

describe('TopoComBotoes', () => {
  const mockSetShowModalForm = jest.fn();
  const mockSetStateFormModal = jest.fn();
  const initialStateFormModal = { nome: '', status: '' };

  const renderComponente = (temPermissao = true) => {
    jest.spyOn(Permissao, 'RetornaSeTemPermissaoEdicaoPainelParametrizacoes').mockReturnValue(temPermissao);

    return render(
      <AtividadesEstatutariasContext.Provider value={{
        setShowModalForm: mockSetShowModalForm,
        setStateFormModal: mockSetStateFormModal,
        initialStateFormModal
      }}>
        <TopoComBotoes />
      </AtividadesEstatutariasContext.Provider>
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
