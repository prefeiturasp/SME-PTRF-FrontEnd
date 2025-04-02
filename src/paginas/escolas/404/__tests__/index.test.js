import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { Pagina404 } from "../index";


describe('<Pagina404>', () => {
  beforeAll(() => {
      // Mockando window.location.assign para evitar navegação real nos testes
      delete window.location;
      window.location = { assign: jest.fn() };
  });
  test('Deve renderizar o componente', async () => {
    render(
        <Pagina404/>
    )
    expect(screen.getByText(
      "Não encontramos a página, clique no link abaixo e seja direcionado para a página inicial")).toBeInTheDocument();
    const botao_login = screen.getByText('Ir para a tela de login');
    expect(botao_login).toBeInTheDocument();
    fireEvent.click(botao_login);
    expect(window.location.assign).toHaveBeenCalledWith("/login");
  });

});
