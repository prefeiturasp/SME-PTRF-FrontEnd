import { render, screen } from "@testing-library/react";
import React  from "react";
import { AssociacoesPage } from "../index";


describe('<AssociacoesPage>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
        <AssociacoesPage/>
    )
    expect(screen.getByText("Consulta por Associações")).toBeInTheDocument();
  });

});
