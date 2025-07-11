import { render, screen } from "@testing-library/react";
import React  from "react";
import { RelatorioConsolidadoPage } from "../index";
import { MemoryRouter } from "react-router-dom";

describe('<RelatorioConsolidadoPage>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
        <MemoryRouter>
          <RelatorioConsolidadoPage/>
        </MemoryRouter>
    )
    expect(screen.getByText("Análise dos relatórios consolidados das DRES")).toBeInTheDocument();
  });

});
