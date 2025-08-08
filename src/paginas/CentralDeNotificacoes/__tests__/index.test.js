import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { CentralDeNotificacoesPage } from "../index";
import { MemoryRouter } from "react-router-dom";

describe('<CentralDeNotificacoesPage>', () => {
 
  test('Deve renderizar o componente', async () => {
    render(
      <MemoryRouter>
        <CentralDeNotificacoesPage/>
      </MemoryRouter>
    )
    expect(screen.getByText('Notificações')).toBeInTheDocument();
  });

});
