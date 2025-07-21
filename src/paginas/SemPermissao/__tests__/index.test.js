import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { PaginaSemPermissao } from "../index";
import { MemoryRouter } from "react-router-dom";

describe('<PaginaSemPermissao>', () => {
  beforeAll(() => {
    delete window.location;
    window.location = { assign: jest.fn() };
});
  test('Deve renderizar o componente', async () => {
    render(
        <MemoryRouter>
          <PaginaSemPermissao/>
        </MemoryRouter>
    )
    expect(screen.getByText("Você não tem permissao para acessar essa página")).toBeInTheDocument();
    const botao_login = screen.getByText('Ir para a tela de login');
    expect(botao_login).toBeInTheDocument();
    fireEvent.click(botao_login);
    expect(window.location.assign).toHaveBeenCalledWith("/login");
  });

});
