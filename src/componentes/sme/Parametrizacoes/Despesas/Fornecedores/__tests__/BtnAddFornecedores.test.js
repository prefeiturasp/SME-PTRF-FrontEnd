import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BtnAddFornecedores } from '../BtnAddFornecedores';
import { mockCreate } from './../__fixtures__/mockData';

const mockSetShowModalForm = jest.fn();
const mockSetStateFormModal = jest.fn();
const mockInitialStateFormModal = mockCreate

describe('Componente BtnAdd', () => {
  it('deve renderizar o botão com o texto e ícone corretamente', () => {
    render(
      <BtnAddFornecedores
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={mockSetShowModalForm}
        initialStateFormModal={{}}
        setStateFormModal={mockSetStateFormModal}
        temPermissaoEditarFornecedores={() => true}
      />
    );
    const button = screen.getByRole('button', { name: /Adicionar fornecedor/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('faPlusMock')).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('deve desabilitar o botão quando não houver permissão', () => {
    
    render(
      <BtnAddFornecedores
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={() => {}}
        initialStateFormModal={{}}
        setStateFormModal={() => {}}
        temPermissaoEditarFornecedores={() => false}
      />
    );
    const button = screen.getByRole('button', { name: /Adicionar fornecedor/i });
    expect(button).toBeDisabled();
  });

  it('deve chamar as funções de callback ao clicar no botão', () => {
    
    render(
      <BtnAddFornecedores
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={mockSetShowModalForm}
        initialStateFormModal={mockInitialStateFormModal}
        setStateFormModal={mockSetStateFormModal}
        temPermissaoEditarFornecedores={() => true}
      />
    );
    const button = screen.getByRole('button', { name: /Adicionar fornecedor/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(mockSetStateFormModal).toHaveBeenCalledWith(mockInitialStateFormModal);
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
  });
});