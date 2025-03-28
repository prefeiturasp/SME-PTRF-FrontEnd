import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { CentralDeNotificacoesPage } from "../index";

describe('<CentralDeNotificacoesPage>', () => {
 
  test('Deve renderizar o componente', async () => {
    render(
        <CentralDeNotificacoesPage/>
    )
    expect(screen.getByText('Notificações')).toBeInTheDocument();
  });

});
