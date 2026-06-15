import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BtnAddAcoes } from '../BtnAddAcoes';

jest.mock('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock('../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext', () => ({
  useAbasPorRecursoContext: jest.fn(),
}));

jest.mock('../hooks/useAcoesDasAssociacoesContext', () => ({
  useAcoesDasAssociacoesContext: jest.fn(),
}));

jest.mock('../../../../../Globais/UI/Button', () => ({
  IconButton: ({ icon, label, onClick, disabled }) => (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label}>
      <span>{icon}</span>
      {label}
    </button>
  ),
}));

const mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes = require('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes').RetornaSeTemPermissaoEdicaoPainelParametrizacoes;
const mockUseAbasPorRecursoContext = require('../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext').useAbasPorRecursoContext;
const mockUseAcoesDasAssociacoesContext = require('../hooks/useAcoesDasAssociacoesContext').useAcoesDasAssociacoesContext;
const mockHandleOpenFormModalCreate = jest.fn();

const defaultSelectedRecurso = {
  nome: 'Programa de Transferência de Recursos Financeiros (PTRF) - Básico',
  nome_exibicao: 'PTRF Básico',
};

describe('Componente BtnAddAcoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: defaultSelectedRecurso,
    });

    mockUseAcoesDasAssociacoesContext.mockReturnValue({
      handleOpenFormModalCreate: mockHandleOpenFormModalCreate,
      isLoadingAssociacoes: false,
    });
  });

  it('deve renderizar o botão com o texto e ícone corretamente', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <BtnAddAcoes />
    );

    const button = screen.getByRole('button', { name: /adicionar ação de associação/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('faPlus')).toBeInTheDocument();
    expect(screen.getByText(/Programa de Transferência de Recursos Financeiros/i)).toBeInTheDocument();
  });

  it('deve habilitar o botão quando houver permissão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <BtnAddAcoes />
    );

    const button = screen.getByRole('button', { name: /adicionar ação de associação/i });
    expect(button).not.toBeDisabled();
  });

  it('deve desabilitar o botão quando não houver permissão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(
      <BtnAddAcoes />
    );

    const button = screen.getByRole('button', { name: /adicionar ação de associação/i });
    expect(button).toBeDisabled();
  });

  it('deve chamar as funções de callback ao clicar no botão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <BtnAddAcoes />
    );

    const button = screen.getByRole('button', { name: /adicionar ação de associação/i });
    fireEvent.click(button);

    expect(mockHandleOpenFormModalCreate).toHaveBeenCalledTimes(1);
  });
});
