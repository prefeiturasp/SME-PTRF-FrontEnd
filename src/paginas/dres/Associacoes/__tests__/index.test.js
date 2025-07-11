import { render, screen } from "@testing-library/react";
import React  from "react";
import { AssociacoesPage } from "../index";
import { MemoryRouter } from "react-router-dom";


describe('<AssociacoesPage>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
        <MemoryRouter>
          <AssociacoesPage/>
        </MemoryRouter>
    )
    expect(screen.getByText("Consulta por Associações")).toBeInTheDocument();
  });

});
