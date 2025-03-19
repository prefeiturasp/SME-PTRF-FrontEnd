import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BtnAddAcoes } from '../BtnAddAcoes';

const mockCreate = {

}

jest.mock('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes = require('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes').RetornaSeTemPermissaoEdicaoPainelParametrizacoes;
const mockSetShowModalForm = jest.fn();
const mockSetStateFormModal = jest.fn();
const mockInitialStateFormModal = mockCreate

describe('Componente BtnAddAcoes', () => {
  it('deve renderizar o botão com o texto e ícone corretamente', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <BtnAddAcoes
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={mockSetShowModalForm}
        initialStateFormModal={{}}
        setStateFormModal={mockSetStateFormModal}
      />
    );

    const button = screen.getByRole('button', { name: /adicionar ação de associação/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('faPlusMock')).toBeInTheDocument();
  });

  it('deve habilitar o botão quando houver permissão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <BtnAddAcoes
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={() => {}}
        initialStateFormModal={{}}
        setStateFormModal={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: /adicionar ação de associação/i });
    expect(button).not.toBeDisabled();
  });

  it('deve desabilitar o botão quando não houver permissão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(
      <BtnAddAcoes
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={() => {}}
        initialStateFormModal={{}}
        setStateFormModal={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: /adicionar ação de associação/i });
    expect(button).toBeDisabled();
  });

  it('deve chamar as funções de callback ao clicar no botão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <BtnAddAcoes
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={mockSetShowModalForm}
        initialStateFormModal={mockInitialStateFormModal}
        setStateFormModal={mockSetStateFormModal}
      />
    );

    const button = screen.getByRole('button', { name: /adicionar ação de associação/i });
    fireEvent.click(button);

    expect(mockSetStateFormModal).toHaveBeenCalledWith(mockInitialStateFormModal);
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
  });
});
