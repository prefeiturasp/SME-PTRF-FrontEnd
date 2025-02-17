import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BtnAddTags } from '../BtnAddTags';
import { mockCreate } from '../__fixtures__/mockData';

jest.mock('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes = require('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes').RetornaSeTemPermissaoEdicaoPainelParametrizacoes;
const mockSetShowModalForm = jest.fn();
const mockSetStateFormModal = jest.fn();

describe('Componente BtnAdd', () => {
  const renderBtnAdd = (permission = true) => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(permission);
    render(
      <BtnAddTags
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={mockSetShowModalForm}
        initialStateFormModal={mockCreate}
        setStateFormModal={mockSetStateFormModal}
      />
    );
  };

  it('Deve renderizar o botão com o texto e ícone corretamente', () => {
    renderBtnAdd();

    const button = screen.getByRole('button', { name: /adicionar etiqueta\/tag/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('faPlusMock')).toBeInTheDocument();
  });

  it('Deve habilitar o botão quando houver permissão', () => {
    renderBtnAdd(true);

    const button = screen.getByRole('button', { name: /adicionar etiqueta\/tag/i });
    expect(button).not.toBeDisabled();
  });

  it('Deve desabilitar o botão quando não houver permissão', () => {
    renderBtnAdd(false);

    const button = screen.getByRole('button', { name: /adicionar etiqueta\/tag/i });
    expect(button).toBeDisabled();
  });

  it('Deve chamar as funções de callback ao clicar no botão', () => {
    renderBtnAdd(true);

    const button = screen.getByRole('button', { name: /adicionar etiqueta\/tag/i });
    fireEvent.click(button);

    expect(mockSetStateFormModal).toHaveBeenCalledWith(mockCreate);
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
  });
});
