import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { FormRedefinirSenha } from '../index';
import { redefinirMinhaSenha } from "../../../../../services/auth.service";
import {MedidorForcaSenha} from "../../../MedidorForcaSenha";

// Mock the required modules and services
jest.mock("../../../../../services/auth.service", () => ({
  redefinirMinhaSenha: jest.fn()
}));

jest.mock("../../../MedidorForcaSenha", () => ({
  MedidorForcaSenha: jest.fn(),
}));

describe('FormRedefinirSenha Component', () => {
  const mockProps = {
    textoValidacaoDentroDoForm: true,
    redirectUrlSucesso: '/login',
    textoSucesso: 'Senha redefinida com sucesso',
    cssAlertSucesso: 'alert-success',
    cssAlertErro: 'alert-danger'
  };

  const mockUuid = 'test-uuid-123';

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('medidorSenha', '8');
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={[`/redefinir-senha/${mockUuid}`]}>
        <Routes>
          <Route path="/redefinir-senha/:uuid" element={<FormRedefinirSenha {...mockProps} />} />
        </Routes>
      </MemoryRouter>
    );
  };

  const fillFormWithValidData = () => {
    const novaSenhaInput = screen.getByLabelText('Nova Senha');
    const confirmacaoSenhaInput = screen.getByLabelText('Confirmação da Nova Senha');

    fireEvent.change(novaSenhaInput, { target: { value: 'NovaSenha123!' } });
    fireEvent.change(confirmacaoSenhaInput, { target: { value: 'NovaSenha123!' } });
  };

  it('Renderiza campos do form corretamente', () => {
    renderComponent();

    expect(screen.getByLabelText('Nova Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmação da Nova Senha')).toBeInTheDocument();
    expect(screen.getByText('Continuar')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('Mensagens de validação para campos vazios', async () => {
    renderComponent();
    
    const submitButton = screen.getByText('Continuar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Campo nova senha é obrigatório/i)).toBeInTheDocument();
    });
  });

  it('Validação de confirmação de senha', async () => {
    renderComponent();

    const novaSenhaInput = screen.getByLabelText('Nova Senha');
    const confirmacaoSenhaInput = screen.getByLabelText('Confirmação da Nova Senha');

    fireEvent.change(novaSenhaInput, { target: { value: 'NovaSenha123!' } });
    fireEvent.change(confirmacaoSenhaInput, { target: { value: 'SenhaDiferente123!' } });
    fireEvent.blur(confirmacaoSenhaInput);
    
    await waitFor(() => {
      expect(screen.getByText(/As Senhas precisam ser iguais/i)).toBeInTheDocument();
    });
  });

  it('Redefinir senha com sucesso', async () => {
    MedidorForcaSenha.mockResolvedValueOnce(true);
    redefinirMinhaSenha.mockResolvedValueOnce({});
    
    renderComponent();
    
    fillFormWithValidData();

    const submitButton = screen.getByText('Continuar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(redefinirMinhaSenha).toHaveBeenCalledWith({
        hash_redefinicao: mockUuid,
        password: 'NovaSenha123!',
        password2: 'NovaSenha123!'
      });
    });
  });

  it('Erro ao redefinir senha', async () => {
    const errorMessage = 'Erro ao redefinir senha';
    redefinirMinhaSenha.mockRejectedValueOnce({
      response: {
        data: {
          detail: errorMessage
        }
      }
    });

    renderComponent();
    
    fillFormWithValidData();

    const submitButton = screen.getByText('Continuar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('Desabilitar botão continuar quando força da senha for baixa', () => {
    localStorage.setItem('medidorSenha', '6');
    renderComponent();
    
    const submitButton = screen.getByText('Continuar');
    expect(submitButton).toBeDisabled();
  });

  it('Redireciona para login quando clicar no botão Sair', () => {
    const mockAssign = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { assign: mockAssign },
      writable: true
    });

    renderComponent();
    
    const sairButton = screen.getByText('Sair');
    fireEvent.click(sairButton);

    expect(mockAssign).toHaveBeenCalledWith('/login');
  });

  it('Renderiza texto de validação de senha quando textoValidacaoDentroDoForm é true', () => {
    renderComponent();
    expect(screen.getByText('Requisitos de seguranca da senha:')).toBeInTheDocument();
  });

}); 