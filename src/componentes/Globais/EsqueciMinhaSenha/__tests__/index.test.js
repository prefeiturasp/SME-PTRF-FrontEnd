import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EsqueciMinhaSenha } from '../index';
import { esqueciMinhaSenha } from "../../../../services/auth.service";
import { act } from 'react-dom/test-utils';

// Mock the required modules and services
jest.mock("../../../../services/auth.service", () => ({
  esqueciMinhaSenha: jest.fn()
}));

jest.mock("react-google-recaptcha", () => {
  const mockReact = require("react");
  const MockRecaptcha = mockReact.forwardRef(({ onChange }, ref) => {
    mockReact.useImperativeHandle(ref, () => ({ reset: jest.fn() }));
    mockReact.useEffect(() => { onChange?.("test-captcha-token"); }, []);
    return mockReact.createElement("div", { "data-testid": "recaptcha-mock" });
  });
  return MockRecaptcha;
});

jest.mock("../../../../services/Core.service", () => ({
  getFeatureFlags: jest.fn().mockResolvedValue({ recaptcha: false }),
}));


describe('EsqueciMinhaSenha Componente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Recuperação de senha com sucesso', async () => {
    const mockResponse = {
      username: 'testuser',
      email: 'test@example.com'
    };

    esqueciMinhaSenha.mockResolvedValueOnce(mockResponse);

    render(<EsqueciMinhaSenha />);

    await waitFor(() => {
      expect(screen.getByLabelText('Usuário')).toBeInTheDocument();
    });

    const inputUsuario = screen.getByLabelText('Usuário');
    const submitButton = screen.getByText('Continuar');

    fireEvent.change(inputUsuario, { target: { value: 'testuser' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(esqueciMinhaSenha).toHaveBeenCalledWith(
        { username: 'testuser' },
        'testuser'
      );
    });
    await waitFor(() => {
      expect(screen.getByText('Recuperação de Senha')).toBeInTheDocument();
      expect(screen.getByText(/Seu link de recuperação de senha foi enviado para/i)).toBeInTheDocument();
    });
  });

  it('Erro ao recuperar senha', async () => {
    const errorMessage = 'Usuário não encontrado';
    esqueciMinhaSenha.mockRejectedValueOnce({
      response: {
        data: {
          detail: errorMessage
        }
      }
    });

    render(<EsqueciMinhaSenha />);

    const inputUsuario = screen.getByLabelText('Usuário');
    const submitButton = screen.getByText('Continuar');

    fireEvent.change(inputUsuario, { target: { value: 'testuser_errado' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Usuário não encontrado')).toBeInTheDocument();
    });
  });

}); 