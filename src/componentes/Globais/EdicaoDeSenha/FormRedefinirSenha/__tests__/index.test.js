import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormRedefinirSenha } from '../index';
import { redefinirMinhaSenha } from "../../../../../services/auth.service";
import {MedidorForcaSenha} from "../../../MedidorForcaSenha";
import { useParams, Redirect } from 'react-router-dom';

// Mock the required modules and services
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  Redirect: jest.fn()
}));

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
    useParams.mockReturnValue({ uuid: mockUuid });
    localStorage.clear();
    localStorage.setItem('medidorSenha', '8');
  });

  const fillFormWithValidData = () => {
    const novaSenhaInput = screen.getByLabelText('Nova Senha');
    const confirmacaoSenhaInput = screen.getByLabelText('Confirmação da Nova Senha');

    fireEvent.change(novaSenhaInput, { target: { value: 'NovaSenha123!' } });
    fireEvent.change(confirmacaoSenhaInput, { target: { value: 'NovaSenha123!' } });
  };

  it('Renderiza campos do form corretamente', () => {
    render(<FormRedefinirSenha {...mockProps} />);

    expect(screen.getByLabelText('Nova Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmação da Nova Senha')).toBeInTheDocument();
    expect(screen.getByText('Continuar')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('Mensagens de validação para campos vazios', async () => {
    render(<FormRedefinirSenha {...mockProps} />);
    
    const submitButton = screen.getByText('Continuar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Campo nova senha é obrigatório/i)).toBeInTheDocument();
    });
  });

  it('Validação de confirmação de senha', async () => {
    render(<FormRedefinirSenha {...mockProps} />);

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
    
    render(<FormRedefinirSenha {...mockProps} />);
    
    fillFormWithValidData();

    const submitButton = screen.getByText('Continuar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(redefinirMinhaSenha).toHaveBeenCalledWith({
        hash_redefinicao: mockUuid,
        password: 'NovaSenha123!',
        password2: 'NovaSenha123!'
      });
      expect(Redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          to: {
            pathname: mockProps.redirectUrlSucesso,
            redefinicaoDeSenha: {
              msg: mockProps.textoSucesso,
              alertCss: mockProps.cssAlertSucesso
            }
          }
        }),
        expect.any(Object)
      );
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

    render(<FormRedefinirSenha {...mockProps} />);
    
    fillFormWithValidData();

    const submitButton = screen.getByText('Continuar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('Desabilitar botão continuar quando força da senha for baixa', () => {
    localStorage.setItem('medidorSenha', '6');
    render(<FormRedefinirSenha {...mockProps} />);
    
    const submitButton = screen.getByText('Continuar');
    expect(submitButton).toBeDisabled();
  });

  it('Redireciona para login quando clicar no botão Sair', () => {
    const mockAssign = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { assign: mockAssign },
      writable: true
    });

    render(<FormRedefinirSenha {...mockProps} />);
    
    const sairButton = screen.getByText('Sair');
    fireEvent.click(sairButton);

    expect(mockAssign).toHaveBeenCalledWith('/login');
  });

  it('Renderiza texto de validação de senha quando textoValidacaoDentroDoForm é true', () => {
    render(<FormRedefinirSenha {...mockProps} />);
    expect(screen.getByText('Requisitos de seguranca da senha:')).toBeInTheDocument();
  });

}); 