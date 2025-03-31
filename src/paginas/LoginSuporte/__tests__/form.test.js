import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React  from "react";
import { LoginSuporteForm } from "../form";
import { authService } from "../../../services/auth.service";

jest.mock("../../../services/auth.service", () => ({
  authService:{
    login: jest.fn()
  }
}));

describe('<LoginSuporteForm>', () => {
  beforeAll(() => {
    delete window.location;
    window.location = { assign: jest.fn() };
  })
  test('Deve validar mensagens de erro ao submeter o formulário sem inserir usuário/senha', async () => {
    render(
        <LoginSuporteForm/>
    )

    const botao_login = screen.getByText('Acessar');
    fireEvent.click(botao_login);
    await waitFor(() => {
      expect(botao_login).toBeInTheDocument();
      expect(screen.getByText("Campo Usuário é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("Campo Senha é obrigatório")).toBeInTheDocument();

    });
  });

  test('Deve testar usuário e senha inválidos', async () => {
    authService.login.mockResolvedValue({detail: 'Senha inválida!'})
    render(
        <LoginSuporteForm/>
    )

    const campo_usuario = screen.getByLabelText('Usuário');
    fireEvent.click(campo_usuario);
    fireEvent.change(campo_usuario, { target: { value: "user-teste" } });
    const campo_senha = screen.getByLabelText('Senha');
    fireEvent.click(campo_senha);
    fireEvent.change(campo_senha, { target: { value: "senha-teste" } });

    const botao_login = screen.getByText('Acessar');
    expect(botao_login).toBeInTheDocument();
    fireEvent.click(botao_login);
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalled()
    })
  });

  test('Deve testar usuário e senha válidos', async () => {
    authService.login.mockResolvedValue({detail: 'ok'})
    render(
        <LoginSuporteForm/>
    )

    const campo_usuario = screen.getByLabelText('Usuário');
    fireEvent.click(campo_usuario);
    fireEvent.change(campo_usuario, { target: { value: "user-teste" } });
    const campo_senha = screen.getByLabelText('Senha');
    fireEvent.click(campo_senha);
    fireEvent.change(campo_senha, { target: { value: "senha-teste" } });

    const botao_login = screen.getByText('Acessar');
    expect(botao_login).toBeInTheDocument();
    fireEvent.click(botao_login);
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalled()
    })
  });

  test('Deve testar o exibir/ocultar senha', async () => {  
    render(
        <LoginSuporteForm/>
    )

    const campo_senha = screen.getByLabelText('Senha');
    fireEvent.click(campo_senha);
    fireEvent.change(campo_senha, { target: { value: "senha-teste" } });

    const iconElement = screen.getByTestId('mostrar-senha');
    // click para exibir
    fireEvent.click(iconElement);
    expect(campo_senha).toHaveAttribute('type', 'text');
    // click para ocultar
    fireEvent.click(iconElement);
    expect(campo_senha).toHaveAttribute('type', 'password');
    
    expect(iconElement).toBeInTheDocument();
  });

  test('Deve testar o botao "esqueci a senha"', async () => {
    render(
        <LoginSuporteForm/>
    )
    const botao_esqueci_senha = screen.getByText('Esqueci minha senha');
    expect(botao_esqueci_senha).toBeInTheDocument();
    fireEvent.click(botao_esqueci_senha);
    expect(window.location.assign).toHaveBeenCalledWith("/esqueci-minha-senha/");
  });

  test('Deve testar o botao "Retornar para a página principal"', async () => {
    render(
        <LoginSuporteForm/>
    )
    const botao_inicio = screen.getByText('Retornar para a página principal');
    expect(botao_inicio).toBeInTheDocument();
    fireEvent.click(botao_inicio);
    expect(window.location.assign).toHaveBeenCalledWith("/login");
  });

});
