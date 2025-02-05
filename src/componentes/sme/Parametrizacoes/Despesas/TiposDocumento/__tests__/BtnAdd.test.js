import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BtnAdd } from '../BtnAdd';
import { mockCreate } from '../__fixtures__/mockData';

jest.mock('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes = require('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes').RetornaSeTemPermissaoEdicaoPainelParametrizacoes;
const mockSetShowModalForm = jest.fn();
const mockSetStateFormModal = jest.fn();
const mockInitialStateFormModal = mockCreate

describe('Componente BtnAdd', () => {
  it('deve renderizar o botão com o texto e ícone corretamente', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <BtnAdd
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={mockSetShowModalForm}
        initialStateFormModal={{}}
        setStateFormModal={mockSetStateFormModal}
      />
    );

    const button = screen.getByRole('button', { name: /adicionar tipo de documento/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('faPlusMock')).toBeInTheDocument();
  });

  it('deve habilitar o botão quando houver permissão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <BtnAdd
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={() => {}}
        initialStateFormModal={{}}
        setStateFormModal={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: /adicionar tipo de documento/i });
    expect(button).not.toBeDisabled();
  });

  it('deve desabilitar o botão quando não houver permissão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(
      <BtnAdd
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={() => {}}
        initialStateFormModal={{}}
        setStateFormModal={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: /adicionar tipo de documento/i });
    expect(button).toBeDisabled();
  });

  it('deve chamar as funções de callback ao clicar no botão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <BtnAdd
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={mockSetShowModalForm}
        initialStateFormModal={mockInitialStateFormModal}
        setStateFormModal={mockSetStateFormModal}
      />
    );

    const button = screen.getByRole('button', { name: /adicionar tipo de documento/i });
    fireEvent.click(button);

    expect(mockSetStateFormModal).toHaveBeenCalledWith(mockInitialStateFormModal);
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
  });
});
