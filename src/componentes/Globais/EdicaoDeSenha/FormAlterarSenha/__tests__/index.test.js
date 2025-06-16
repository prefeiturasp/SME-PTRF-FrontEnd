import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormAlterarSenha } from '../index';
import { alterarMinhaSenha, USUARIO_LOGIN } from "../../../../../services/auth.service";
import {MedidorForcaSenha} from "../../../MedidorForcaSenha";
import { act } from 'react-dom/test-utils';

jest.mock("../../../MedidorForcaSenha", () => ({
  MedidorForcaSenha: jest.fn(),
}));

// Mock the required modules and services
jest.mock("../../../../../services/auth.service", () => ({
  alterarMinhaSenha: jest.fn(),
  USUARIO_LOGIN: 'USUARIO_LOGIN'
}));

describe('FormAlterarSenha Componente', () => {
  const mockHandleClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem(USUARIO_LOGIN, 'test-user');
    localStorage.setItem('medidorSenha', '8'); // Setting initial password strength
  });

  const fillFormWithValidData = () => {
    const senhaAtualInput = screen.getByLabelText('Senha atual');
    const novaSenhaInput = screen.getByLabelText('Nova Senha');
    const confirmacaoSenhaInput = screen.getByLabelText('Confirmação da Nova Senha');

    fireEvent.change(senhaAtualInput, { target: { value: 'SenhaAtual123!' } });
    fireEvent.change(novaSenhaInput, { target: { value: 'NovaSenha123!' } });
    fireEvent.change(confirmacaoSenhaInput, { target: { value: 'NovaSenha123!' } });
  };

  it('renders form fields correctly', () => {
    render(<FormAlterarSenha handleClose={mockHandleClose} />);

    expect(screen.getByLabelText('Senha atual')).toBeInTheDocument();
    expect(screen.getByLabelText('Nova Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmação da Nova Senha')).toBeInTheDocument();
    expect(screen.getByText('Continuar')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });


  it('Alterar senha com sucesso', async () => {
    MedidorForcaSenha.mockResolvedValueOnce(true);
    alterarMinhaSenha.mockResolvedValueOnce({});
    render(<FormAlterarSenha handleClose={mockHandleClose} />);
    
    fillFormWithValidData();

    const submitButton = screen.getByText('Continuar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(alterarMinhaSenha).toHaveBeenCalledWith('test-user', {
        password_atual: 'SenhaAtual123!',
        password: 'NovaSenha123!',
        password2: 'NovaSenha123!'
      });
    });
  });

  it('Erro senha atual incorreta', async () => {
    alterarMinhaSenha.mockRejectedValueOnce({
      response: {
        data: {
          detail: "{'detail': ErrorDetail(string='Senha atual incorreta', code='invalid')}"
        }
      }
    });

    render(<FormAlterarSenha handleClose={mockHandleClose} />);
    
    fillFormWithValidData();

    const submitButton = screen.getByText('Continuar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Senha atual incorreta')).toBeInTheDocument();
    });
  });

  it('Erro genérico do servidor', async () => {
    const errorMessage = 'Erro genérico do servidor';
    alterarMinhaSenha.mockRejectedValueOnce({
      response: {
        data: {
          detail: errorMessage
        }
      }
    });

    render(<FormAlterarSenha handleClose={mockHandleClose} />);
    
    fillFormWithValidData();

    const submitButton = screen.getByText('Continuar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('Desabilitar botão continuar quando força da senha for baixa', () => {
    localStorage.setItem('medidorSenha', '6');
    render(<FormAlterarSenha handleClose={mockHandleClose} />);
    
    const submitButton = screen.getByText('Continuar');
    expect(submitButton).toBeDisabled();
  });

  it('handleClose quando clicar no botão Sair', () => {
    render(<FormAlterarSenha handleClose={mockHandleClose} />);
    
    const sairButton = screen.getByText('Sair');
    fireEvent.click(sairButton);

    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('Atualiza valores do form quando digitar', async () => {
    render(<FormAlterarSenha handleClose={mockHandleClose} />);
    
    const senhaAtualInput = screen.getByLabelText('Senha atual');
    fireEvent.change(senhaAtualInput, { target: { value: 'TesteSenha123!' } });
    fireEvent.blur(senhaAtualInput);

    expect(senhaAtualInput.value).toBe('TesteSenha123!');
  });


  it('Renderiza texto de validação de senha quando textoValidacaoDentroDoForm é true', () => {
    render(<FormAlterarSenha 
      handleClose={mockHandleClose}
      textoValidacaoDentroDoForm={true}
    />);

    expect(screen.getByText('Requisitos de seguranca da senha:')).toBeInTheDocument();
  });
});