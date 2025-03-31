import { render, screen } from "@testing-library/react";
import React  from "react";
import { RelatorioConsolidadoPage } from "../index";

describe('<RelatorioConsolidadoPage>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
        <RelatorioConsolidadoPage/>
    )
    expect(screen.getByText("Análise dos relatórios consolidados das DRES")).toBeInTheDocument();
  });

});
